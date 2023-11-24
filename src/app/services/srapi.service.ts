import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { BookmarkChangedMessage } from '../messages/bookmark-changed.message';
import { Channel } from '../models/channel';
import { Program } from '../models/program';
import { ProgramCategory } from '../models/program-category';
import { LocalStorageService } from './local-storage.service';
import { MessageBrokerService } from './message-broker.service';
import { SRBaseService } from './sr-base.service';

@Injectable({
  providedIn: 'root'
})
export class SRApiService extends SRBaseService {
  private channels: Channel[];
  channels$ = new BehaviorSubject<Channel[]>(null);
  private programCategories: ProgramCategory[];
  programCategories$ = new BehaviorSubject<ProgramCategory[]>(null);

  private currentlyPlaying: string;

  private episodeBookmarks = new Set<number>();

  private baseDataFetched = false;

  constructor(
    private readonly http: HttpClient,
    private readonly localStorageService: LocalStorageService,
    private readonly broker: MessageBrokerService
  ) {
    super();
    this.initBookmarksFromLocalStorage();
  }

  async fetchBaseData() {
    await this.fetchChannelsBaseData();
    await this.fetchBaseProgramCategoriesData();
    this.baseDataFetched = true;
  }

  setCurrentlyPlaying(url: string) {
    this.currentlyPlaying = url;
  }

  isCurrentlyPlaying(url: string): boolean {
    return this.currentlyPlaying === url;
  }

  private async fetchChannelsBaseData() {
    const channelsRawResult = await this.getAllChannels();
    this.channels = channelsRawResult.channels.map((c: Channel) => ({
      name: c.name,
      id: c.id,
      liveaudio: {
        id: c.liveaudio.id,
        url: c.liveaudio.url
      },
      image: c.imagetemplate + SRApiService.DefaultImagePreset,
      channeltype: c.channeltype,
      tagline: c.tagline
    }));
    this.channels = this.channels.filter((c) => c.channeltype !== 'Extrakanaler');
    this.channels$.next(this.channels);
  }

  private async fetchBaseProgramCategoriesData() {
    const categoriesRawResult = await this.getAllProgramCategories();
    this.programCategories = categoriesRawResult.programcategories.map((r) => ({
      name: r.name,
      id: r.id
    }));
    this.programCategories$.next(this.programCategories);
  }

  private async getAllChannels(): Promise<any> {
    const params = `?${this.FormatParam}&page=1&size=10000`;
    let url = `${this.BaseUrl}channels/${params}`;
    return lastValueFrom(this.http.get<any>(`${url}`));
  }

  private async getAllProgramCategories(): Promise<any> {
    const params = `?${this.FormatParam}&page=1&size=10000`;
    let url = `${this.BaseUrl}programcategories/${params}`;
    return lastValueFrom(this.http.get<any>(`${url}`));
  }

  getChannelNameFromId(id: number): string {
    if (!this.channels) return;
    const channel = this?.channels.find((c) => c.id === id);
    return channel?.name;
  }

  getCategoryNameFromId(id: number): string {
    if (!this.programCategories) return;
    const category = this?.programCategories.find((c) => c.id === id);
    return category?.name;
  }

  addBookmarkForEpisode(episodeId: number) {
    if (!this.episodeBookmarks.has(episodeId)) {
      this.episodeBookmarks.add(episodeId);
      this.storeBookmarksInLocalStorage();
      this.broker.sendMessage(new BookmarkChangedMessage(episodeId, true));
    }
  }

  removeBookmarkForEpisode(episodeId: number) {
    if (this.episodeBookmarks.has(episodeId)) {
      this.episodeBookmarks.delete(episodeId);
      this.storeBookmarksInLocalStorage();
      this.broker.sendMessage(new BookmarkChangedMessage(episodeId, false));
    }
  }

  getBookmarkedEpisodes(): number[] {
    return Array.from(this.episodeBookmarks);
  }

  isEpisodeBookmarked(episodeId: number): boolean {
    return this.episodeBookmarks.has(episodeId);
  }

  getChannelImageUrlFromId(channelId: number): string {
    if (!this.channels) return;
    const channel = this?.channels.find((c) => c.id === channelId);
    return channel?.image;
  }

  async getChannelFromId(channelId: number): Promise<Channel> {
    if (!this.baseDataFetched) {
      await this.fetchBaseData();
    }

    const channel = this.channels.find((p) => p.id === channelId);
    return channel;
  }

  private initBookmarksFromLocalStorage() {
    const bookmarksArrayStr = this.localStorageService.get('episodeBookmarks');
    if (bookmarksArrayStr) {
      try {
        const bookmarksArray: [] = JSON.parse(bookmarksArrayStr);
        if (bookmarksArray) {
          bookmarksArray.forEach((f) => {
            this.episodeBookmarks.add(f);
          });
        }
      } catch {}
    }
  }

  private storeBookmarksInLocalStorage() {
    let serializedSet = JSON.stringify(Array.from(this.episodeBookmarks));
    this.localStorageService.set('episodeBookmarks', serializedSet);
  }
}
