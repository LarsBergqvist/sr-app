import { Message } from './message';

export class PlayAudioMessage extends Message {
  title: string;
  url: string;
  episodeId: number;
  channelId: number;
  constructor(name: string, url: string, episodeId?: number, channelId?: number) {
    super();
    this.title = name;
    this.url = url;
    this.episodeId = episodeId;
    this.channelId = channelId;
  }

  get Type(): string {
    return 'PlayAudioMessage';
  }
}
