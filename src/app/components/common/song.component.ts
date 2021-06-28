import { Component, Input } from '@angular/core';
import { Song } from 'src/app/models/song';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html'
})
export class SongComponent {
  @Input() song: Song;
}
