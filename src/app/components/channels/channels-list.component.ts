import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ShowChannelDetailsMessage } from 'src/app/messages/show-channeldetails.message';
import { ShowChannelScheduleMessage } from 'src/app/messages/show-channelschedule.message';
import { SRApiService } from 'src/app/services/srapi.service';
import { PlayAudioMessage } from '../../messages/play-audio.message';
import { Channel } from '../../models/channel';
import { MessageBrokerService } from '../../services/message-broker.service';
import { Ga4Service } from 'src/app/services/ga4.services';

@Component({
  selector: 'app-channels-list',
  templateUrl: './channels-list.component.html',
  styleUrls: ['../common/datatable-styling.scss']
})
export class ChannelsListComponent implements OnInit {
  channels: Channel[];
  private unsubscribe$ = new Subject();

  constructor(private readonly srApiService: SRApiService, private readonly broker: MessageBrokerService, private readonly ga4Service: Ga4Service) {}

  async ngOnInit() {
    this.srApiService.channels$.pipe(takeUntil(this.unsubscribe$)).subscribe((values) => {
      if (values) {
        this.channels = values;
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next(undefined);
    this.unsubscribe$.complete();
  }

  onPlayChannel(channel: Channel) {

    this.ga4Service.event('channel_play', {
      channelname: channel.name
    });
    this.broker.sendMessage(new PlayAudioMessage(channel.name, channel.liveaudio.url, undefined, channel.id));
  }

  onOpenDetails(channel: Channel) {
    this.ga4Service.event('channel_details', {
      channelid: channel.id
    });

    this.broker.sendMessage(new ShowChannelDetailsMessage(channel.id));
  }

  onOpenSchedule(channel: Channel) {
    this.broker.sendMessage(new ShowChannelScheduleMessage(channel.id));
  }

  isCurrentlyPlaying(url: string): boolean {
    if (url) {
      return this.srApiService.isCurrentlyPlaying(url);
    } else {
      return false;
    }
  }
}
