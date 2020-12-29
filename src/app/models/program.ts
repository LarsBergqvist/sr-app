import { Channel } from "./channel";

export interface Program {
    name: string;
    description: string;
    programimage: string;
    channel: Channel;
}
