import { EpisodeOverview } from './episode-overview';

export interface EpisodesOverviewResult {
  episodes: EpisodeOverview[];
  pagination: {
    page: number;
    size: number;
    totalhits?: number;
    totalpages: number;
    nextpage?: string;
    previouspage?: string;
  };
}
