import { Message } from './message';

export class ShowEpisodeDetailsMessage extends Message {
  episodeId: number;
  constructor(episodeId: number) {
    super();
    this.episodeId = episodeId;
  }

  get Type(): string {
    return 'ShowEpisodeDetailsMessage';
  }
}
