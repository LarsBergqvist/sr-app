import { Component } from '@angular/core';
import { LazyLoadEvent } from 'primeng-lts/api';
import { PlayChannelMessage } from 'src/app/messages/play-channel.message';
import { Episode } from 'src/app/models/episode';
import { EpisodesResult } from 'src/app/models/episodes-result';
import { EpisodesService } from 'src/app/services/episodes.service';
import { MessageBrokerService } from 'src/app/services/message-broker.service';

@Component({
    selector: 'app-episodes-list',
    templateUrl: './episodes-list.component.html'
})
export class EpisodesListComponent {
    episodesResult: EpisodesResult;
    episodes: Episode[];
    totalHits = 0;
    pageSize = 5;
    programId = null;

    constructor(private readonly service: EpisodesService,
                private readonly broker: MessageBrokerService) { }

    async loadLazy(event: LazyLoadEvent) {
        await this.fetch(this.programId, event.first);
    }

    async fetch(programId: string, first: number) {
        this.programId = programId;
        const page = first / this.pageSize + 1;
        this.episodesResult = await this.service.fetchEpisodes(this.programId, page, this.pageSize);
        this.totalHits = this.episodesResult.pagination.totalhits;
        this.episodes = this.episodesResult.episodes;
        this.episodes.forEach(e => {
            if (e.broadcasttime && e.broadcasttime.starttimeutc) {
                e.starttimeutc = new Date(JSON.parse(e.broadcasttime.starttimeutc.match(/\d+/)[0]));
            }
        });

    }

    rowClicked(episode: Episode) {
        if (episode.listenpodfile) {
            this.broker.sendMessage(new PlayChannelMessage(episode.title, episode.listenpodfile.url));
        }
    }
}
