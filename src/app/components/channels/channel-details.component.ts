import { Component } from '@angular/core';
import { PlayAudioMessage } from 'src/app/messages/play-audio.message';
import { Channel } from 'src/app/models/channel';
import { Playlist } from 'src/app/models/playlist';
import { Song } from 'src/app/models/Song';
import { MessageBrokerService } from 'src/app/services/message-broker.service';
import { PlaylistsService } from 'src/app/services/playlists.service';
import { convertFromJSONstring } from 'src/app/utils/date-helper';

@Component({
  selector: 'app-channel-details',
  templateUrl: './channel-details.component.html'
})
export class ChannelDetailsComponent {
  isVisible = false;
  playlist: Playlist;
  channel: Channel;

  constructor(private readonly playlistsService: PlaylistsService, private readonly broker: MessageBrokerService) {}

  async show(channel: Channel) {
    this.channel = channel;
    const res = await this.playlistsService.fetchCurrentPlaylistForChannel(channel.id);
    this.playlist = res.playlist;
    this.convertDate(this?.playlist?.previoussong);
    this.convertDate(this?.playlist?.song);
    this.convertDate(this?.playlist?.nextsong);
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

  onPlayChannel(channel: Channel) {
    this.broker.sendMessage(new PlayAudioMessage(channel.name, channel.liveaudio.url));
  }
}
