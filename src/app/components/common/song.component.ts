import { Component, Input, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from 'src/app/translations/translate.pipe';
import { Song } from 'src/app/models/song';

@Component({
  standalone: true,
  selector: 'app-song',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './song.component.html'
})
export class SongComponent {
  @Input() song: Song;
}
