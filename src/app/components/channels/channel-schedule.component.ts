import { Component, OnInit } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { ShowEpisodeDetailsMessage } from 'src/app/messages/show-episodedetails.message';
import { Channel } from 'src/app/models/channel';
import { ScheduledEpisode } from 'src/app/models/scheduled-episode';
import { EpisodesService } from 'src/app/services/episodes.service';
import { MessageBrokerService } from 'src/app/services/message-broker.service';
import { convertFromJSONstring } from 'src/app/utils/date-helper';

@Component({
  selector: 'app-channel-schedule',
  templateUrl: './channel-schedule.component.html'
})
export class ChannelScheduleComponent implements OnInit {
  scheduledEpisodes: ScheduledEpisode[];
  totalHits = 0;
  pageSize = 1000;
  isVisible = false;
  channelId: number;
  channel: Channel;

  constructor(private readonly service: EpisodesService, private readonly broker: MessageBrokerService) {}

  ngOnInit(): void {}

  async show(channel: Channel) {
    this.channelId = channel.id;
    this.channel = channel;
    await this.fetch(this.channelId, 0);
    this.isVisible = true;
  }

  async loadLazy(event: LazyLoadEvent) {
    await this.fetch(this.channelId, event.first);
  }

  async fetch(channelId: number, first: number) {
    if (!channelId) return;
    this.channelId = channelId;
    const page = first / this.pageSize + 1;
    const scheduleResult = await this.service.fetchChannelSchedule(channelId, page, this.pageSize);
    this.totalHits = scheduleResult.pagination.totalhits;
    this.scheduledEpisodes = scheduleResult.schedule.map((s) => ({
      title: s.title,
      episodeid: s.episodeid,
      description: s.description,
      starttimeDate: convertFromJSONstring(s?.starttimeutc),
      endtimeDate: convertFromJSONstring(s?.endtimeutc),
      program: s.program
    }));
    this.scheduledEpisodes = this.scheduledEpisodes.filter((s) => s.endtimeDate.getTime() >= Date.now());
  }

  close() {
    this.isVisible = false;
  }

  onOpenDetails(episodeId: number) {
    this.broker.sendMessage(new ShowEpisodeDetailsMessage(null, episodeId));
  }
}
