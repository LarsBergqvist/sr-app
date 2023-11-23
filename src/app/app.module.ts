import { registerLocaleData } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import locale from '@angular/common/locales/sv';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouteReuseStrategy } from '@angular/router';
import { AccordionModule } from 'primeng/accordion';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AudioPlayerComponent } from './components/audio-player/audio-player.component';
import { ChannelDetailsComponent } from './components/channels/channel-details.component';
import { ChannelScheduleComponent } from './components/channels/channel-schedule.component';
import { ChannelsListComponent } from './components/channels/channels-list.component';
import { SongComponent } from './components/common/song.component';
import { EpisodeDetailsComponent } from './components/episodes/episode-details.component';
import { EpisodesBookmarksComponent } from './components/episodes/episodes-bookmarks.component';
import { EpisodesListComponent } from './components/episodes/episodes-list.component';
import { EpisodesTableComponent } from './components/episodes/episodes-table.component';
import { ScheduledEpisodeComponent } from './components/episodes/scheduled-episode.component';
import { NavigationBarComponent } from './components/navigation/navigation-bar.component';
import { ProgramDetailsComponent } from './components/programs/program-details.component';
import { ProgramsListComponent } from './components/programs/programs-list.component';
import { CustomRouteReuseStrategy } from './custom-route-reuse-strategy';
import { HttpInterceptorService } from './services/http-interceptor.service';
import { LoggingService } from './services/logging.service';
import { MessageBrokerService } from './services/message-broker.service';
import { TranslatePipe } from './translations/translate.pipe';
import { SelectButtonModule } from 'primeng/selectbutton';

registerLocaleData(locale);

@NgModule({
  declarations: [
    AppComponent,
    NavigationBarComponent,
    ChannelsListComponent,
    ChannelDetailsComponent,
    ChannelScheduleComponent,
    SongComponent,
    AudioPlayerComponent,
    EpisodeDetailsComponent,
    ScheduledEpisodeComponent,
    TranslatePipe,
    ProgramsListComponent,
    ProgramDetailsComponent,
    EpisodesListComponent,
    EpisodesTableComponent,
    EpisodesBookmarksComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    TableModule,
    ToolbarModule,
    FormsModule,
    BrowserAnimationsModule,
    ToastModule,
    ButtonModule,
    InputTextModule,
    CheckboxModule,
    AccordionModule,
    SelectButtonModule
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
    },
    {
      provide: RouteReuseStrategy,
      useClass: CustomRouteReuseStrategy
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
