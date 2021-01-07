import { Component } from '@angular/core';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styles: [
    `
      ul {
        list-style-type: none;
        padding: 0;
      }
      li {
        display: inline;
      }
      a {
        padding: 10px;
      }
      .active {
        background-color: rgb(123, 149, 163);
        color: white;
      }
    `
  ]
})
export class NavigationBarComponent {}
