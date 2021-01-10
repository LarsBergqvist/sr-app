import { Component, ElementRef, ViewChild } from '@angular/core';
import { Episode } from 'src/app/models/episode';
import { EpisodesService } from 'src/app/services/episodes.service';
import { SRApiService } from 'src/app/services/srapi.service';
import { convertFromJSONstring } from 'src/app/utils/date-helper';
import { EpisodesLoadLazyArgs } from './episodes-table.component';

@Component({
  selector: 'app-episodes-list',
  templateUrl: './episodes-list.component.html',
  styleUrls: ['../common/datatable-styling.scss']
})
export class EpisodesListComponent {
  episodes: Episode[];
  totalHits = 0;
  pageSize = 5;
  query = '';

  @ViewChild('search') search: ElementRef;
  constructor(private readonly service: EpisodesService, private readonly srApiService: SRApiService) {}

  async loadLazy(event: EpisodesLoadLazyArgs) {
    await this.fetch(event.query, event.first);
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
}
