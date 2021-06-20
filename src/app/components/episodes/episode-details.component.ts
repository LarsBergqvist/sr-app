import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { NavigateBackMessage } from 'src/app/messages/navigate-back.message';
import { PlayAudioMessage } from 'src/app/messages/play-audio.message';
import { ShowEpisodeDetailsMessage } from 'src/app/messages/show-episodedetails.message';
import { ShowProgramDetailsMessage } from 'src/app/messages/show-programdetails.message';
import { Song } from 'src/app/models/song';
import { EpisodesService } from 'src/app/services/episodes.service';
import { MessageBrokerService } from 'src/app/services/message-broker.service';
import { PlaylistsService } from 'src/app/services/playlists.service';
import { SRApiService } from 'src/app/services/srapi.service';
import { TranslationService } from 'src/app/services/translation.service';
import { convertFromJSONstring } from 'src/app/utils/date-helper';
import { EpisodeViewModel, SoundType } from './episode-viewmodel';

@Component({
  selector: 'app-episode-details',
  templateUrl: './episode-details.component.html',
  styles: [
    `
      .episodes-img {
        float: left;
        margin: 5px;
      }
    `
  ]
})
export class EpisodeDetailsComponent implements OnInit, OnDestroy {
  isVisible = false;
  songs: Song[];
  episode: EpisodeViewModel;
  private unsubscribe$ = new Subject();
  soundUrl: string;
  largeImage = false;

  constructor(
    private readonly episodesService: EpisodesService,
    private readonly playlistsService: PlaylistsService,
    private readonly srApiService: SRApiService,
    private readonly broker: MessageBrokerService,
    private readonly translate: TranslationService,
    private readonly activatedRoute: ActivatedRoute
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
        if (message.episodeId) {
          const res = await this.episodesService.fetchEpisode(message.episodeId);
          if (res?.episode) {
            const episodeVM = new EpisodeViewModel(res.episode);
            this.show(episodeVM);
          }
        }
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onToggleImageSize() {
    this.largeImage = !this.largeImage;
  }

  getSoundType(episode: EpisodeViewModel): string {
    let resourceId = 'SoundTypeNone';
    switch (episode.soundType) {
      case SoundType.Broadcast:
        resourceId = 'SoundTypeBroadcast';
        break;
      case SoundType.Podfile:
        resourceId = 'SoundTypePodfile';
        break;
    }

    return this.translate.translateWithArgs(resourceId);
  }

  private async show(episode: EpisodeViewModel) {
    this.largeImage = false;
    this.soundUrl = null;
    this.episode = episode;
    this.setSoundUrl(this.episode);
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
    //    this.broker.sendMessage(new NavigateBackMessage());
  }

  onPlayEpisode(episode: EpisodeViewModel) {
    this.setSoundUrl(episode);
    this.broker.sendMessage(new PlayAudioMessage(episode.title, this.soundUrl));
  }

  private setSoundUrl(episode: EpisodeViewModel) {
    this.soundUrl = episode.url;
  }

  get isCurrentlyPlaying(): boolean {
    return this.srApiService.isCurrentlyPlaying(this.soundUrl);
  }

  onAddToBookmarks() {
    this.srApiService.addBookmarkForEpisode(this.episode.id);
  }

  onRemoveFromBookmarks() {
    this.srApiService.removeBookmarkForEpisode(this.episode.id);
  }

  get isBookmarked(): boolean {
    return this.srApiService.isEpisodeBookmarked(this.episode.id);
  }

  showProgramDetails(programId: number) {
    this.isVisible = false;
    this.broker.sendMessage(new ShowProgramDetailsMessage(programId));
  }
}
