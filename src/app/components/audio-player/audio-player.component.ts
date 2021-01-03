import { Component, OnInit } from '@angular/core';
import { PlayAudioMessage } from '../../messages/play-audio.message';
import { MessageBrokerService } from '../../services/message-broker.service';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss']
})
export class AudioPlayerComponent implements OnInit {
  currentUrlToPlay = '';
  currentStation = '';
  private unsubscribe$ = new Subject();

  constructor(private readonly broker: MessageBrokerService) {}

  ngOnInit(): void {
    const messages = this.broker.getMessage();
    messages
      .pipe(
        takeUntil(this.unsubscribe$),
        filter((message) => message instanceof PlayAudioMessage)
      )
      .subscribe(async (message: PlayAudioMessage) => {
        if (message) {
          this.currentStation = message.title;
          this.currentUrlToPlay = message.url;
          const audio = document.getElementById('audio');
          if (audio) {
            (audio as any).load();
            (audio as any).play();
          }
        }
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
