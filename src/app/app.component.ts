import { Component, OnDestroy, OnInit, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { AccordionModule } from 'primeng/accordion';
import { SelectButtonModule } from 'primeng/selectbutton';
import { Router, RouterOutlet } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { BookmarkChangedMessage } from './messages/bookmark-changed.message';
import { ErrorOccurredMessage } from './messages/error-occurred.message';
import { NavigateBackMessage } from './messages/navigate-back.message';
import { ShowChannelDetailsMessage } from './messages/show-channeldetails.message';
import { ShowChannelScheduleMessage } from './messages/show-channelschedule.message';
import { ShowProgramDetailsMessage } from './messages/show-programdetails.message';
import { SuccessInfoMessage } from './messages/success-info.message';
import { MessageBrokerService } from './services/message-broker.service';
import { BackNavigationService } from './services/back-navigation.service';
import { SRApiService } from './services/srapi.service';
import { TranslationService } from './services/translation.service';
import { SlideInAnimation } from './slide-animation';
import { NavigationBarComponent } from './components/navigation/navigation-bar.component';
import { AudioPlayerComponent } from './components/audio-player/audio-player.component';
import { ShowEpisodeDetailsMessage } from './messages/show-episodedetails.message';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [CommonModule, FormsModule, RouterModule, TableModule, ToolbarModule, ToastModule, ButtonModule, InputTextModule, CheckboxModule, AccordionModule, SelectButtonModule, NavigationBarComponent, AudioPlayerComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [SlideInAnimation]
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'sr-app';
  isLoading = false;
  private unsubscribe$ = new Subject();

  constructor(
    private readonly srApiService: SRApiService,
    private readonly broker: MessageBrokerService,
    private readonly primeNGmessageService: MessageService,
    private readonly translationService: TranslationService,
    private readonly router: Router,
    private readonly backNavigationService: BackNavigationService
  ) {}

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }

  async ngOnInit() {
    this.translationService.defaultLangCode = 'en';
    this.translationService.currentLocale = navigator.language;

    const messages = this.broker.getMessage();
    messages
      .pipe(
        takeUntil(this.unsubscribe$),
        filter((message) => message instanceof SuccessInfoMessage)
      )
      .subscribe((message: SuccessInfoMessage) => {
        this.primeNGmessageService.add({ severity: 'success', summary: '', detail: message.info });
      });
    messages
      .pipe(
        takeUntil(this.unsubscribe$),
        filter((message) => message instanceof ErrorOccurredMessage)
      )
      .subscribe((message: ErrorOccurredMessage) => {
        this.primeNGmessageService.add({ severity: 'error', summary: '', detail: message.errorMessage });
      });
    messages
      .pipe(
        takeUntil(this.unsubscribe$),
        filter((message) => message instanceof BookmarkChangedMessage)
      )
      .subscribe((message: BookmarkChangedMessage) => {
        this.primeNGmessageService.add({
          severity: 'success',
          summary: '',
          detail: message.isBookmarked
            ? this.translationService.translateWithArgs('BookmarkAdded')
            : this.translationService.translateWithArgs('BookmarkRemoved')
        });
      });

    messages
      .pipe(
        takeUntil(this.unsubscribe$),
        filter((message) => message instanceof ShowChannelDetailsMessage)
      )
      .subscribe((message: ShowChannelDetailsMessage) => {
        if (message.channelId) {
          this.router.navigate(['channels/' + message.channelId]);
        }
      });

    messages
      .pipe(
        takeUntil(this.unsubscribe$),
        filter((message) => message instanceof ShowChannelScheduleMessage)
      )
      .subscribe((message: ShowChannelScheduleMessage) => {
        if (message.channelId) {
          this.router.navigate(['channels/schedule/' + message.channelId]);
        }
      });

    messages
      .pipe(
        takeUntil(this.unsubscribe$),
        filter((message) => message instanceof ShowProgramDetailsMessage)
      )
      .subscribe((message: ShowProgramDetailsMessage) => {
        if (message.programId) {
          this.router.navigate(['programs/' + message.programId]);
        }
      });
    messages
      .pipe(
        takeUntil(this.unsubscribe$),
        filter((message) => message instanceof NavigateBackMessage)
      )
      .subscribe((message: NavigateBackMessage) => {
        this.backNavigationService.back();
      });
    messages
      .pipe(
        takeUntil(this.unsubscribe$),
        filter((message) => message instanceof ShowEpisodeDetailsMessage)
      )
      .subscribe((message: ShowEpisodeDetailsMessage) => {
        if (message.episodeId) {
          this.router.navigate(['episodes/' + message.episodeId]);
        }
      });

    await this.fetchBaseData();
  }

  async fetchBaseData() {
    try {
      this.isLoading = true;
      await this.srApiService.fetchBaseData();
    } finally {
      this.isLoading = false;
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next(undefined);
    this.unsubscribe$.complete();
  }
}
