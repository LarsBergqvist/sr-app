import { Component, OnInit } from '@angular/core';
import { Program } from 'src/app/models/program';
import { EpisodesService } from 'src/app/services/episodes.service';
import { SRApiService } from 'src/app/services/srapi.service';
import { EpisodeViewModel } from '../episodes/episode-viewmodel';
import { EpisodesLoadLazyArgs } from '../episodes/episodes-table.component';

@Component({
  selector: 'app-program-details',
  templateUrl: './program-details.component.html',
  styleUrls: ['./program-details.component.scss']
})
export class ProgramDetailsComponent implements OnInit {
  program: Program;
  isVisible = false;
  episodes: EpisodeViewModel[];
  totalHits = 0;
  pageSize = 5;

  constructor(private readonly service: EpisodesService, private readonly srApiService: SRApiService) {}

  ngOnInit(): void {}

  async show(program: Program) {
    this.episodes = [];
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
    this.episodes = [];
    episodesResult.episodes.forEach((e) => {
      const viewModel = new EpisodeViewModel(e);
      this.episodes.push(viewModel);
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
