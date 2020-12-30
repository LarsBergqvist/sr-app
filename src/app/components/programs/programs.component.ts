import { Component, OnInit } from '@angular/core';
import { ProgramsService } from '../../services/programs.service';
import {SelectItem} from 'primeng-lts/api';

@Component({
    selector: 'app-programs',
    templateUrl: './programs.component.html',
    styleUrls: ['./programs.component.scss']
})
export class ProgramsComponent implements OnInit {

    categoryOptions: SelectItem[];
    selectedCategory: string;

    constructor(private readonly service: ProgramsService) { }

    async ngOnInit() { 
        const result = await this.service.getProgramCategories();
        this.categoryOptions = [];
        this.categoryOptions.push({ label: 'All', value: null })
        const categories = result.programcategories.map(c => ({ label: c.name, value: c.id }));
        this.categoryOptions.push(...categories);
    }

    onCategoryChanged(event) {
    }
}
