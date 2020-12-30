import { Component, OnDestroy, OnInit } from '@angular/core';
@Component({
    selector: 'app-programs',
    templateUrl: './programs.component.html',
    styleUrls: ['./programs.component.scss']
})
export class ProgramsComponent {

    selectedCategory: string;

    constructor() { }

    onCategoryChanged(categoryId: string) {
        this.selectedCategory = categoryId;
    }
}
