import { ScheduledEpisode } from './scheduled-episode';

export interface RightNowEpisodes {
  channel: {
    id: number;
    name: string;
    previousscheduledepisode: ScheduledEpisode;
    currentscheduledepisode: ScheduledEpisode;
    nextscheduledepisode: ScheduledEpisode;
  };
}
