import { Component, OnInit } from '@angular/core';
import { PlayAudioMessage } from 'src/app/messages/play-audio.message';
import { Episode } from 'src/app/models/episode';
import { Song } from 'src/app/models/Song';
import { MessageBrokerService } from 'src/app/services/message-broker.service';
import { PlaylistsService } from 'src/app/services/playlists.service';
import { convertFromJSONstring } from 'src/app/utils/date-helper';

@Component({
  selector: 'app-episode-details',
  templateUrl: './episode-details.component.html'
})
export class EpisodeDetailsComponent {
  isVisible = false;
  songs: Song[];
  episode: Episode;

  constructor(private readonly playlistsService: PlaylistsService, private readonly broker: MessageBrokerService) {}

  async show(episode: Episode) {
    this.episode = episode;
    const res = await this.playlistsService.fetchSonglistForEpisode(episode.id);
    this.songs = res.song;
    if (this.songs) this.songs.forEach((s) => this.convertDate(s));
    this.songs.sort((a, b) => a.starttimeutcDate.getTime() - b.starttimeutcDate.getTime());
    this.isVisible = true;
  }

  private convertDate(song: Song) {
    if (song) {
      if (song.starttimeutc) {
        song.starttimeutcDate = convertFromJSONstring(song.starttimeutc);
      }
      if (song.stoptimeutc) {
        song.stoptimeutcDate = convertFromJSONstring(song.stoptimeutc);
      }
    }
  }

  close() {
    this.isVisible = false;
  }

  hasSound(episode: Episode) {
    if (episode?.listenpodfile || episode?.broadcast?.broadcastfiles?.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  onPlayEpisode(episode: Episode) {
    if (episode?.listenpodfile) {
      this.broker.sendMessage(new PlayAudioMessage(episode.title, episode.listenpodfile.url));
    } else if (episode?.broadcast?.broadcastfiles?.length > 0) {
      this.broker.sendMessage(new PlayAudioMessage(episode.title, episode.broadcast?.broadcastfiles[0].url));
    }
  }
}
