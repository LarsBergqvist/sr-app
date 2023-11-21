import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { NavigateBackMessage } from 'src/app/messages/navigate-back.message';
import { ShowEpisodeDetailsMessage } from 'src/app/messages/show-episodedetails.message';
import { ShowProgramDetailsMessage } from 'src/app/messages/show-programdetails.message';
import { Channel } from 'src/app/models/channel';
import { ScheduledEpisode } from 'src/app/models/scheduled-episode';
import { EpisodesService } from 'src/app/services/episodes.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
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

  private readonly storageId = 'ChannelScheduleState';
  localState = {
    showPrevious: false
  };

  @ViewChild(Table) tableComponent: Table;
  
  constructor(
    private readonly service: EpisodesService,
    private readonly broker: MessageBrokerService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly srApiService: SRApiService,
    private readonly storage: LocalStorageService
  ) {}

  ngOnInit(): void {
    const oldState = this.storage.get(this.storageId);
    if (oldState) {
      this.localState = oldState;
    }

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
    this.storage.set(this.storageId, this.localState);
    this.unsubscribe$.next(undefined);
    this.unsubscribe$.complete();
  }

  ngAfterViewInit(): void {
    this.filterOnTime(this.tableComponent);
  }

  onFilterShowOnlyCurrentAndFutureClicked(event, dt:Table) {
    this.localState.showPrevious = event.checked;
    this.filterOnTime(dt);
  }

  filterOnTime(table:Table) {
    if (!table) return;
    const midnight = new Date();
    midnight.setHours(0,0,0,0);
    if (!this.localState.showPrevious) {
      table.filter(Date.now(), 'endtimeDate', 'gt');
    } else {
      table.filter(midnight, 'endtimeDate', 'gt');
    }
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
      program: s.program,
      imageurltemplate: s.imageurltemplate,
      imageurl: s.imageurltemplate ? s.imageurltemplate + SRApiService.DefaultImagePreset : this.srApiService.getProgramImageUrlFromId(s.program.id)
    }));
  }

  close() {
    this.broker.sendMessage(new NavigateBackMessage());
  }

  onOpenDetails(episodeId: number) {
    this.broker.sendMessage(new ShowEpisodeDetailsMessage(episodeId));
  }

  onOpenProgramDetails(programId: number) {
    this.broker.sendMessage(new ShowProgramDetailsMessage(programId));
  }

}
