import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EpisodesResult } from '../models/episodes-result';

@Injectable({
  providedIn: 'root'
})
export class EpisodesService {

  constructor(private readonly http: HttpClient) { }

  async searchEpisodes(query: string, page: number, pageSize: number, filter?: string, filterValue?: string): Promise<EpisodesResult> {
    let url = `${this.getBaseUrlWithDefaultParams()}&query=${query}&page=${page}&size=${pageSize}`;
    return this.http.get<EpisodesResult>(`${url}`).toPromise();
    }

    private getBaseUrlWithDefaultParams(): string {
        const base =  'http://api.sr.se/api/v2/episodes/search/';
        const params = '?format=json';
        return `${base}${params}`;
    }
}
