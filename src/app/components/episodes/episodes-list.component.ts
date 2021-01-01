import { Component, OnDestroy, OnInit } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { PlayAudioMessage } from 'src/app/messages/play-audio.message';
import { Episode } from 'src/app/models/episode';
import { EpisodesResult } from 'src/app/models/episodes-result';
import { EpisodesService } from 'src/app/services/episodes.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { MessageBrokerService } from 'src/app/services/message-broker.service';
import { SRApiService } from 'src/app/services/srapi.service';
import { convertFromJSONstring } from 'src/app/utils/date-helper';

export interface EpisodesListState {
  episodes: Episode[];
  totalHits: number;
  pageSize: number;
  programId?: number;
}
@Component({
  selector: 'app-episodes-list',
  templateUrl: './episodes-list.component.html'
})
export class EpisodesListComponent implements OnInit, OnDestroy {
  state: EpisodesListState = {
    episodes: [],
    totalHits: 0,
    pageSize: 5,
    programId: null
  };

  constructor(
    private readonly service: EpisodesService,
    private readonly srApiService: SRApiService,
    private readonly broker: MessageBrokerService,
    private readonly storageService: LocalStorageService
  ) {}
  ngOnInit(): void {
    const oldState = this.storageService.get('EpisodesListComponent');
    if (oldState) {
      this.state = oldState;
    }
  }

  ngOnDestroy(): void {
    this.storageService.set('EpisodesListComponent', this.state);
  }

  async loadLazy(event: LazyLoadEvent) {
    await this.fetch(this.state.programId, event.first);
  }

  async fetch(programId: number, first: number) {
    if (!programId) return;
    this.state.programId = programId;
    const page = first / this.state.pageSize + 1;
    const episodesResult = await this.service.fetchEpisodes(this.state.programId, page, this.state.pageSize);
    this.state.totalHits = episodesResult.pagination.totalhits;
    this.state.episodes = episodesResult.episodes;
    this.state.episodes.forEach((e) => {
      if (e.publishdateutc) {
        e.publishdateutcDate = convertFromJSONstring(e.publishdateutc);
      }
      if (e.channelid) {
        e.channelName = this.srApiService.getChannelNameFromId(e.channelid);
      }
    });
  }

  hasSound(episode: Episode) {
    if (episode?.listenpodfile || episode?.broadcast?.broadcastfiles?.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  onPlayEpisode(episode: Episode) {
    if (episode?.listenpodfile) {
      this.broker.sendMessage(new PlayAudioMessage(episode.title, episode.listenpodfile.url));
    } else if (episode?.broadcast?.broadcastfiles?.length > 0) {
      this.broker.sendMessage(new PlayAudioMessage(episode.title, episode.broadcast?.broadcastfiles[0].url));
    }
  }
}
