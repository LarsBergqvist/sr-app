import { Message } from './message';

export class ShowChannelScheduleMessage extends Message {
  channelId: number;
  constructor(channelId: number) {
    super();
    this.channelId = channelId;
  }

  get Type(): string {
    return 'ShowChannelScheduleMessage';
  }
}
