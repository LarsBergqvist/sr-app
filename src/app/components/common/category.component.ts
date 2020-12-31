import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import {SelectItem} from 'primeng/api';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SRApiService } from '../../services/srapi.service';

@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit, OnDestroy {
    categoryOptions: SelectItem[];
    selectedCategory: string;
    private unsubscribe$ = new Subject();

    @Output() selectedCategoryChanged = new EventEmitter<string>();

    constructor(private readonly srApiService: SRApiService) { }

    async ngOnInit() { 
        this.srApiService.programCategories$.pipe(takeUntil(this.unsubscribe$)).subscribe(values => {
            if (values) {
                this.categoryOptions = [];
                this.categoryOptions.push({ label: 'All', value: null })
                const categories = values.map(c => ({ label: c.name, value: c.id }));
                this.categoryOptions.push(...categories);    
            }
        });
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    onCategoryChanged(event) {
        this.selectedCategoryChanged.emit(this.selectedCategory);
    }

}
