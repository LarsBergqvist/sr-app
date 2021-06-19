import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ShowProgramDetailsMessage } from 'src/app/messages/show-programdetails.message';
import { ProgramCategory } from 'src/app/models/program-category';
import { MessageBrokerService } from 'src/app/services/message-broker.service';
import { SRApiService } from 'src/app/services/srapi.service';
import { TranslationService } from 'src/app/services/translation.service';
import { Program } from '../../models/program';
import { ProgramDetailsComponent } from './program-details.component';

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

  @ViewChild(ProgramDetailsComponent) episodesComp: ProgramDetailsComponent;
  constructor(
    private readonly srApiService: SRApiService,
    private readonly translationService: TranslationService,
    private readonly broker: MessageBrokerService
  ) {}

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
    this.broker.sendMessage(new ShowProgramDetailsMessage(program.id));
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
