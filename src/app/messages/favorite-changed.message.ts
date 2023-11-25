import { Message } from './message';

export class FavoriteChangedMessage extends Message {
  programId: number;
  isFavorite: boolean;
  constructor(programId: number, isFavorite: boolean) {
    super();
    this.programId = programId;
    this.isFavorite = isFavorite;
  }

  get Type(): string {
    return 'FavoriteChangedMessage';
  }
}
