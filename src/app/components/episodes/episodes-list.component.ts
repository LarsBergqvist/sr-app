import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs/operators';
import { PlayAudioMessage } from 'src/app/messages/play-audio.message';
import { ShowEpisodeDetailsMessage } from 'src/app/messages/show-episodedetails.message';
import { Episode } from 'src/app/models/episode';
import { EpisodesService } from 'src/app/services/episodes.service';
import { MessageBrokerService } from 'src/app/services/message-broker.service';
import { SRApiService } from 'src/app/services/srapi.service';
import { convertFromJSONstring } from 'src/app/utils/date-helper';

@Component({
  selector: 'app-episodes-list',
  templateUrl: './episodes-list.component.html'
})
export class EpisodesListComponent implements OnInit, AfterViewInit {
  episodes: Episode[];
  totalHits = 0;
  pageSize = 5;
  query = '';

  @ViewChild('search') search: ElementRef;
  constructor(
    private readonly service: EpisodesService,
    private readonly srApiService: SRApiService,
    private readonly broker: MessageBrokerService
  ) {}

  async ngOnInit() {}

  async ngAfterViewInit() {
    fromEvent(this.search.nativeElement, 'keyup')
      .pipe(
        filter(Boolean),
        debounceTime(800),
        distinctUntilChanged(),
        tap((text) => {
          this.query = this.search.nativeElement.value;
          if (this.query.length > 3) {
            this.fetch(this.query, 0);
          }
        })
      )
      .subscribe();
  }

  async loadLazy(event: LazyLoadEvent) {
    await this.fetch(this.query, event.first);
  }

  async fetch(query: string, first: number) {
    if (!query) return;
    const page = first / this.pageSize + 1;
    const episodesResult = await this.service.searchEpisodes(query, page, this.pageSize);
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
    return episode?.listenpodfile || episode?.broadcast?.broadcastfiles?.length > 0;
  }

  isCurrentlyPlaying(episode: Episode): boolean {
    let url: string = null;
    if (episode?.broadcast?.broadcastfiles?.length > 0) {
      url = episode.broadcast.broadcastfiles[0].url;
    } else if (episode?.listenpodfile?.url) {
      url = episode.listenpodfile.url;
    }
    return this.srApiService.isCurrentlyPlaying(url);
  }

  onPlayEpisode(episode: Episode) {
    if (episode?.broadcast?.broadcastfiles?.length > 0) {
      this.broker.sendMessage(new PlayAudioMessage(episode.title, episode.broadcast?.broadcastfiles[0].url));
    } else if (episode?.listenpodfile?.url) {
      this.broker.sendMessage(new PlayAudioMessage(episode.title, episode.listenpodfile.url));
    }
  }

  onShowEpisodeDetails(episode: Episode) {
    this.broker.sendMessage(new ShowEpisodeDetailsMessage(episode));
  }
}
