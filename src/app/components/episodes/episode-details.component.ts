import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
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
import { ActivatedRoute } from '@angular/router';
import { NavigateBackMessage } from 'src/app/messages/navigate-back.message';

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
    this.activatedRoute.params
    .pipe(
      takeUntil(this.unsubscribe$),
      map((route) => route.id)
    )
    .subscribe(async (id: string) => {
        let idInt = parseInt(id);
        if (!isNaN(idInt)) {
          const res = await this.episodesService.fetchEpisode(parseInt(id));
          if (res?.episode) {
            const episodeVM = new EpisodeViewModel(res.episode);
            this.show(episodeVM);
          }  
        }
      }
    );
  }

  ngOnDestroy() {
    this.unsubscribe$.next(undefined);
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
    try {
      const res = await this.playlistsService.fetchSonglistForEpisode(episode.id);
      this.songs = res.song;  
    } catch {

    }
    
    if (this.songs) {
      this.songs.forEach((s) => this.convertDate(s));
      this.songs.sort((a, b) => a.starttimeutcDate.getTime() - b.starttimeutcDate.getTime());  
    }   
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
    this.broker.sendMessage(new NavigateBackMessage());
  }

  onPlayEpisode(episode: EpisodeViewModel) {
    this.setSoundUrl(episode);
    this.broker.sendMessage(new PlayAudioMessage(episode.title, this.soundUrl, episode.id));
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

  get canShare(): boolean {
    return !!navigator.share;
  }

  share() {
    if (navigator.share) {
      navigator.share({
        title: this.episode.title,
        url: this.episode.linkUrl
      });
    }
  }

  showProgramDetails(programId: number) {
    this.broker.sendMessage(new ShowProgramDetailsMessage(programId));
  }

  onShowEpisode(id: number) {
    this.broker.sendMessage(new ShowEpisodeDetailsMessage(id));
  }
}
