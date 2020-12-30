import { Channel } from "./channel";

export interface Program {
    name: string;
    id: string;
    description: string;
    programimage: string;
    channel: Channel;
    channelName: string;
}
