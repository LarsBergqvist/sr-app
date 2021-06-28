import { Song } from './song';

export interface PlaylistResult {
  playlist: Playlist;
}

export interface Playlist {
  previoussong: Song;
  song: Song;
  nextsong: Song;
}
