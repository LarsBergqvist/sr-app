import { Component, Input, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from 'src/app/translations/translate.pipe';
import { ShowEpisodeDetailsMessage } from 'src/app/messages/show-episodedetails.message';
import { ScheduledEpisode } from 'src/app/models/scheduled-episode';
import { MessageBrokerService } from 'src/app/services/message-broker.service';

@Component({
  standalone: true,
  selector: 'app-scheduled-episode',
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './scheduled-episode.component.html'
})
export class ScheduledEpisodeComponent {
  @Input() episode: ScheduledEpisode;
  @Input() header: string;

  constructor(private readonly broker: MessageBrokerService) {}

  onOpenDetails(episodeId: number) {
    this.broker.sendMessage(new ShowEpisodeDetailsMessage(episodeId));
  }
}
