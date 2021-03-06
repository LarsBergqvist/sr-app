export interface ProgramCategory {
  id: number;
  name: string;
}

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
