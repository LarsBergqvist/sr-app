import { Component, Input } from '@angular/core';
import { ShowEpisodeDetailsMessage } from 'src/app/messages/show-episodedetails.message';
import { ScheduledEpisode } from 'src/app/models/scheduled-episode';
import { MessageBrokerService } from 'src/app/services/message-broker.service';

@Component({
  selector: 'app-scheduled-episode',
  templateUrl: './scheduled-episode.component.html'
})
export class ScheduledEpisodeComponent {
  @Input() episode: ScheduledEpisode;

  constructor(private readonly broker: MessageBrokerService) {}

  onOpenDetails(episodeId: number) {
    this.broker.sendMessage(new ShowEpisodeDetailsMessage(null, episodeId));
  }
}
