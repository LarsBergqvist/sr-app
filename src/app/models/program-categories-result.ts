import { ProgramCategory } from './program-category';

export interface ProgramCategoriesResult {
    programcategories: ProgramCategory[];
    pagination: {
        page: number;
        size: number;
        totalhits: number;
        totalpages: number;
        nextpage: string;
        previouspage: string;
    };
}
