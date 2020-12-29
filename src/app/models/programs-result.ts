import { Program } from './program';

export interface ProgramsResult {
    programs: Program[];
    pagination: {
        page: number;
        size: number;
        totalhits: number;
        totalpages: number;
        nextpage: string;
        previouspage: string;
    };
}
