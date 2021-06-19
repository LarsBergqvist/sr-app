import { Component, ElementRef, ViewChild } from '@angular/core';
import { EpisodesResult } from 'src/app/models/episodes-result';
import { EpisodesService } from 'src/app/services/episodes.service';
import { SRApiService } from 'src/app/services/srapi.service';
import { EpisodeViewModel } from './episode-viewmodel';
import { EpisodesLoadLazyArgs } from './episodes-table.component';

@Component({
  selector: 'app-episodes-list',
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

  async fetchBookmarkedEpisodes(): Promise<EpisodesResult> {
    let list: number[] = [697028, 685238, 681604];
    const res = await this.service.fetchEpisodes(list);
    return res;
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
