import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, lastValueFrom } from 'rxjs';
import { BookmarkChangedMessage } from '../messages/bookmark-changed.message';
import { Channel } from '../models/channel';
import { ProgramCategory } from '../models/program-category';
import { LocalStorageService } from './local-storage.service';
import { MessageBrokerService } from './message-broker.service';
import { SRBaseService } from './sr-base.service';
import { TranslationService } from './translation.service';
import { SuccessInfoMessage } from '../messages/success-info.message';
import { FavoriteChangedMessage } from '../messages/favorite-changed.message';

@Injectable({
  providedIn: 'root'
})
export class SRApiService extends SRBaseService {
  // Group related properties
  // Channels
  private channels: Channel[] = [];
  channels$ = new BehaviorSubject<Channel[]>([]);
  
  // Program Categories
  private programCategories: ProgramCategory[] = [];
  programCategories$ = new BehaviorSubject<ProgramCategory[]>([]);
  
  // Player state
  private currentlyPlaying: string | null = null;
  
  // User preferences
  private programFavs = new Set<number>();
  private episodeBookmarks = new Set<number>();
  
  private baseDataFetched = false;

  constructor(
    private readonly http: HttpClient,
    private readonly localStorageService: LocalStorageService,
    private readonly translationService: TranslationService,
    private readonly broker: MessageBrokerService
  ) {
    super();
    this.initUserPreferences();
  }

  // Initialize user preferences
  private initUserPreferences(): void {
    this.initFavoritesFromLocalStorage();
    this.initBookmarksFromLocalStorage();
  }

  // Base data methods
  async fetchBaseData(): Promise<void> {
    await Promise.all([
      this.fetchChannelsBaseData(),
      this.fetchBaseProgramCategoriesData()
    ]);
    this.baseDataFetched = true;
  }

  // Player methods
  setCurrentlyPlaying(url: string): void {
    this.currentlyPlaying = url;
  }

  isCurrentlyPlaying(url: string): boolean {
    return this.currentlyPlaying === url;
  }

  // Channel methods
  private async fetchChannelsBaseData(): Promise<void> {
    const channelsRawResult = await this.getAllChannels();
    this.channels = channelsRawResult.channels
      .map((c: Channel) => ({
        name: c.name,
        id: c.id,
        liveaudio: {
          id: c.liveaudio.id,
          url: c.liveaudio.url
        },
        image: c.imagetemplate + SRApiService.DefaultImagePreset,
        channeltype: c.channeltype,
        tagline: c.tagline
      }))
      .filter((c) => c.channeltype !== 'Extrakanaler');
    
    this.channels$.next(this.channels);
  }

  getChannelNameFromId(id: number): string | undefined {
    return this.channels?.find((c) => c.id === id)?.name;
  }

  getChannelImageUrlFromId(channelId: number): string | undefined {
    return this.channels?.find((c) => c.id === channelId)?.image;
  }

  async getChannelFromId(channelId: number): Promise<Channel | undefined> {
    if (!this.baseDataFetched) {
      await this.fetchBaseData();
    }
    return this.channels.find((p) => p.id === channelId);
  }

  // Category methods
  private async fetchBaseProgramCategoriesData(): Promise<void> {
    const categoriesRawResult = await this.getAllProgramCategories();
    this.programCategories = categoriesRawResult.programcategories.map((r) => ({
      name: r.name,
      id: r.id
    }));
    this.programCategories$.next(this.programCategories);
  }

  getCategoryNameFromId(id: number): string | undefined {
    return this.programCategories?.find((c) => c.id === id)?.name;
  }

  // API calls
  private getAllChannels(): Promise<any> {
    const params = `?${this.FormatParam}&page=1&size=10000`;
    const url = `${this.BaseUrl}channels/${params}`;
    return lastValueFrom(this.http.get<any>(url));
  }

  private getAllProgramCategories(): Promise<any> {
    const params = `?${this.FormatParam}&page=1&size=10000`;
    const url = `${this.BaseUrl}programcategories/${params}`;
    return lastValueFrom(this.http.get<any>(url));
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

  getProgramFavorites(): number[] {
    return Array.from(this.programFavs);
  }

  isEpisodeBookmarked(episodeId: number): boolean {
    return this.episodeBookmarks.has(episodeId);
  }

  addProgramToFavorites(programId: number, programName: string) {
    if (!this.programFavs.has(programId)) {
      this.programFavs.add(programId);
      this.storeFavsInLocalStorage();
      this.broker.sendMessage(new FavoriteChangedMessage(programId, true));
      this.broker.sendMessage(new SuccessInfoMessage(this.translationService.translateWithArgs('AddedToFavorites', programName)));
    }
  }

  removeProgramFromFavorites(programId: number, programName: string) {
    if (this.programFavs.has(programId)) {
      this.programFavs.delete(programId);
      this.storeFavsInLocalStorage();
      this.broker.sendMessage(new FavoriteChangedMessage(programId, false));
      this.broker.sendMessage(new SuccessInfoMessage(this.translationService.translateWithArgs('RemovedFromFavorites', programName)));
    }
  }

  hasFavMarker(programId: number): boolean {
    return this.programFavs.has(programId);
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
      } catch { }
    }
  }

  private storeBookmarksInLocalStorage() {
    let serializedSet = JSON.stringify(Array.from(this.episodeBookmarks));
    this.localStorageService.set('episodeBookmarks', serializedSet);
  }

  private initFavoritesFromLocalStorage() {
    const favsarrayStr = this.localStorageService.get('programfavs');
    if (favsarrayStr) {
      try {
        const favsArray: [] = JSON.parse(favsarrayStr);
        if (favsArray) {
          favsArray.forEach((f) => {
            this.programFavs.add(f);
          });
        }
      } catch { }
    }
  }

  private storeFavsInLocalStorage() {
    let serializedSet = JSON.stringify(Array.from(this.programFavs));
    this.localStorageService.set('programfavs', serializedSet);
  }
}
