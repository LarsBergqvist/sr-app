import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SuccessInfoMessage } from '../messages/success-info.message';
import { Channel } from '../models/channel';
import { Program } from '../models/program';
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

  private currentlyPlaying: string;

  private programFavs = new Set();

  constructor(
    private readonly http: HttpClient,
    private readonly localStorageService: LocalStorageService,
    private readonly broker: MessageBrokerService,
    private readonly translationService: TranslationService
  ) {
    super();
    this.initFavoritesFromLocalStorage();
  }

  async fetchBaseData() {
    await this.fetchChannelsBaseData();
    await this.fetchBaseProgramsData();
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
      description: p.description
    }));

    this.updateProgramsWithFavs(progs);
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

  getChannelNameFromId(id: number): string {
    if (!this.channels) return;
    const channel = this?.channels.find((c) => c.id === id);
    return channel?.name;
  }

  addProgramToFavorites(programId: number, programName: string) {
    if (!this.programFavs.has(programId)) {
      this.programFavs.add(programId);
      this.storFavsInLocalStorage();
      this.updateProgramsWithFavs(this.programs);
      this.broker.sendMessage(new SuccessInfoMessage(this.translationService.translateWithArgs('AddedToFavorites', programName)));
    }
  }

  removeProgramFromFavorites(programId: number, programName: string) {
    if (this.programFavs.has(programId)) {
      this.programFavs.delete(programId);
      this.storFavsInLocalStorage();
      this.updateProgramsWithFavs(this.programs);
      this.broker.sendMessage(new SuccessInfoMessage(this.translationService.translateWithArgs('RemovedFromFavorites', programName)));
    }
  }

  private updateProgramsWithFavs(progs: Program[]) {
    progs.forEach((p) => (p.fav = this.programFavs.has(p.id)));
    progs.sort((a: { name: string }, b: { name: any }) => {
      return a.name.localeCompare(b.name);
    });
    //    const favs = progs.filter((p: Program) => p.fav);
    //    const nofavs = progs.filter((p: Program) => !p.fav);
    //    this.programs = favs.concat(nofavs);
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

  private storFavsInLocalStorage() {
    let serializedSet = JSON.stringify(Array.from(this.programFavs));
    this.localStorageService.set('programfavs', serializedSet);
  }
}
