export interface Channel {
  id: number;
  name: string;
  image: string;
  imagetemplate: string;
  liveaudio: {
    id: number;
    url: string;
  };
  channeltype: string;
  tagline: string;
}
