import { EpisodeGroup } from "./episode-group";
import { EpisodeOverview } from "./episode-overview";

export interface BroadcastFile {
  id: number;
  url: string;
  duration: number;
}

export interface Episode {
  title: string;
  id: number;
  description: string;
  publishdateutc: string;
  channelid: number;
  channelName: string;
  imageurl: string;
  imageurltemplate: string;
  url: string;
  program: {
    id: number;
    name: string;
  };
  listenpodfile: {
    url: string;
    duration: number;
  };
  broadcast: {
    availablestoputc: string;
    broadcastfiles: BroadcastFile[];
  };
  relatedepisodes: EpisodeOverview[];
  episodegroups: EpisodeGroup[];
}

export interface EpisodeResult {
  episode: Episode;
}
