import { EpisodeViewModel } from '../components/episodes/episode-viewmodel';
import { Message } from './message';

export class ShowEpisodeDetailsMessage extends Message {
  episode: EpisodeViewModel;
  episodeId: number;
  constructor(episode?: EpisodeViewModel, episodeId?: number) {
    super();
    this.episode = episode;
    this.episodeId = episodeId;
  }

  get Type(): string {
    return 'ShowEpisodeDetailsMessage';
  }
}
