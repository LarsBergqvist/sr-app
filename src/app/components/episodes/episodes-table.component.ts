import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs/operators';
import { PlayAudioMessage } from 'src/app/messages/play-audio.message';
import { ShowEpisodeDetailsMessage } from 'src/app/messages/show-episodedetails.message';
import { MessageBrokerService } from 'src/app/services/message-broker.service';
import { SRApiService } from 'src/app/services/srapi.service';
import { EpisodeViewModel } from './episode-viewmodel';

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
  @Input('episodes') episodes: EpisodeViewModel[];
  @Input('totalHits') totalHits: number;
  @Input('pageSize') pageSize: number;
  @Input('showSearch') showSearch: boolean;
  @Input('showProgramName') showProgramName: boolean;
  @Output() onLoadLazy = new EventEmitter<EpisodesLoadLazyArgs>();
  @ViewChild('search') search: ElementRef;

  query = '';

  constructor(private readonly srApiService: SRApiService, private readonly broker: MessageBrokerService) {}

  ngOnInit(): void {}

  async ngAfterViewInit() {
    fromEvent(this.search.nativeElement, 'keyup')
      .pipe(
        filter(Boolean),
        debounceTime(800),
        distinctUntilChanged(),
        tap(() => {
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

  isCurrentlyPlaying(episode: EpisodeViewModel): boolean {
    return this.srApiService.isCurrentlyPlaying(episode.url);
  }

  onPlayEpisode(episode: EpisodeViewModel) {
    this.broker.sendMessage(new PlayAudioMessage(episode.title, episode.url));
  }

  onOpenDetails(episode: EpisodeViewModel) {
    this.broker.sendMessage(new ShowEpisodeDetailsMessage(episode));
  }
}
