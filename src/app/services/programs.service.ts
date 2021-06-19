import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SRBaseService } from './sr-base.service';
import { SRApiService } from './srapi.service';
import { Program } from '../models/program';

interface ProgramResult {
  program: Program;
}

@Injectable({
  providedIn: 'root'
})
export class ProgramsService extends SRBaseService {
  constructor(private readonly http: HttpClient, private readonly srApiService: SRApiService) {
    super();
  }

  async fetchProgram(programId: number): Promise<Program> {
    if (programId == null) return;
    let url = `${this.BaseUrl}programs/${programId}?${this.FormatParam}`;
    const res = await this.http.get<ProgramResult>(`${url}`).toPromise();

    // TODO: decorate with fav
    return res.program;
  }
}
