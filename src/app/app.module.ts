import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChannelsListComponent } from './components/channels/channels-list.component';
import { HttpClientModule } from '@angular/common/http';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChannelsComponent } from './components/channels/channels.component';
import { ChannelDetailsComponent } from './components/channels/channel-details.component';
import { FormsModule } from '@angular/forms';
import { AudioPlayerComponent } from './components/audio-player/audio-player.component';
import { EpisodesListComponent } from './components/episodes/episodes-list.component';
import { EpisodesComponent } from './components/episodes/episodes.component';
import { ProgramSelectorComponent } from './components/common/program-selector.component';
import { SidebarModule } from 'primeng/sidebar';
import { SongComponent } from './components/common/song.component';
import { EpisodeDetailsComponent } from './components/episodes/episode-details.component';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { ScheduledEpisodeComponent } from './components/episodes/scheduled-episode.component';
import { RightNowEpisodesComponent } from './components/episodes/rightnow-episodes.component';
import { ChannelScheduleComponent } from './components/channels/channel-schedule.component';

import { registerLocaleData } from '@angular/common';
import locale from '@angular/common/locales/sv';
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
    EpisodesComponent,
    EpisodesListComponent,
    EpisodeDetailsComponent,
    ScheduledEpisodeComponent,
    RightNowEpisodesComponent,
    ProgramSelectorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    TableModule,
    ToolbarModule,
    DropdownModule,
    FormsModule,
    BrowserAnimationsModule,
    ButtonModule,
    SidebarModule,
    ScrollPanelModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'sv' }],
  bootstrap: [AppComponent]
})
export class AppModule {}
