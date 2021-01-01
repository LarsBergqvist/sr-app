import { Song } from './Song';

export interface PlaylistResult {
  playlist: Playlist;
}

export interface Playlist {
  previoussong: Song;
  song: Song;
  nextsong: Song;
}
