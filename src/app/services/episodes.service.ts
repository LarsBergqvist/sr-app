import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EpisodesResult } from '../models/episodes-result';
import { SRBaseService } from './sr-base.service';
import { RightNowEpisodes } from '../models/right-now-episodes';
import { ScheduleResult } from '../models/schedule-result';
import { EpisodeResult } from '../models/episode';
import { SRApiService } from './srapi.service';

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
    const res = await this.http.get<EpisodesResult>(`${url}`).toPromise();
    res.episodes.forEach((e) => {
      e.channelName = this.srApiService.getChannelNameFromId(e.channelid);
    });
    return res;
  }

  async fetchEpisode(episodeId: number): Promise<EpisodeResult> {
    if (episodeId == null) return;
    let url = `${this.BaseUrl}episodes/get?id=${episodeId}&${this.FormatParam}`;
    const res = await this.http.get<EpisodeResult>(`${url}`).toPromise();
    res.episode.channelName = this.srApiService.getChannelNameFromId(res.episode.channelid);
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
    const res = await this.http.get<EpisodesResult>(`${url}`).toPromise();
    res.episodes.forEach((e) => {
      e.channelName = this.srApiService.getChannelNameFromId(e.channelid);
    });
    return res;
  }

  async fetchRightNowEpisodes(channelId: number): Promise<RightNowEpisodes> {
    if (channelId == null) return;
    let url = `${this.BaseUrl}scheduledepisodes/rightnow?${this.FormatParam}&channelid=${channelId}`;
    return this.http.get<RightNowEpisodes>(`${url}`).toPromise();
  }

  async fetchChannelSchedule(channelId: number, page: number, pageSize: number): Promise<ScheduleResult> {
    if (channelId == null) return;
    let url = `${this.BaseUrl}scheduledepisodes/?${this.FormatParam}&channelid=${channelId}&page=${page}&size=${pageSize}`;
    return this.http.get<ScheduleResult>(`${url}`).toPromise();
  }

  async searchEpisodes(query: string, page: number, pageSize: number): Promise<EpisodesResult> {
    if (query == null) return;
    let url = `${this.BaseUrl}/episodes/search/?${this.FormatParam}&query=${query}&page=${page}&size=${pageSize}`;
    const res = await this.http.get<EpisodesResult>(`${url}`).toPromise();
    res.episodes.forEach((e) => {
      e.channelName = this.srApiService.getChannelNameFromId(e.channelid);
    });
    return res;
  }
}
