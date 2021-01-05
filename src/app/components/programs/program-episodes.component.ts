import { Component, OnInit } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { PlayAudioMessage } from 'src/app/messages/play-audio.message';
import { ShowEpisodeDetailsMessage } from 'src/app/messages/show-episodedetails.message';
import { Episode } from 'src/app/models/episode';
import { Program } from 'src/app/models/program';
import { EpisodesService } from 'src/app/services/episodes.service';
import { MessageBrokerService } from 'src/app/services/message-broker.service';
import { SRApiService } from 'src/app/services/srapi.service';
import { convertFromJSONstring } from 'src/app/utils/date-helper';

@Component({
  selector: 'app-program-episodes',
  templateUrl: './program-episodes.component.html'
})
export class ProgramEpisodesComponent implements OnInit {
  program: Program;
  isVisible = false;
  episodes: Episode[];
  totalHits = 0;
  pageSize = 5;

  constructor(
    private readonly service: EpisodesService,
    private readonly srApiService: SRApiService,
    private readonly broker: MessageBrokerService
  ) {}

  ngOnInit(): void {}

  show(program: Program) {
    this.program = program;
    this.isVisible = true;
    this.fetch(program.id, 0);
  }

  close() {
    this.isVisible = false;
  }
  async loadLazy(event: LazyLoadEvent) {
    await this.fetch(this.program.id, event.first);
  }

  async fetch(programId: number, first: number) {
    if (!programId) return;
    const page = first / this.pageSize + 1;
    const episodesResult = await this.service.fetchEpisodes(programId, page, this.pageSize);
    this.totalHits = episodesResult.pagination.totalhits;
    this.episodes = episodesResult.episodes;
    this.episodes.forEach((e) => {
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

  onOpenDetails(episode: Episode) {
    this.broker.sendMessage(new ShowEpisodeDetailsMessage(episode));
  }
}
