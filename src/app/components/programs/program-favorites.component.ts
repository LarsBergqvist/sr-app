import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { BookmarkChangedMessage } from 'src/app/messages/bookmark-changed.message';
import { FavoriteChangedMessage } from 'src/app/messages/favorite-changed.message';
import { Program } from 'src/app/models/program';
import { MessageBrokerService } from 'src/app/services/message-broker.service';
import { ProgramsService } from 'src/app/services/programs.service';
import { SRApiService } from 'src/app/services/srapi.service';

@Component({
  selector: 'app-program-favorites',
  templateUrl: './program-favorites.component.html',
  styleUrls: ['./program-favorites.component.scss']
})
export class ProgramFavoritesComponent implements OnInit {
  programs: Program[];
  totalHits = 0;
  pageSize = 100;
  private unsubscribe$ = new Subject();

  constructor(
    private readonly service: ProgramsService,
    private readonly srApiService: SRApiService,
    private readonly broker: MessageBrokerService
  ) {}

  ngOnInit(): void {
    const messages = this.broker.getMessage();
    messages
      .pipe(
        takeUntil(this.unsubscribe$),
        filter((message) => message instanceof FavoriteChangedMessage)
      )
      .subscribe((message: FavoriteChangedMessage) => {
        this.fetch(0);
      });
  }

  async loadLazy(event: any) { // TODO EpisodesLoadLazyArgs) {
    await this.fetch(event.first);
  }

  async fetch(first: number) {
    console.log('Fetch!')
    /*
    const bookmarkedEpisodes = this.srApiService.getBookmarkedEpisodes();

    const episodesResult = await this.service.fetchEpisodes(bookmarkedEpisodes);
    this.totalHits = episodesResult.pagination.totalhits;
    this.episodes = [];
    episodesResult.episodes.forEach((e) => {
      const viewModel = new EpisodeViewModel(e);
      this.episodes.push(viewModel);
      
    });
    */
  }
}
