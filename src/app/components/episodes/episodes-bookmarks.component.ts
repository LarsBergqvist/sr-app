import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { BookmarkChangedMessage } from 'src/app/messages/bookmark-changed.message';
import { EpisodesService } from 'src/app/services/episodes.service';
import { MessageBrokerService } from 'src/app/services/message-broker.service';
import { SRApiService } from 'src/app/services/srapi.service';
import { EpisodeViewModel } from './episode-viewmodel';
import { EpisodesLoadLazyArgs } from './episodes-table.component';

@Component({
  selector: 'app-episodes-bookmarks',
  templateUrl: './episodes-bookmarks.component.html',
  styleUrls: ['./episodes-bookmarks.component.scss']
})
export class EpisodesBookmarksComponent implements OnInit {
  episodes: EpisodeViewModel[];
  totalHits = 0;
  pageSize = 5;
  private unsubscribe$ = new Subject();

  constructor(
    private readonly service: EpisodesService,
    private readonly srApiService: SRApiService,
    private readonly broker: MessageBrokerService
  ) {}

  ngOnInit(): void {
    const messages = this.broker.getMessage();
    messages
      .pipe(
        takeUntil(this.unsubscribe$),
        filter((message) => message instanceof BookmarkChangedMessage)
      )
      .subscribe((message: BookmarkChangedMessage) => {
        this.fetch(0);
      });
  }

  async loadLazy(event: EpisodesLoadLazyArgs) {
    await this.fetch(event.first);
  }

  async fetch(first: number) {
    const bookmarkedEpisodes = this.srApiService.getBookmarkedEpisodes();

    const page = first / this.pageSize + 1;
    const episodesResult = await this.service.fetchEpisodes(bookmarkedEpisodes);
    this.totalHits = episodesResult.pagination.totalhits;
    this.episodes = [];
    episodesResult.episodes.forEach((e) => {
      const viewModel = new EpisodeViewModel(e);
      this.episodes.push(viewModel);
    });
  }
}
