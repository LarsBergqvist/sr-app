import { Component } from '@angular/core';
import { ChannelsService } from '../channels.service';
import { LazyLoadEvent } from 'primeng-lts/primeng';
import { ChannelsResult } from '../models/channels-result';
import { Channel } from '../models/channel';

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
    currentUrlToPlay: '';
    currentStation =  '';

    constructor(private readonly service: ChannelsService) { }

    async loadChannelsLazy(event: LazyLoadEvent) {
        const page = event.first / this.pageSize + 1;
        this.channelsResult = await this.service.getChannels(page, this.pageSize);
        this.totalHits = this.channelsResult.pagination.totalhits;
        this.channels = this.channelsResult.channels;
    }

    rowClicked(channel: any) {
        console.log('click');
        this.currentStation = channel.name;
        this.currentUrlToPlay = channel.liveaudio.url;
        const audio = document.getElementById('audio');
        (audio as any).load();
        (audio as any).play();
    }

}
