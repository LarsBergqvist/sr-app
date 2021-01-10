import { Component, OnInit } from '@angular/core';
import { Episode } from 'src/app/models/episode';
import { Program } from 'src/app/models/program';
import { EpisodesService } from 'src/app/services/episodes.service';
import { SRApiService } from 'src/app/services/srapi.service';
import { convertFromJSONstring } from 'src/app/utils/date-helper';
import { EpisodesLoadLazyArgs } from '../episodes/episodes-table.component';

@Component({
  selector: 'app-program-episodes',
  templateUrl: './program-episodes.component.html',
  styleUrls: ['./program-episodes.component.scss']
})
export class ProgramEpisodesComponent implements OnInit {
  program: Program;
  isVisible = false;
  episodes: Episode[];
  totalHits = 0;
  pageSize = 5;

  constructor(private readonly service: EpisodesService, private readonly srApiService: SRApiService) {}

  ngOnInit(): void {}

  async show(program: Program) {
    this.program = program;
    await this.fetch(program.id, 0);
    this.isVisible = true;
  }

  close() {
    this.isVisible = false;
  }

  async loadLazy(event: EpisodesLoadLazyArgs) {
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

  getCategoryNameFromId(id: number) {
    return this.srApiService.getCategoryNameFromId(id);
  }

  onAddToFavorites(programId: number, programName: string) {
    this.srApiService.addProgramToFavorites(programId, programName);
  }

  onRemoveFromFavorites(programId: number, programName: string) {
    this.srApiService.removeProgramFromFavorites(programId, programName);
  }
}
