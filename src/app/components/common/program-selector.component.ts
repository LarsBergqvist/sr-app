import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SRApiService } from 'src/app/services/srapi.service';

@Component({
    selector: 'app-program-selector',
    templateUrl: './program-selector.component.html',
    styleUrls: ['./program-selector.component.scss']
})
export class ProgramSelectorComponent implements OnInit, OnDestroy {
    programOptions: SelectItem[];
    @Input() selectedProgram: string;
    private unsubscribe$ = new Subject();

    @Output() selectedProgramChanged = new EventEmitter<string>();

    constructor(private readonly srApiService: SRApiService) { }

    async ngOnInit() { 
        this.srApiService.programs$.pipe(takeUntil(this.unsubscribe$)).subscribe(values => {
            if (values) {
                this.programOptions = [];
                const programs = values.map(c => ({ label: c.name, value: c.id }));
                this.programOptions.push(...programs);    
            }
        });
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    onProgramChanged(event) {
        this.selectedProgramChanged.emit(this.selectedProgram);
    }
}
