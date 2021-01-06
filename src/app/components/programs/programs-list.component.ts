import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Program } from '../../models/program';
import { SRApiService } from 'src/app/services/srapi.service';
import { Subject } from 'rxjs';
import { takeUntil, first } from 'rxjs/operators';
import { ProgramEpisodesComponent } from './program-episodes.component';

@Component({
  selector: 'app-programs-list',
  templateUrl: './programs-list.component.html',
  styles: [
    `
      :host ::ng-deep .p-datatable .p-datatable-header {
        position: -webkit-sticky;
        position: sticky;
        top: 120px;
      }
    `
  ]
})
export class ProgramsListComponent implements OnInit, OnDestroy {
  programs: Program[];
  allPrograms: Program[];
  private unsubscribe$ = new Subject();
  showOnlyFavs = false;

  @ViewChild(ProgramEpisodesComponent) episodesComp: ProgramEpisodesComponent;
  constructor(private readonly srApiService: SRApiService) {}

  async ngOnInit() {
    this.srApiService.programs$.pipe(takeUntil(this.unsubscribe$)).subscribe((values: Program[]) => {
      if (values) {
        this.allPrograms = [];
        this.allPrograms.push(...values);
        this.programs = this.allPrograms;
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

  onFilterFavClicked(event) {
    this.showOnlyFavs = event.checked;
    this.filterFavs();
  }

  private filterFavs() {
    if (this.showOnlyFavs) {
      this.programs = this.allPrograms.filter((p) => p.fav);
    } else {
      this.programs = this.allPrograms;
    }
  }

  onAddToFavorites(programId: number, programName: string) {
    this.srApiService.addProgramToFavorites(programId, programName);
    this.filterFavs();
  }

  onRemoveFromFavorites(programId: number, programName: string) {
    this.srApiService.removeProgramFromFavorites(programId, programName);
    this.filterFavs();
  }
}
