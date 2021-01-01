import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-channel-details',
  templateUrl: './channel-details.component.html'
})
export class ChannelDetailsComponent implements OnInit {
  isVisible = false;
  constructor() {}

  ngOnInit(): void {}

  open() {
    this.isVisible = true;
  }

  close() {
    this.isVisible = false;
  }
}
