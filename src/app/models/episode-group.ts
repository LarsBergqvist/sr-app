import { EpisodeOverview } from "./episode-overview";

export interface EpisodeGroup {
  title: string;
  id: number;
  description: string;
  episodes: EpisodeOverview[];
}
