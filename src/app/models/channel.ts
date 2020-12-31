export interface Channel {
    id: number;
    name: string;
    liveaudio: {
        id: number;
        url: string;
    };
    channeltype: string;
    tagline: string;
}
