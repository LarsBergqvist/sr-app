import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProgramsResult } from './models/programs-result';

@Injectable({
  providedIn: 'root'
})
export class ProgramsService {

  constructor(private readonly http: HttpClient) { }

    async getPrograms(page: number, pageSize: number, filter?: string, filterValue?: string): Promise<ProgramsResult> {
        let url = `${this.getBaseUrlWithDefaultParams()}&page=${page}&size=${pageSize}`;
        if (filter && filterValue) {
            url = `${url}&filter=${filter}&filtervalue=${filterValue}`;
        }
        return this.http.get<ProgramsResult>(`${url}`).toPromise();
    }

    private getBaseUrlWithDefaultParams(): string {
        const base =  'https://api.sr.se/api/v2/programs/';
        const params = '?format=json';
        return `${base}${params}`;
    }
}
