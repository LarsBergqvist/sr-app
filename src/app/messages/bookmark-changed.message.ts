import { Message } from './message';

export class BookmarkChangedMessage extends Message {
  episodeId: number;
  isBookmarked: boolean;
  constructor(episodeId: number, isBookmarked: boolean) {
    super();
    this.episodeId = episodeId;
    this.isBookmarked = isBookmarked;
  }

  get Type(): string {
    return 'BookmarkChangedMessage';
  }
}
