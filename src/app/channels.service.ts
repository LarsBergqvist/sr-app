import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChannelsResult } from './models/channels-result';

@Injectable({
  providedIn: 'root'
})
export class ChannelsService {

  constructor(private readonly http: HttpClient) { }

    async getChannels(page: number, pageSize: number): Promise<ChannelsResult> {
        const url = `${this.getBaseUrlWithDefaultParams()}&page=${page}&size=${pageSize}`;
        return this.http.get<ChannelsResult>(`${url}`).toPromise();
    }

    private getBaseUrlWithDefaultParams(): string {
        const base =  'https://api.sr.se/api/v2/channels/';
        const params = '?format=json';
        return `${base}${params}`;
    }
}
