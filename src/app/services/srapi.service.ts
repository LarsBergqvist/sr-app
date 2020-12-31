import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Channel } from "../models/channel";
import { Program } from "../models/program";

@Injectable({
    providedIn: 'root'
})
export class SRApiService  {

    private channels: Channel[];
    channels$ = new BehaviorSubject<Channel[]>(null);
    private programs: Program[];
    programs$ = new BehaviorSubject<Program[]>(null);

    private readonly baseUrl = 'https://api.sr.se/api/v2/';

    constructor(private readonly http: HttpClient) { 
    }

    async fetchBaseData() {
        const channelsRawResult = await this.getAllChannels();
        this.channels = channelsRawResult.channels.map(r => ({
            name: r.name,
            id: r.id,
            liveaudio: {
                id: r.liveaudio.id,
                url: r.liveaudio.url,
            },
            channeltype: r.channeltype,
            tagline: r.tagline
        }));
        this.channels$.next(this.channels);

        const programsRawResult = await this.getAllPrograms();
        this.programs = programsRawResult.programs.map(r => ({
            name: r.name,
            id: r.id,
        }));
        this.programs.sort((a,b) => a.name.localeCompare(b.name));
        this.programs$.next(this.programs);
    }

    async getAllChannels(): Promise<any> {
        const params = '?format=json&page=1&size=10000';
        let url = `${this.baseUrl}channels/${params}`;
        return this.http.get<any>(`${url}`).toPromise();
    }

    async getAllPrograms(): Promise<any> {
        const params = '?format=json&page=1&size=10000&isarchived=false';
        let url = `${this.baseUrl}programs/${params}`;
        return this.http.get<any>(`${url}`).toPromise();
    }

    getChannelNameFromId(id: number): string {
        const channel = this.channels.find(c => c.id === id);
        return channel?.name;
    }
}