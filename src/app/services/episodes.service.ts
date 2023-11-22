import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EpisodesResult } from '../models/episodes-result';
import { SRBaseService } from './sr-base.service';
import { RightNowEpisodes } from '../models/right-now-episodes';
import { ScheduleResult } from '../models/schedule-result';
import { EpisodeResult } from '../models/episode';
import { SRApiService } from './srapi.service';
import { lastValueFrom } from 'rxjs';
import { EpisodesOverviewResult } from '../models/episodes-overview-result';
import { EpisodeGroupResult } from '../models/episode-group-result';
import { EpisodeOverview } from '../models/episode-overview';

@Injectable({
  providedIn: 'root'
})
export class EpisodesService extends SRBaseService {
  constructor(private readonly http: HttpClient, private readonly srApiService: SRApiService) {
    super();
  }

  async fetchEpisodesForProgram(programId: number, page: number, pageSize: number): Promise<EpisodesResult> {
    if (programId == null) return;
    let url = `${this.BaseUrl}episodes/index/?${this.FormatParam}&programid=${programId}&page=${page}&size=${pageSize}`;
    const res = await lastValueFrom(this.http.get<EpisodesResult>(`${url}`));
    res.episodes.forEach((e) => {
      e.channelName = this.srApiService.getChannelNameFromId(e.channelid);
    });
    return res;
  }

  async fetchEpisode(episodeId: number): Promise<EpisodeResult> {
    if (episodeId == null) return;
    let url = `${this.BaseUrl}episodes/get?id=${episodeId}&${this.FormatParam}`;
    const res = await lastValueFrom(this.http.get<EpisodeResult>(`${url}`));
    res.episode.channelName = this.srApiService.getChannelNameFromId(res.episode.channelid);
    if (res.episode?.relatedepisodes) {
      let related = await this.fetchEpisodesOverview(res.episode.relatedepisodes.map(r => r.id));
      res.episode.relatedepisodes = related.episodes;
    }
    if (res.episode?.episodegroups) {
      res.episode.episodegroups.forEach(async eg => {
        let eps  = await this.fetchEpisodesByGroup(eg.id,1,10);
        eg.episodes = eps;
      })
    }
    return res;
  }

  async fetchEpisodes(episodeIds: number[]): Promise<EpisodesResult> {
    if (episodeIds == null) return;
    if (episodeIds.length < 1) {
      let res: EpisodesResult = {
        episodes: [],
        pagination: {
          page: 1,
          size: 10,
          totalpages: 0
        }
      };
      return res;
    }
    let idList = episodeIds.map((id) => id).join(',');
    let url = `${this.BaseUrl}episodes/getlist?ids=${idList}&${this.FormatParam}`;
    const res = await lastValueFrom(this.http.get<EpisodesResult>(`${url}`));
    res.episodes.forEach((e) => {
      e.channelName = this.srApiService.getChannelNameFromId(e.channelid);
    });
    return res;
  }

  async fetchEpisodesOverview(episodeIds: number[]): Promise<EpisodesOverviewResult> {
    if (episodeIds == null) return;
    if (episodeIds.length < 1) {
      let res: EpisodesOverviewResult = {
        episodes: [],
        pagination: {
          page: 1,
          size: 10,
          totalpages: 0
        }
      };
      return res;
    }
    let idList = episodeIds.map((id) => id).join(',');
    let url = `${this.BaseUrl}episodes/getlist?ids=${idList}&${this.FormatParam}`;
    const res = await lastValueFrom(this.http.get<EpisodesOverviewResult>(`${url}`));
    return res;
  }

  async fetchRightNowEpisodes(channelId: number): Promise<RightNowEpisodes> {
    if (channelId == null) return;
    let url = `${this.BaseUrl}scheduledepisodes/rightnow?${this.FormatParam}&channelid=${channelId}`;
    return lastValueFrom(this.http.get<RightNowEpisodes>(`${url}`));
  }

  async fetchChannelSchedule(channelId: number, page: number, pageSize: number): Promise<ScheduleResult> {
    if (channelId == null) return;
    let url = `${this.BaseUrl}scheduledepisodes/?${this.FormatParam}&channelid=${channelId}&page=${page}&size=${pageSize}`;
    return lastValueFrom(this.http.get<ScheduleResult>(`${url}`));
  }

  async searchEpisodes(query: string, page: number, pageSize: number): Promise<EpisodesResult> {
    if (query == null) return;
    let url = `${this.BaseUrl}episodes/search/?${this.FormatParam}&query=${query}&page=${page}&size=${pageSize}`;
    const res = await lastValueFrom(this.http.get<EpisodesResult>(`${url}`));
    res.episodes.forEach((e) => {
      e.channelName = this.srApiService.getChannelNameFromId(e.channelid);
    });
    return res;
  }

  async fetchEpisodesByGroup(groupId: number, page: number, pageSize: number): Promise<EpisodeOverview[]> {
    if (groupId == null) return;
    let url = `${this.BaseUrl}episodes/group/?${this.FormatParam}&id=${groupId}&page=${page}&size=${pageSize}`;
    const res = await lastValueFrom(this.http.get<EpisodeGroupResult>(`${url}`));
    return res.episodegroup.episodes;
  }

}
