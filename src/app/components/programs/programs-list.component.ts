import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Program } from '../../models/program';
import { SRApiService } from 'src/app/services/srapi.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ProgramEpisodesComponent } from './program-episodes.component';
import { ProgramCategory } from 'src/app/models/program-category';
import { SelectItem } from 'primeng/api';
import { TranslationService } from 'src/app/services/translation.service';

@Component({
  selector: 'app-programs-list',
  templateUrl: './programs-list.component.html',
  styleUrls: ['../common/datatable-styling.scss', './programs-list.component.scss']
})
export class ProgramsListComponent implements OnInit, OnDestroy {
  programs: Program[];
  categoryOptions: SelectItem[];
  private unsubscribe$ = new Subject();
  showOnlyFavs = false;

  @ViewChild(ProgramEpisodesComponent) episodesComp: ProgramEpisodesComponent;
  constructor(private readonly srApiService: SRApiService, private readonly translationService: TranslationService) {}

  async ngOnInit() {
    this.srApiService.programs$.pipe(takeUntil(this.unsubscribe$)).subscribe((values: Program[]) => {
      if (values) {
        this.programs = [];
        this.programs.push(...values);
      }
    });
    this.srApiService.programCategories$.pipe(takeUntil(this.unsubscribe$)).subscribe((values: ProgramCategory[]) => {
      if (values) {
        this.categoryOptions = [];
        this.categoryOptions.push({ label: this.translationService.translateWithArgs('AnyCategories'), value: null });
        const categories = values.map((c) => ({ label: c.name, value: c.id }));
        this.categoryOptions.push(...categories);
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

  onFilterFavClicked(event, dt) {
    this.showOnlyFavs = event.checked;
    if (this.showOnlyFavs) {
      dt.filter(true, 'fav', 'equals');
    } else {
      dt.filter([true, false], 'fav', 'in');
    }
  }

  onAddToFavorites(programId: number, programName: string) {
    this.srApiService.addProgramToFavorites(programId, programName);
  }

  onRemoveFromFavorites(programId: number, programName: string) {
    this.srApiService.removeProgramFromFavorites(programId, programName);
  }

  onCategoryChanged(event, dt) {
    if (event.value !== '') {
      dt.filter(event.value, 'programcategory.id', 'equals');
    }
  }
}
