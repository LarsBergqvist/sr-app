import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { EpisodesService } from 'src/app/services/episodes.service';
import { EpisodesListComponent } from './episodes-list.component';

@Component({
    selector: 'app-episodes',
    templateUrl: './episodes.component.html',
    styleUrls: ['./episodes.component.scss']
})
export class EpisodesComponent {
    query: string;

    @ViewChild(EpisodesListComponent) list: EpisodesListComponent;

    constructor() { }

    onSearch(event: any) {
        console.log('search');
        if (this.list) {
            this.list.fetch(this.query, 0);
        }
    }
}
