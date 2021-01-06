import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChannelsListComponent } from './components/channels/channels-list.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChannelsComponent } from './components/channels/channels.component';
import { ChannelDetailsComponent } from './components/channels/channel-details.component';
import { FormsModule } from '@angular/forms';
import { AudioPlayerComponent } from './components/audio-player/audio-player.component';
import { SidebarModule } from 'primeng/sidebar';
import { SongComponent } from './components/common/song.component';
import { EpisodeDetailsComponent } from './components/episodes/episode-details.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { ScheduledEpisodeComponent } from './components/episodes/scheduled-episode.component';
import { RightNowEpisodesComponent } from './components/episodes/rightnow-episodes.component';
import { ChannelScheduleComponent } from './components/channels/channel-schedule.component';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';

import { registerLocaleData } from '@angular/common';
import locale from '@angular/common/locales/sv';
import { MessageService } from 'primeng/api';
import { TranslatePipe } from './translations/translate.pipe';
import { HttpInterceptorService } from './services/http-interceptor.service';
import { LoggingService } from './services/logging.service';
import { MessageBrokerService } from './services/message-broker.service';
import { ProgramsListComponent } from './components/programs/programs-list.component';
import { ProgramEpisodesComponent } from './components/programs/program-episodes.component';
import { InputTextModule } from 'primeng/inputtext';
registerLocaleData(locale);

@NgModule({
  declarations: [
    AppComponent,
    ChannelsComponent,
    ChannelsListComponent,
    ChannelDetailsComponent,
    ChannelScheduleComponent,
    SongComponent,
    AudioPlayerComponent,
    EpisodeDetailsComponent,
    ScheduledEpisodeComponent,
    RightNowEpisodesComponent,
    TranslatePipe,
    ProgramsListComponent,
    ProgramEpisodesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    TableModule,
    ToolbarModule,
    FormsModule,
    BrowserAnimationsModule,
    SidebarModule,
    ToastModule,
    ButtonModule,
    InputTextModule,
    CheckboxModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'sv' },
    MessageService,
    LoggingService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true,
      deps: [MessageBrokerService, LoggingService]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
