import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessageService } from 'primeng/api';
import { MessageBrokerService } from './services/message-broker.service';
import { SRApiService } from './services/srapi.service';
import { filter, takeUntil } from 'rxjs/operators';
import { SuccessInfoMessage } from './messages/success-info.message';
import { Subject } from 'rxjs';
import { TranslationService } from './services/translation.service';
import { ErrorOccurredMessage } from './messages/error-occurred.message';
import { BookmarkChangedMessage } from './messages/bookmark-changed.message';
import { ShowEpisodeDetailsMessage } from './messages/show-episodedetails.message';
import { Router } from '@angular/router';
import { ShowProgramDetailsMessage } from './messages/show-programdetails.message';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
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
    private readonly router: Router
  ) {}

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
        filter((message) => message instanceof ShowEpisodeDetailsMessage)
      )
      .subscribe((message: ShowEpisodeDetailsMessage) => {
        if (message.episodeId) {
          this.router.navigate(['episodes/' + message.episodeId]);
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
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
