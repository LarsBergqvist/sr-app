import { Component, Input } from '@angular/core';
import { ScheduledEpisode } from 'src/app/models/scheduled-episode';

@Component({
  selector: 'app-scheduled-episode',
  templateUrl: './scheduled-episode.component.html'
})
export class ScheduledEpisodeComponent {
  @Input() episode: ScheduledEpisode;
}
