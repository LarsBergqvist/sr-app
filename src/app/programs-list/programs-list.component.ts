import { Component } from '@angular/core';
import { ProgramsService } from '../programs.service';
import { LazyLoadEvent } from 'primeng/api';
import { Program } from '../models/program';
import { ProgramsResult } from '../models/programs-result';

@Component({
    selector: 'app-programs-list',
    templateUrl: './programs-list.component.html'
})
export class ProgramsListComponent {

    programsResult: ProgramsResult;
    programs: Program[];
    totalHits = 0;
    pageSize = 5;
    currentUrlToPlay: '';
    currentStation =  '';

    constructor(private readonly service: ProgramsService) { }

    async loadLazy(event: LazyLoadEvent) {
        const filters = event.filters;
        let filter;
        let filterValue;
        if (filters && filters.name) {
            filter = 'program.name';
            filterValue = filters.name.value;
        }
        const page = event.first / this.pageSize + 1;
        this.programsResult = await this.service.getPrograms(page, this.pageSize, filter, filterValue);
        this.totalHits = this.programsResult.pagination.totalhits;
        this.programs = this.programsResult.programs;
    }
}
