export interface Channel {
    name: string;
    liveaudio: {
        id: string;
        url: string;
    };
    channeltype: string;
    tagline: string;
}
