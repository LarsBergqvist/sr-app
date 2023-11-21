export interface ScheduledEpisode {
  title: string;
  episodeid: number;
  description: string;
  starttimeutc?: string;
  endtimeutc?: string;
  starttimeDate?: Date;
  endtimeDate?: Date;
  imageurl: string;
  imageurltemplate: string;
  program: {
    id: number;
    name: string;
  };
}
