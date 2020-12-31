import { Component } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { PlayAudioMessage } from 'src/app/messages/play-audio.message';
import { Episode } from 'src/app/models/episode';
import { EpisodesResult } from 'src/app/models/episodes-result';
import { EpisodesService } from 'src/app/services/episodes.service';
import { MessageBrokerService } from 'src/app/services/message-broker.service';
import { SRApiService } from 'src/app/services/srapi.service';

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
                private readonly srApiService: SRApiService,
                private readonly broker: MessageBrokerService) { }

    async loadLazy(event: LazyLoadEvent) {
        await this.fetch(this.programId, event.first);
    }

    async fetch(programId: string, first: number) {
        if (!programId) return;
        this.programId = programId;
        const page = first / this.pageSize + 1;
        this.episodesResult = await this.service.fetchEpisodes(this.programId, page, this.pageSize);
        this.totalHits = this.episodesResult.pagination.totalhits;
        this.episodes = this.episodesResult.episodes;
        this.episodes.forEach(e => {
            if (e.publishdateutc) {
                e.publishdateutcDate = new Date(JSON.parse(e.publishdateutc.match(/\d+/)[0]));
            }
            if (e.channelid) {
                e.channelName = this.srApiService.getChannelNameFromId(e.channelid);
            }
        });

    }

    hasSound(episode: Episode) {
        if (episode?.listenpodfile || episode?.broadcast?.broadcastfiles?.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    rowClicked(episode: Episode) {
        if (episode?.listenpodfile) {
            this.broker.sendMessage(new PlayAudioMessage(episode.title, episode.listenpodfile.url));
        } else if (episode?.broadcast?.broadcastfiles?.length > 0) {
            this.broker.sendMessage(new PlayAudioMessage(episode.title, episode.broadcast?.broadcastfiles[0].url));
        }
    }
}
