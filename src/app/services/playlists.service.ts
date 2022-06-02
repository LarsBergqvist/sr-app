import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SonglistResult } from '../models/songlist';
import { PlaylistResult } from '../models/playlist';
import { SRBaseService } from './sr-base.service';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlaylistsService extends SRBaseService {
  constructor(private readonly http: HttpClient) {
    super();
  }

  async fetchSonglistForEpisode(episodeId: number): Promise<SonglistResult> {
    if (!episodeId) return;
    let url = `${this.BaseUrl}playlists/getplaylistbyepisodeid/?id=${episodeId}&${this.FormatParam}`;
    return lastValueFrom(this.http.get<SonglistResult>(`${url}`));
  }

  async fetchCurrentPlaylistForChannel(channelId: number): Promise<PlaylistResult> {
    if (!channelId) return;
    let url = `${this.BaseUrl}playlists/rightnow/?channelid=${channelId}&${this.FormatParam}`;
    return lastValueFrom(this.http.get<PlaylistResult>(`${url}`));
  }
}
