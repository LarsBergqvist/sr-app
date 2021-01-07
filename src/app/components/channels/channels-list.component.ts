import { Component, OnInit, ViewChild } from '@angular/core';
import { Channel } from '../../models/channel';
import { MessageBrokerService } from '../../services/message-broker.service';
import { PlayAudioMessage } from '../../messages/play-audio.message';
import { ChannelDetailsComponent } from './channel-details.component';
import { ChannelScheduleComponent } from './channel-schedule.component';
import { SRApiService } from 'src/app/services/srapi.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-channels-list',
  templateUrl: './channels-list.component.html',
  styleUrls: ['../common/datatable-styling.scss']
})
export class ChannelsListComponent implements OnInit {
  channels: Channel[];
  totalHits = 0;
  pageSize = 5;

  private unsubscribe$ = new Subject();

  @ViewChild(ChannelDetailsComponent) details: ChannelDetailsComponent;
  @ViewChild(ChannelScheduleComponent) schedule: ChannelScheduleComponent;

  constructor(private readonly srApiService: SRApiService, private readonly broker: MessageBrokerService) {}

  async ngOnInit() {
    this.srApiService.channels$.pipe(takeUntil(this.unsubscribe$)).subscribe((values) => {
      if (values) {
        this.channels = values;
      }
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onPlayChannel(channel: Channel) {
    this.broker.sendMessage(new PlayAudioMessage(channel.name, channel.liveaudio.url));
  }

  onOpenDetails(channel: Channel) {
    this.details.show(channel);
  }

  onOpenSchedule(channel: Channel) {
    this.schedule.show(channel);
  }

  isCurrentlyPlaying(url: string): boolean {
    return this.srApiService.isCurrentlyPlaying(url);
  }
}
