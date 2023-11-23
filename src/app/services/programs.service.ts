import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EpisodesResult } from '../models/episodes-result';
import { SRBaseService } from './sr-base.service';
import { RightNowEpisodes } from '../models/right-now-episodes';
import { ScheduleResult } from '../models/schedule-result';
import { EpisodeResult } from '../models/episode';
import { SRApiService } from './srapi.service';
import { lastValueFrom } from 'rxjs';
import { EpisodesOverviewResult } from '../models/episodes-overview-result';
import { EpisodeGroupResult } from '../models/episode-group-result';
import { EpisodeOverview } from '../models/episode-overview';
import { ProgramsResult } from '../models/programs-result';
import { Program } from '../models/program';

@Injectable({
  providedIn: 'root'
})
export class ProgramsService extends SRBaseService {
  constructor(private readonly http: HttpClient, private readonly srApiService: SRApiService) {
    super();
  }

  async fetchPrograms(page: number, pageSize: number, categoryId: number): Promise<ProgramsResult> {
    let url = `${this.BaseUrl}programs/?${this.FormatParam}&page=${page}&size=${pageSize}`;
    if (categoryId) {
      url = `${url}&programcategoryid=${categoryId}`;
    }
    const res = await lastValueFrom(this.http.get<any>(`${url}`));

    const progs: Program[] = res.programs.map((p: Program) => ({
      name: p.name,
      id: p.id,
      fav: false,
      channel: {
        id: p?.channel.id,
        name: p?.channel.name
      },
      programimage: p.programimagetemplate + SRApiService.DefaultImagePreset,
      description: p.description,
      programcategory: p.programcategory
    }));

    res.programs = progs;

    return res;
  }

  /*
    const progs: Program[] = programsRawResult.programs.map((p: Program) => ({
      name: p.name,
      id: p.id,
      fav: false,
      channel: {
        id: p?.channel.id,
        name: p?.channel.name
      },
      programimage: p.programimagetemplate + SRApiService.DefaultImagePreset,
      description: p.description,
      programcategory: p.programcategory
    }));

    this.updateProgramsWithFavs(progs);


    private async getAllPrograms(): Promise<any> {
    const params = `?${this.FormatParam}&page=1&size=10000`;
    let url = `${this.BaseUrl}programs/${params}`;
    return lastValueFrom(this.http.get<any>(`${url}`));
  }
  */

}
