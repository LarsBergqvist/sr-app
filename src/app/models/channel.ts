export interface Channel {
  id: number;
  name: string;
  image: string;
  liveaudio: {
    id: number;
    url: string;
  };
  channeltype: string;
  tagline: string;
}
