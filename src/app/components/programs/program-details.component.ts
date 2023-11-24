import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { NavigateBackMessage } from 'src/app/messages/navigate-back.message';
import { Program } from 'src/app/models/program';
import { EpisodesService } from 'src/app/services/episodes.service';
import { MessageBrokerService } from 'src/app/services/message-broker.service';
import { SRApiService } from 'src/app/services/srapi.service';
import { EpisodeViewModel } from '../episodes/episode-viewmodel';
import { EpisodesLoadLazyArgs } from '../episodes/episodes-table.component';
import { ProgramsService } from 'src/app/services/programs.service';

@Component({
  selector: 'app-program-details',
  templateUrl: './program-details.component.html',
  styleUrls: ['./program-details.component.scss']
})
export class ProgramDetailsComponent implements OnInit, OnDestroy {
  program: Program;
  episodes: EpisodeViewModel[];
  totalHits = 0;
  pageSize = 5;
  private unsubscribe$ = new Subject();

  constructor(
    private readonly service: EpisodesService,
    private readonly srApiService: SRApiService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly broker: MessageBrokerService,
    private readonly programsService: ProgramsService,
  ) {}

  async ngOnInit() {
    this.activatedRoute.params
      .pipe(
        takeUntil(this.unsubscribe$),
        map((route) => route.id)
      )
      .subscribe(async (id: string) => {
        const program = await this.programsService.fetchProgramWithId(parseInt(id));
        if (program) {
          await this.show(program);
        }
        console.log('todo')
//        const program = await this.srApiService.getProgramFromId(parseInt(id));
//        if (program) {
//          await this.show(program);
//        }
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next(undefined);
    this.unsubscribe$.complete();
  }

  async show(program: Program) {
    this.episodes = [];
    this.program = program;
    await this.fetch(program.id, 0);
  }

  close() {
    this.broker.sendMessage(new NavigateBackMessage());
  }

  async loadLazy(event: EpisodesLoadLazyArgs) {
    await this.fetch(this.program.id, event.first);
  }

  async fetch(programId: number, first: number) {
    if (!programId) return;
    const page = first / this.pageSize + 1;
    const episodesResult = await this.service.fetchEpisodesForProgram(programId, page, this.pageSize);
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
}
