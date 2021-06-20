import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Table } from 'primeng/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ShowProgramDetailsMessage } from 'src/app/messages/show-programdetails.message';
import { ProgramCategory } from 'src/app/models/program-category';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { MessageBrokerService } from 'src/app/services/message-broker.service';
import { SRApiService } from 'src/app/services/srapi.service';
import { TranslationService } from 'src/app/services/translation.service';
import { Program } from '../../models/program';

@Component({
  selector: 'app-programs-list',
  templateUrl: './programs-list.component.html',
  styleUrls: ['../common/datatable-styling.scss', './programs-list.component.scss']
})
export class ProgramsListComponent implements OnInit, OnDestroy, AfterViewInit {
  programs: Program[];
  categoryOptions: SelectItem[];
  private unsubscribe$ = new Subject();

  private readonly storageId = 'ProgramsListState';
  localState = {
    showOnlyFavs: false,
    selectedCategory: null,
    searchString: ''
  };

  @ViewChild(Table) tableComponent: Table;

  constructor(
    private readonly srApiService: SRApiService,
    private readonly translationService: TranslationService,
    private readonly broker: MessageBrokerService,
    private readonly storage: LocalStorageService
  ) {}

  async ngOnInit() {
    const oldState = this.storage.get(this.storageId);
    if (oldState) {
      this.localState = oldState;
    }

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

  ngAfterViewInit(): void {
    if (this.tableComponent) {
      if (this.localState.showOnlyFavs) {
        this.tableComponent.filter(true, 'fav', 'equals');
      } else {
        this.tableComponent.filter([true, false], 'fav', 'in');
      }

      if (this.localState.selectedCategory) {
        this.tableComponent.filter(this.localState.selectedCategory, 'programcategory.id', 'equals');
      }

      if (this.localState.searchString) {
        this.tableComponent.filterGlobal(this.localState.searchString, 'contains');
      }
    }
  }

  ngOnDestroy() {
    this.storage.set(this.storageId, this.localState);
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onShowEpisodes(program: Program) {
    this.broker.sendMessage(new ShowProgramDetailsMessage(program.id));
  }

  onFilterFavClicked(event, dt) {
    this.localState.showOnlyFavs = event.checked;
    if (this.localState.showOnlyFavs) {
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
