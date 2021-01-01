export interface BroadcastFile {
  id: number;
  url: string;
}

export interface Episode {
  title: string;
  id: number;
  description: string;
  publishdateutc: string;
  publishdateutcDate: Date;
  channelid: number;
  channelName: string;
  program: {
    id: number;
    name: string;
  };
  listenpodfile: {
    url: string;
  };
  broadcast: {
    broadcastfiles: BroadcastFile[];
  };
}
