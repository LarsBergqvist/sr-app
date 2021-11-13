import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { NavigateBackMessage } from 'src/app/messages/navigate-back.message';
import { ShowEpisodeDetailsMessage } from 'src/app/messages/show-episodedetails.message';
import { Channel } from 'src/app/models/channel';
import { ScheduledEpisode } from 'src/app/models/scheduled-episode';
import { EpisodesService } from 'src/app/services/episodes.service';
import { MessageBrokerService } from 'src/app/services/message-broker.service';
import { SRApiService } from 'src/app/services/srapi.service';
import { convertFromJSONstring } from 'src/app/utils/date-helper';

@Component({
  selector: 'app-channel-schedule',
  templateUrl: './channel-schedule.component.html',
  styleUrls: ['../common/datatable-styling.scss']
})
export class ChannelScheduleComponent implements OnInit, OnDestroy {
  scheduledEpisodes: ScheduledEpisode[];
  totalHits = 0;
  pageSize = 1000;
  channel: Channel;
  private unsubscribe$ = new Subject();

  constructor(
    private readonly service: EpisodesService,
    private readonly broker: MessageBrokerService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly srApiService: SRApiService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        takeUntil(this.unsubscribe$),
        map((route) => route.id)
      )
      .subscribe(async (id: string) => {
        const channel = await this.srApiService.getChannelFromId(parseInt(id));
        if (channel) {
          await this.show(channel);
        }
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next(undefined);
    this.unsubscribe$.complete();
  }

  async show(channel: Channel) {
    this.channel = channel;
    await this.fetch(this.channel.id, 0);
  }

  async fetch(channelId: number, first: number) {
    if (!channelId) return;
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
    this.scheduledEpisodes = this.scheduledEpisodes.filter((s) => s.endtimeDate && s.endtimeDate.getTime() >= Date.now());
  }

  close() {
    this.broker.sendMessage(new NavigateBackMessage());
  }

  onOpenDetails(episodeId: number) {
    this.broker.sendMessage(new ShowEpisodeDetailsMessage(episodeId));
  }
}
