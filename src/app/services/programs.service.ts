import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SRBaseService } from './sr-base.service';
import { SRApiService } from './srapi.service';
import { lastValueFrom } from 'rxjs';
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
        name: p?.channel.name === '[No channel]' ? '' : p?.channel.name
      },
      programimage: p.programimagetemplate + SRApiService.DefaultImagePreset,
      description: p.description,
      programcategory: p.programcategory
    }));

    res.programs = progs;

    return res;
  }

  async fetchProgramWithId(programId: number): Promise<Program> {
    let url = `${this.BaseUrl}programs/${programId}?${this.FormatParam}`;
    const res = await lastValueFrom(this.http.get<any>(`${url}`));
    const p = res.program;

    const prog: any = {
      name: p.name,
      id: p.id,
      fav: this.srApiService.hasFavMarker(p.id),
      channel: {
        id: p?.channel.id,
        name: p?.channel.name
      },
      programimage: p.programimagetemplate + SRApiService.DefaultImagePreset,
      description: p.description,
      programcategory: p.programcategory
    };

    return prog;
  }

  async fetchAllFavoritePrograms(): Promise<Program[]> {
    let programFavIds = this.srApiService.getProgramFavorites();
    let programs: Program[] = [];
    programFavIds.forEach( async id => {
      let program = await this.fetchProgramWithId(id);
      if (program) {
        programs.push(program)
      }
    });

    return programs;
  }

}
