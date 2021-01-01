import { Message } from './message';

export class PlayAudioMessage extends Message {
  title: string;
  url: string;
  constructor(name: string, url: string) {
    super();
    this.title = name;
    this.url = url;
  }

  get Type(): string {
    return 'PlayAudioMessage';
  }
}
