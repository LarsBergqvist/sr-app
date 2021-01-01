import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChannelsResult } from '../models/channels-result';
import { SRBaseService } from './sr-base.service';

@Injectable({
  providedIn: 'root'
})
export class ChannelsService extends SRBaseService {
  constructor(private readonly http: HttpClient) {
    super();
  }

  async getChannels(page: number, pageSize: number, filter?: string, filterValue?: string): Promise<ChannelsResult> {
    let url = `${this.getBaseUrlWithDefaultParams()}&page=${page}&size=${pageSize}`;
    if (filter && filterValue) {
      url = `${url}&filter=${filter}&filtervalue=${filterValue}`;
    }
    return this.http.get<ChannelsResult>(`${url}`).toPromise();
  }

  private getBaseUrlWithDefaultParams(): string {
    return `${this.BaseUrl}channels/?${this.FormatParam}`;
  }
}
