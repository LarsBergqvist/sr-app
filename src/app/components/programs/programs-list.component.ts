import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Program } from '../../models/program';
import { SRApiService } from 'src/app/services/srapi.service';
import { Subject } from 'rxjs';
import { takeUntil, first } from 'rxjs/operators';
import { ProgramEpisodesComponent } from './program-episodes.component';

@Component({
  selector: 'app-programs-list',
  templateUrl: './programs-list.component.html'
})
export class ProgramsListComponent implements OnInit, OnDestroy {
  programs: Program[];
  private unsubscribe$ = new Subject();

  @ViewChild(ProgramEpisodesComponent) episodesComp: ProgramEpisodesComponent;
  constructor(private readonly srApiService: SRApiService) {}

  async ngOnInit() {
    this.srApiService.programs$.pipe(takeUntil(this.unsubscribe$)).subscribe((values) => {
      if (values) {
        this.programs = values;
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onShowEpisodes(program: Program) {
    this.episodesComp.show(program);
  }
}
