import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { EpisodesTableComponent } from './episodes-table.component';
import { EpisodesBookmarksComponent } from './episodes-bookmarks.component';
import { TranslatePipe } from 'src/app/translations/translate.pipe';
import { EpisodesService } from 'src/app/services/episodes.service';
import { SRApiService } from 'src/app/services/srapi.service';
import { EpisodeViewModel } from './episode-viewmodel';
import { EpisodesLoadLazyArgs } from './episodes-table.component';

@Component({
  standalone: true,
  selector: 'app-episodes-list',
  imports: [CommonModule, TableModule, InputTextModule, EpisodesTableComponent, EpisodesBookmarksComponent],
  templateUrl: './episodes-list.component.html',
  styleUrls: ['../common/datatable-styling.scss']
})
export class EpisodesListComponent {
  episodes: EpisodeViewModel[];
  totalHits = 0;
  pageSize = 5;
  query = '';
  showBookmarked = false;

  @ViewChild('search') search: ElementRef;
  constructor(private readonly service: EpisodesService, private readonly srApiService: SRApiService) {}

  async onShowBookmarkedChanged(showBookmarked: boolean) {
    this.showBookmarked = showBookmarked;
  }

  async loadLazy(event: EpisodesLoadLazyArgs) {
    await this.fetch(event.query, event.first);
  }

  async fetch(query: string, first: number) {
    if (!query) return;
    const page = first / this.pageSize + 1;
    const episodesResult = await this.service.searchEpisodes(query, page, this.pageSize);
    this.totalHits = episodesResult.pagination.totalhits;
    this.episodes = [];
    episodesResult.episodes.forEach((e) => {
      const viewModel = new EpisodeViewModel(e);
      this.episodes.push(viewModel);
    });
  }
}
