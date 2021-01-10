import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { fromEvent } from 'rxjs/internal/observable/fromEvent';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs/operators';
import { PlayAudioMessage } from 'src/app/messages/play-audio.message';
import { ShowEpisodeDetailsMessage } from 'src/app/messages/show-episodedetails.message';
import { Episode } from 'src/app/models/episode';
import { EpisodesService } from 'src/app/services/episodes.service';
import { MessageBrokerService } from 'src/app/services/message-broker.service';
import { SRApiService } from 'src/app/services/srapi.service';

export interface EpisodesLoadLazyArgs {
  query?: string;
  first: number;
}
@Component({
  selector: 'app-episodes-table',
  templateUrl: './episodes-table.component.html',
  styleUrls: ['./episodes-table.component.scss']
})
export class EpisodesTableComponent implements OnInit, AfterViewInit {
  @Input('episodes') episodes: Episode[];
  @Input('totalHits') totalHits: number;
  @Input('pageSize') pageSize: number;
  @Input('showSearch') showSearch: boolean;
  @Output() onLoadLazy = new EventEmitter<EpisodesLoadLazyArgs>();
  @ViewChild('search') search: ElementRef;

  query = '';

  constructor(
    private readonly service: EpisodesService,
    private readonly srApiService: SRApiService,
    private readonly broker: MessageBrokerService
  ) {}

  ngOnInit(): void {}

  async ngAfterViewInit() {
    fromEvent(this.search.nativeElement, 'keyup')
      .pipe(
        filter(Boolean),
        debounceTime(800),
        distinctUntilChanged(),
        tap((text) => {
          this.query = this.search.nativeElement.value;
          if (this.query.length > 3) {
            this.onLoadLazy.emit({ query: this.query, first: 0 });
          }
        })
      )
      .subscribe();
  }

  async loadLazy(event: LazyLoadEvent) {
    this.onLoadLazy.emit({ query: this.query, first: event.first });
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

  onOpenDetails(episode: Episode) {
    this.broker.sendMessage(new ShowEpisodeDetailsMessage(episode));
  }
}
