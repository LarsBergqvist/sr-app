import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProgramsResult } from '../models/programs-result';
import { ProgramCategoriesResult } from '../models/program-categories-result';

@Injectable({
  providedIn: 'root'
})
export class ProgramsService {

  constructor(private readonly http: HttpClient) { }

    async getPrograms(page: number, pageSize: number, filter?: string, filterValue?: string, categoryid?: number): Promise<ProgramsResult> {
        let url = `${this.getBaseUrlWithDefaultParams()}&page=${page}&size=${pageSize}`;
        if (categoryid) {
            url = `${url}&programcategoryid=${categoryid}`;
        }
        if (filter && filterValue) {
            url = `${url}&filter=${filter}&filtervalue=${filterValue}`;
        }
        return this.http.get<ProgramsResult>(`${url}`).toPromise();
    }

    async getProgramCategories(): Promise<ProgramCategoriesResult> {
        const base =  'http://api.sr.se/api/v2/programcategories/';
        const params = '?format=json';
        let url = `${base}${params}`;
        return this.http.get<ProgramCategoriesResult>(`${url}`).toPromise();
    }
    
    private getBaseUrlWithDefaultParams(): string {
        const base =  'http://api.sr.se/api/v2/programs/';
        const params = '?format=json';
        return `${base}${params}`;
    }
}
