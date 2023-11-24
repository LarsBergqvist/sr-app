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
import { ProgramsService } from 'src/app/services/programs.service';

@Component({
  selector: 'app-programs-list',
  templateUrl: './programs-list.component.html',
  styleUrls: ['../common/datatable-styling.scss', './programs-list.component.scss']
})
export class ProgramsListComponent implements OnInit, OnDestroy, AfterViewInit {
  totalHits = 0;
  pageSize = 10;
  programs: Program[];
  categoryOptions: SelectItem[];
  private unsubscribe$ = new Subject();

  private readonly storageId = 'ProgramsListState';
  localState = {
    selectedCategory: null,
  };

  @ViewChild(Table) tableComponent: Table;

  constructor(
    private readonly srApiService: SRApiService,
    private readonly programsService: ProgramsService,
    private readonly translationService: TranslationService,
    private readonly broker: MessageBrokerService,
    private readonly storage: LocalStorageService
  ) {}

  async ngOnInit() {
    const oldState = this.storage.get(this.storageId);
    if (oldState) {
      this.localState = oldState;
    }

    this.srApiService.programCategories$.pipe(takeUntil(this.unsubscribe$)).subscribe((values: ProgramCategory[]) => {
      if (values) {
        this.categoryOptions = [];
        this.categoryOptions.push({ label: this.translationService.translateWithArgs('AnyCategories'), value: null });
        const categories = values.map((c) => ({ label: c.name, value: c.id }));
        this.categoryOptions.push(...categories);
      }
    });

    await this.fetch(0);
  }
  
  async loadLazy(event: any) {
    await this.fetch(event.first);
  }

  async fetch(first: number) {
    const page = first / this.pageSize + 1;
    let result = await this.programsService.fetchPrograms(page,this.pageSize, this.localState.selectedCategory);
    this.totalHits = result.pagination.totalhits;
    this.programs = result.programs;
  }


  ngAfterViewInit(): void {

  }

  ngOnDestroy() {
    this.storage.set(this.storageId, this.localState);
    this.unsubscribe$.next(undefined);
    this.unsubscribe$.complete();
  }

  onShowEpisodes(program: Program) {
    console.log(program)
    this.broker.sendMessage(new ShowProgramDetailsMessage(program.id));
  }


  onCategoryChanged(event, dt) {
    if (event.value !== '') {
      dt.filter(event.value);
    }
  }
}
