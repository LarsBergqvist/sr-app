import { Message } from './message';

export class PlayChannelMessage extends Message {
    channelName: string;
    channeUrl: string;
    constructor(name: string, url: string) {
        super();
        this.channelName = name;
        this.channeUrl = url;
    }

    get Type(): string {
        return 'PlayChannelMessage';
    }
}
