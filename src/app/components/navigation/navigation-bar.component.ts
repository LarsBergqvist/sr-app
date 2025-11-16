import { Component, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ToolbarModule } from 'primeng/toolbar';
import { TranslatePipe } from 'src/app/translations/translate.pipe';

@Component({
  standalone: true,
  selector: 'app-navigation-bar',
  imports: [CommonModule, RouterModule, ToolbarModule, TranslatePipe],
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss']
})
export class NavigationBarComponent {}
