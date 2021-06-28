import { Channel } from './channel';

export interface Program {
  name: string;
  id: number;
  description: string;
  programimage: string;
  channel: Channel;
  fav: boolean;
  programcategory: {
    id: number;
  };
}
