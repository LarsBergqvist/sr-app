import { Component } from '@angular/core';
import { SRApiService } from './services/srapi.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'sr-app';

    constructor(private readonly srApiService: SRApiService) {}

    async ngOnInit() {
        await this.srApiService.fetchBaseData();
    }
}
