import { Component, ViewChild } from '@angular/core';
import { EpisodesListComponent } from './episodes-list.component';

@Component({
    selector: 'app-episodes',
    templateUrl: './episodes.component.html',
    styleUrls: ['./episodes.component.scss']
})
export class EpisodesComponent {
    selectedProgram: string;

    @ViewChild(EpisodesListComponent) list: EpisodesListComponent;

    constructor() { }

    onFetch(event: any) {
        if (this.list) {
            this.list.fetch(this.selectedProgram, 0);
        }
    }

    onProgramChanged(programId: string) {
        this.selectedProgram = programId;
    }
}
