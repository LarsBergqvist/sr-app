import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessageService } from 'primeng/api';
import { MessageBrokerService } from './services/message-broker.service';
import { SRApiService } from './services/srapi.service';
import { filter, takeUntil } from 'rxjs/operators';
import { SuccessInfoMessage } from './messages/success-info.message';
import { Subject } from 'rxjs';
import { TranslationService } from './services/translation.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'sr-app';
  private unsubscribe$ = new Subject();

  constructor(
    private readonly srApiService: SRApiService,
    private readonly broker: MessageBrokerService,
    private readonly primeNGmessageService: MessageService,
    private readonly translationService: TranslationService
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

    await this.srApiService.fetchBaseData();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
