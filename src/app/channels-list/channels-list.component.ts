import { Component } from '@angular/core';
import { ChannelsService } from '../channels.service';
import { LazyLoadEvent } from 'primeng-lts/api';
import { ChannelsResult } from '../models/channels-result';
import { Channel } from '../models/channel';
import { MessageBrokerService } from '../services/message-broker.service';
import { PlayChannelMessage } from '../messages/play-channel.message';

@Component({
    selector: 'app-channels-list',
    templateUrl: './channels-list.component.html',
    styleUrls: ['./channels-list.component.css']
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

    rowClicked(channel: any) {
        this.broker.sendMessage(new PlayChannelMessage(channel.name, channel.liveaudio.url));
    }

}
