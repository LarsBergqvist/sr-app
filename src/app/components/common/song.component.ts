import { Component, Input, OnInit } from '@angular/core';
import { Song } from 'src/app/models/song';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html'
})
export class SongComponent implements OnInit {
  @Input() song: Song;
  constructor() {}

  ngOnInit(): void {}
}
