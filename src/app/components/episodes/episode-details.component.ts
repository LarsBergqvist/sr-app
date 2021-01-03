import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { PlayAudioMessage } from 'src/app/messages/play-audio.message';
import { ShowEpisodeDetailsMessage } from 'src/app/messages/show-episodedetails.message';
import { Episode } from 'src/app/models/episode';
import { Song } from 'src/app/models/song';
import { EpisodesService } from 'src/app/services/episodes.service';
import { MessageBrokerService } from 'src/app/services/message-broker.service';
import { PlaylistsService } from 'src/app/services/playlists.service';
import { convertFromJSONstring } from 'src/app/utils/date-helper';

@Component({
  selector: 'app-episode-details',
  templateUrl: './episode-details.component.html'
})
export class EpisodeDetailsComponent implements OnInit, OnDestroy {
  isVisible = false;
  songs: Song[];
  episode: Episode;
  private unsubscribe$ = new Subject();

  constructor(
    private readonly episodesService: EpisodesService,
    private readonly playlistsService: PlaylistsService,
    private readonly broker: MessageBrokerService
  ) {}

  ngOnInit(): void {
    this.isVisible = false;
    const messages = this.broker.getMessage();
    messages
      .pipe(
        takeUntil(this.unsubscribe$),
        filter((message) => message instanceof ShowEpisodeDetailsMessage)
      )
      .subscribe(async (message: ShowEpisodeDetailsMessage) => {
        if (message?.episode) {
          this.show(message.episode);
        } else if (message?.episodeId) {
          const res = await this.episodesService.fetchEpisode(message.episodeId);
          if (res?.episode) {
            this.show(res.episode);
          }
        }
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

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
