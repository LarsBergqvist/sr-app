import { Component, OnInit } from '@angular/core';
import { PlayChannelMessage } from '../../messages/play-channel.message';
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
    currentStation =  '';
    private unsubsribe$ = new Subject();

    constructor(private readonly broker: MessageBrokerService) { }

    ngOnInit(): void { 
        const messages = this.broker.getMessage();
        messages.pipe(takeUntil(this.unsubsribe$), filter(message => message instanceof PlayChannelMessage))
            .subscribe(async (message: PlayChannelMessage) => {
                if (message) {
                    this.currentStation = message.channelName;
                    this.currentUrlToPlay = message.channeUrl;
                    const audio = document.getElementById('audio');
                    if (audio) {
                        (audio as any).load();
                        (audio as any).play();    
                    }
                }
            });

    }
}
