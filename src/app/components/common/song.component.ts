import { Component, Input, OnInit } from '@angular/core';
import { Song } from 'src/app/models/Song';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.scss']
})
export class SongComponent implements OnInit {
  @Input() song: Song;
  constructor() {}

  ngOnInit(): void {}
}
