import { Component, OnInit } from '@angular/core';
import { PlayAudioMessage } from '../../messages/play-audio.message';
import { MessageBrokerService } from '../../services/message-broker.service';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SRApiService } from 'src/app/services/srapi.service';
import { ShowChannelDetailsMessage } from 'src/app/messages/show-channeldetails.message';
import { ShowEpisodeDetailsMessage } from 'src/app/messages/show-episodedetails.message';
import { TranslationService } from 'src/app/services/translation.service';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss']
})
export class AudioPlayerComponent implements OnInit {
  currentUrlToPlay = '';
  currentStation = '';
  private unsubscribe$ = new Subject();
  episodeId: number = undefined;
  channelId: number = undefined;
  prefixText: string = '';
  isPlaying = false;

  constructor(
    private readonly broker: MessageBrokerService,
    private readonly srApiService: SRApiService,
    private readonly translate: TranslationService
  ) {}

  ngOnInit(): void {
    const messages = this.broker.getMessage();
    messages
      .pipe(
        takeUntil(this.unsubscribe$),
        filter((message) => message instanceof PlayAudioMessage)
      )
      .subscribe(async (message: PlayAudioMessage) => {
        if (message) {
          this.episodeId = message.episodeId;
          this.channelId = message.channelId;
          if (this.episodeId) {
            this.prefixText = this.translate.translateWithArgs('AudioPrefixEpisode') + ': ';
          } else if (this.channelId) {
            this.prefixText = this.translate.translateWithArgs('AudioPrefixChannel') + ': ';
          } else {
            this.prefixText = '';
          }
          const audio: any = document.getElementById('audio');
          if (message.url === this.currentUrlToPlay) {
            if (audio) {
              if (audio.paused) {
                audio.play();
                this.isPlaying = true;
              } else {
                audio.pause();
                this.isPlaying = false;
              }
            }
          } else {
            this.currentStation = message.title;
            this.currentUrlToPlay = message.url;
            if (audio) {
              audio.load();
              audio.play();
              this.isPlaying = true;
            }
          }
        }
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next(undefined);
    this.unsubscribe$.complete();
  }

  onPlay() {
    this.srApiService.setCurrentlyPlaying(this.currentUrlToPlay);
    this.isPlaying = true;
  }

  onPause() {
    this.srApiService.setCurrentlyPlaying('');
    this.isPlaying = false;
  }

  onOpenDetails() {
    if (this.episodeId) {
      this.broker.sendMessage(new ShowEpisodeDetailsMessage(this.episodeId));
    } else if (this.channelId) {
      this.broker.sendMessage(new ShowChannelDetailsMessage(this.channelId));
    }
  }
}
