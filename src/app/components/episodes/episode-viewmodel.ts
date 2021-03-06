import { Episode } from 'src/app/models/episode';
import { convertFromJSONstring, durationToTime } from 'src/app/utils/date-helper';

export class EpisodeViewModel {
  readonly title: string;
  readonly id: number;
  readonly description: string;
  readonly publishDate: Date;
  readonly channelName: string;
  readonly imageurl: string;
  readonly programName: string;
  readonly durationTime: Date;
  readonly url: string;
  readonly isBroadcast: boolean;
  readonly linkUrl: string;

  constructor(episode: Episode) {
    this.title = episode.title;
    this.id = episode.id;
    this.description = episode.description;
    this.publishDate = convertFromJSONstring(episode.publishdateutc);
    this.channelName = episode.channelName;
    this.imageurl = episode.imageurl;
    this.programName = episode.program?.name;
    this.linkUrl = episode.url;

    if (episode.broadcast?.broadcastfiles?.length > 0) {
      this.isBroadcast = true;
      this.durationTime = durationToTime(episode.broadcast.broadcastfiles[0].duration);
      this.url = episode.broadcast.broadcastfiles[0].url;
    } else if (episode.listenpodfile?.duration) {
      this.url = episode.listenpodfile.url;
      this.durationTime = durationToTime(episode.listenpodfile.duration);
    }
  }

  hasSound(): boolean {
    return !!this.url;
  }
}
