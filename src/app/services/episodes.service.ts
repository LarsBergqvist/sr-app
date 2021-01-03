import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EpisodesResult } from '../models/episodes-result';
import { SRBaseService } from './sr-base.service';
import { RightNowEpisodes } from '../models/right-now-episodes';

@Injectable({
  providedIn: 'root'
})
export class EpisodesService extends SRBaseService {
  constructor(private readonly http: HttpClient) {
    super();
  }

  async fetchEpisodes(programId: number, page: number, pageSize: number, filter?: string, filterValue?: string): Promise<EpisodesResult> {
    if (!programId) return;
    let url = `${this.BaseUrl}episodes/index/?${this.FormatParam}&programid=${programId}&page=${page}&size=${pageSize}`;
    return this.http.get<EpisodesResult>(`${url}`).toPromise();
  }

  async fetchRightNowEpisodes(channelId: number): Promise<RightNowEpisodes> {
    if (!channelId) return;
    let url = `${this.BaseUrl}scheduledepisodes/rightnow?${this.FormatParam}&channelid=${channelId}`;
    return this.http.get<RightNowEpisodes>(`${url}`).toPromise();
  }
}
