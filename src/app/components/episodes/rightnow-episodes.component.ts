import { Component, Input } from '@angular/core';
import { ScheduledEpisode } from 'src/app/models/scheduled-episode';

@Component({
  selector: 'app-rightnow-episodes',
  templateUrl: './rightnow-episodes.component.html'
})
export class RightNowEpisodesComponent {
  @Input() currentEpisode: ScheduledEpisode;
  @Input() previousEpisode: ScheduledEpisode;
  @Input() nextEpisode: ScheduledEpisode;
}
