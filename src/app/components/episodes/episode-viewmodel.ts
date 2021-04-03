import { getLocaleDateTimeFormat } from '@angular/common';
import { Episode } from 'src/app/models/episode';
import { convertFromJSONstring, durationToTime } from 'src/app/utils/date-helper';

export enum SoundType {
  None,
  Broadcast,
  Podfile
}

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
  readonly soundType: SoundType;
  readonly linkUrl: string;
  readonly availableTo: Date;

  constructor(episode: Episode) {
    this.title = episode.title;
    this.id = episode.id;
    this.description = episode.description;
    this.publishDate = convertFromJSONstring(episode.publishdateutc);
    this.channelName = episode.channelName;
    this.imageurl = episode.imageurl;
    this.programName = episode.program?.name;
    this.linkUrl = episode.url;
    if (episode.broadcast?.availablestoputc) {
      this.availableTo = convertFromJSONstring(episode.broadcast.availablestoputc);
    }

    this.soundType = SoundType.None;

    if (episode.listenpodfile?.duration) {
      this.soundType = SoundType.Podfile;
      this.url = episode.listenpodfile.url;
      this.durationTime = durationToTime(episode.listenpodfile.duration);
    } else if (episode.broadcast?.broadcastfiles?.length > 0) {
      this.soundType = SoundType.Broadcast;
      this.durationTime = durationToTime(episode.broadcast.broadcastfiles[0].duration);
    }
  }

  hasSound(): boolean {
    return !!this.url;
  }
}
