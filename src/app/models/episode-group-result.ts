import { EpisodeGroup } from './episode-group';

export interface EpisodeGroupResult {
  episodegroup: EpisodeGroup;
  pagination: {
    page: number;
    size: number;
    totalhits?: number;
    totalpages: number;
    nextpage?: string;
    previouspage?: string;
  };
}
