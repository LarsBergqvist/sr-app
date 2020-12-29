import { Component, Input } from '@angular/core';
import { ProgramsService } from '../programs.service';
import { LazyLoadEvent } from 'primeng-lts/api';
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
    category = null;

    @Input('Category') set setCategory(value) {
        this.category = value;
        this.fetchPrograms(null, 1);
    };
    
    constructor(private readonly service: ProgramsService) { }

    async loadLazy(event: LazyLoadEvent) {
        const filters = event.filters;
        await this.fetchPrograms(filters, event.first);
    }

    async fetchPrograms(filters, first) {
        let filter;
        let filterValue;
        if (filters && filters.name) {
            filter = 'program.name';
            filterValue = filters.name.value;
        }
        const page = first / this.pageSize + 1;
        this.programsResult = await this.service.getPrograms(page, this.pageSize, filter, filterValue, this.category);
        this.totalHits = this.programsResult.pagination.totalhits;
        this.programs = this.programsResult.programs;
    } 
}
