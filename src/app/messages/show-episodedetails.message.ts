import { Episode } from '../models/episode';
import { Message } from './message';

export class ShowEpisodeDetailsMessage extends Message {
  episode: Episode;
  episodeId: number;
  constructor(episode?: Episode, episodeId?: number) {
    super();
    this.episode = episode;
    this.episodeId = episodeId;
  }

  get Type(): string {
    return 'ShowEpisodeDetailsMessage';
  }
}
