import { Component, OnInit } from '@angular/core';
import { PlayAudioMessage } from '../../messages/play-audio.message';
import { MessageBrokerService } from '../../services/message-broker.service';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SRApiService } from 'src/app/services/srapi.service';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss']
})
export class AudioPlayerComponent implements OnInit {
  currentUrlToPlay = '';
  currentStation = '';
  private unsubscribe$ = new Subject();

  constructor(private readonly broker: MessageBrokerService, private readonly srApiService: SRApiService) {}

  ngOnInit(): void {
    const messages = this.broker.getMessage();
    messages
      .pipe(
        takeUntil(this.unsubscribe$),
        filter((message) => message instanceof PlayAudioMessage)
      )
      .subscribe(async (message: PlayAudioMessage) => {
        if (message) {
          const audio: any = document.getElementById('audio');
          if (message.url === this.currentUrlToPlay) {
            if (audio) {
              if (audio.paused) {
                audio.play();
              } else {
                audio.pause();
              }
            }
          } else {
            this.currentStation = message.title;
            this.currentUrlToPlay = message.url;
            if (audio) {
              audio.load();
              audio.play();
            }
          }
        }
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onPlay(event) {
    this.srApiService.setCurrentlyPlaying(this.currentUrlToPlay);
  }

  onPause(event) {
    this.srApiService.setCurrentlyPlaying('');
  }
}
