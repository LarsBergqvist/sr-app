import { Message } from './message';

export class NavigateBackMessage extends Message {
  get Type(): string {
    return 'NavigateBackMessage';
  }
}
