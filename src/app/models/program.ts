import { Channel } from './channel';

export interface Program {
  name: string;
  id: number;
  description: string;
  programimage: string;
  programimagetemplate: string;
  channel: Channel;
  fav: boolean;
  programcategory: {
    id: number;
  };
}
