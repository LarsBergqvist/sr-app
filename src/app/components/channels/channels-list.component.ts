import { Component } from '@angular/core';
import { ChannelsService } from '../../services/channels.service';
import { LazyLoadEvent } from 'primeng/api';
import { ChannelsResult } from '../../models/channels-result';
import { Channel } from '../../models/channel';
import { MessageBrokerService } from '../../services/message-broker.service';
import { PlayAudioMessage } from '../../messages/play-audio.message';

@Component({
    selector: 'app-channels-list',
    templateUrl: './channels-list.component.html',
    styles: ['.channels-list { margin-top: 10px; }']
})
export class ChannelsListComponent {

    channelsResult: ChannelsResult;
    channels: Channel[];
    totalHits = 0;
    pageSize = 5;

    constructor(private readonly service: ChannelsService,
                private readonly broker: MessageBrokerService) { }

    async loadChannelsLazy(event: LazyLoadEvent) {
        const filters = event.filters;
        let filter;
        let filterValue;
        if (filters && filters.name) {
            filter = 'channel.name';
            filterValue = filters.name.value;
        }
        const page = event.first / this.pageSize + 1;
        this.channelsResult = await this.service.getChannels(page, this.pageSize, filter, filterValue);
        this.totalHits = this.channelsResult.pagination.totalhits;
        this.channels = this.channelsResult.channels;
    }

    onPlayChannel(channel: any) {
        this.broker.sendMessage(new PlayAudioMessage(channel.name, channel.liveaudio.url));
    }

}
