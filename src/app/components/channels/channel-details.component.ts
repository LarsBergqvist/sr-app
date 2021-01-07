import { Component, OnInit } from '@angular/core';
import { PlayAudioMessage } from 'src/app/messages/play-audio.message';
import { Channel } from 'src/app/models/channel';
import { Playlist } from 'src/app/models/playlist';
import { RightNowEpisodes } from 'src/app/models/right-now-episodes';
import { ScheduledEpisode } from 'src/app/models/scheduled-episode';
import { Song } from 'src/app/models/song';
import { EpisodesService } from 'src/app/services/episodes.service';
import { MessageBrokerService } from 'src/app/services/message-broker.service';
import { PlaylistsService } from 'src/app/services/playlists.service';
import { SRApiService } from 'src/app/services/srapi.service';
import { convertFromJSONstring } from 'src/app/utils/date-helper';

@Component({
  selector: 'app-channel-details',
  templateUrl: './channel-details.component.html'
})
export class ChannelDetailsComponent implements OnInit {
  isVisible = false;
  playlist: Playlist;
  channel: Channel;
  rightNowEpisodes: RightNowEpisodes;

  constructor(
    private readonly playlistsService: PlaylistsService,
    private readonly episodesService: EpisodesService,
    private readonly srApiService: SRApiService,
    private readonly broker: MessageBrokerService
  ) {}

  ngOnInit(): void {
    this.isVisible = false;
  }

  async show(channel: Channel) {
    this.channel = channel;
    const playlistResult = await this.playlistsService.fetchCurrentPlaylistForChannel(channel.id);
    this.playlist = playlistResult.playlist;
    this.convertSongDates(this?.playlist?.previoussong);
    this.convertSongDates(this?.playlist?.song);
    this.convertSongDates(this?.playlist?.nextsong);
    this.rightNowEpisodes = await this.episodesService.fetchRightNowEpisodes(channel.id);
    this.convertEpisodeDates(this?.rightNowEpisodes?.channel?.previousscheduledepisode);
    this.convertEpisodeDates(this?.rightNowEpisodes?.channel?.currentscheduledepisode);
    this.convertEpisodeDates(this?.rightNowEpisodes?.channel?.nextscheduledepisode);
    this.isVisible = true;
  }

  private convertEpisodeDates(episode: ScheduledEpisode) {
    if (episode?.starttimeutc) {
      episode.starttimeDate = convertFromJSONstring(episode.starttimeutc);
    }
    if (episode?.endtimeutc) {
      episode.endtimeDate = convertFromJSONstring(episode.endtimeutc);
    }
  }

  private convertSongDates(song: Song) {
    if (song?.starttimeutc) {
      song.starttimeutcDate = convertFromJSONstring(song.starttimeutc);
    }
    if (song?.stoptimeutc) {
      song.stoptimeutcDate = convertFromJSONstring(song.stoptimeutc);
    }
  }

  close() {
    this.isVisible = false;
  }

  onPlayChannel(channel: Channel) {
    this.broker.sendMessage(new PlayAudioMessage(channel.name, channel.liveaudio.url));
  }

  isCurrentlyPlaying(url: string): boolean {
    if (url) {
      return this.srApiService.isCurrentlyPlaying(url);
    } else {
      return false;
    }
  }
}
