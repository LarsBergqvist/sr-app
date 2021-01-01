import { Episode } from './episode';

export interface EpisodesResult {
  episodes: Episode[];
  pagination: {
    page: number;
    size: number;
    totalhits: number;
    totalpages: number;
    nextpage: string;
    previouspage: string;
  };
}
