export interface ScheduledEpisode {
  title: string;
  description: string;
  starttimeutc?: string;
  endtimeutc?: string;
  starttimeDate?: Date;
  endtimeDate?: Date;
  program: {
    id: number;
    name: string;
  };
}
