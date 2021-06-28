import { ScheduledEpisode } from './scheduled-episode';

export interface ScheduleResult {
  schedule: ScheduledEpisode[];
  pagination: {
    page: number;
    size: number;
    totalhits: number;
    totalpages: number;
    nextpage: string;
    previouspage: string;
  };
}
