import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChannelsResult } from '../models/channels-result';

@Injectable({
  providedIn: 'root'
})
export class ChannelsService {

  constructor(private readonly http: HttpClient) { }

    async getChannels(page: number, pageSize: number, filter?: string, filterValue?: string): Promise<ChannelsResult> {
        let url = `${this.getBaseUrlWithDefaultParams()}&page=${page}&size=${pageSize}`;
        if (filter && filterValue) {
            url = `${url}&filter=${filter}&filtervalue=${filterValue}`;
        }
        return this.http.get<ChannelsResult>(`${url}`).toPromise();
    }

    private getBaseUrlWithDefaultParams(): string {
        const base =  'http://api.sr.se/api/v2/channels/';
        const params = '?format=json';
        return `${base}${params}`;
    }
}
