import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BookmarkChangedMessage } from '../messages/bookmark-changed.message';
import { SuccessInfoMessage } from '../messages/success-info.message';
import { Channel } from '../models/channel';
import { Program } from '../models/program';
import { ProgramCategory } from '../models/program-category';
import { LocalStorageService } from './local-storage.service';
import { MessageBrokerService } from './message-broker.service';
import { SRBaseService } from './sr-base.service';
import { TranslationService } from './translation.service';

@Injectable({
  providedIn: 'root'
})
export class SRApiService extends SRBaseService {
  private channels: Channel[];
  channels$ = new BehaviorSubject<Channel[]>(null);
  private programs: Program[];
  programs$ = new BehaviorSubject<Program[]>(null);
  private programCategories: ProgramCategory[];
  programCategories$ = new BehaviorSubject<ProgramCategory[]>(null);

  private currentlyPlaying: string;

  private programFavs = new Set<number>();
  private episodeBookmarks = new Set<number>();

  constructor(
    private readonly http: HttpClient,
    private readonly localStorageService: LocalStorageService,
    private readonly broker: MessageBrokerService,
    private readonly translationService: TranslationService
  ) {
    super();
    this.initFavoritesFromLocalStorage();
    this.initBookmarksFromLocalStorage();
  }

  async fetchBaseData() {
    await this.fetchChannelsBaseData();
    await this.fetchBaseProgramsData();
    await this.fetchBaseProgramCategoriesData();
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
      image: c.image,
      channeltype: c.channeltype,
      tagline: c.tagline
    }));
    this.channels = this.channels.filter((c) => c.channeltype !== 'Extrakanaler');
    this.channels$.next(this.channels);
  }

  private async fetchBaseProgramsData() {
    const programsRawResult = await this.getAllPrograms();
    const progs: Program[] = programsRawResult.programs.map((p: Program) => ({
      name: p.name,
      id: p.id,
      fav: false,
      channel: {
        id: p?.channel.id,
        name: p?.channel.name
      },
      programimage: p.programimage,
      description: p.description,
      programcategory: p.programcategory
    }));

    this.updateProgramsWithFavs(progs);
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
    return this.http.get<any>(`${url}`).toPromise();
  }

  private async getAllPrograms(): Promise<any> {
    const params = `?${this.FormatParam}&page=1&size=10000`;
    let url = `${this.BaseUrl}programs/${params}`;
    return this.http.get<any>(`${url}`).toPromise();
  }
  private async getAllProgramCategories(): Promise<any> {
    const params = `?${this.FormatParam}&page=1&size=10000`;
    let url = `${this.BaseUrl}programcategories/${params}`;
    return this.http.get<any>(`${url}`).toPromise();
  }

  getProgramFromId(id: number): Program {
    const program = this?.programs.find((c) => c.id === id);
    return program;
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

  addProgramToFavorites(programId: number, programName: string) {
    if (!this.programFavs.has(programId)) {
      this.programFavs.add(programId);
      this.storeFavsInLocalStorage();
      this.updateProgramsWithFavs(this.programs);
      this.broker.sendMessage(new SuccessInfoMessage(this.translationService.translateWithArgs('AddedToFavorites', programName)));
    }
  }

  removeProgramFromFavorites(programId: number, programName: string) {
    if (this.programFavs.has(programId)) {
      this.programFavs.delete(programId);
      this.storeFavsInLocalStorage();
      this.updateProgramsWithFavs(this.programs);
      this.broker.sendMessage(new SuccessInfoMessage(this.translationService.translateWithArgs('RemovedFromFavorites', programName)));
    }
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

  private updateProgramsWithFavs(progs: Program[]) {
    progs.forEach((p) => (p.fav = this.programFavs.has(p.id)));
    progs.sort((a: { name: string }, b: { name: any }) => {
      return a.name.localeCompare(b.name);
    });
    this.programs = progs;
    this.programs$.next(this.programs);
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
      } catch {}
    }
  }

  private storeFavsInLocalStorage() {
    let serializedSet = JSON.stringify(Array.from(this.programFavs));
    this.localStorageService.set('programfavs', serializedSet);
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
