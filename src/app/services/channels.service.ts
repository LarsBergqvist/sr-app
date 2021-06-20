import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SRBaseService } from './sr-base.service';
import { SRApiService } from './srapi.service';
import { Channel } from '../models/channel';

interface ChannelResult {
  channel: Channel;
}

@Injectable({
  providedIn: 'root'
})
export class ChannelsService extends SRBaseService {
  constructor(private readonly http: HttpClient, private readonly srApiService: SRApiService) {
    super();
  }

  async fetchChannel(channelId: number): Promise<Channel> {
    if (channelId == null) return;
    let url = `${this.BaseUrl}channels/${channelId}?${this.FormatParam}`;
    const res = await this.http.get<ChannelResult>(`${url}`).toPromise();

    return res.channel;
  }
}
