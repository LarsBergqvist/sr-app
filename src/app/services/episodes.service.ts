import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EpisodesResult } from '../models/episodes-result';
import { SRBaseService } from './sr-base.service';

@Injectable({
  providedIn: 'root'
})
export class EpisodesService extends SRBaseService {
  constructor(private readonly http: HttpClient) {
    super();
  }

  async fetchEpisodes(programId: number, page: number, pageSize: number, filter?: string, filterValue?: string): Promise<EpisodesResult> {
    if (!programId) return;
    let url = `${this.getBaseUrlWithDefaultParams()}&programid=${programId}&page=${page}&size=${pageSize}`;
    return this.http.get<EpisodesResult>(`${url}`).toPromise();
  }

  private getBaseUrlWithDefaultParams(): string {
    return `${this.BaseUrl}episodes/index/?${this.FormatParam}`;
  }
}
