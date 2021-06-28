import { Channel } from './channel';

export interface ChannelsResult {
  channels: Channel[];
  pagination: {
    page: number;
    size: number;
    totalhits: number;
    totalpages: number;
    nextpage: string;
    previouspage: string;
  };
}
