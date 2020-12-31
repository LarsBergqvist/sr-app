import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

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
import { FormsModule } from '@angular/forms';
import { AudioPlayerComponent } from './components/audio-player/audio-player.component';
import { EpisodesListComponent } from './components/episodes/episodes-list.component';
import { EpisodesComponent } from './components/episodes/episodes.component';
import { ProgramSelectorComponent } from './components/common/program-selector.component';

@NgModule({
    declarations: [
        AppComponent,
        ChannelsComponent,
        ChannelsListComponent,
        AudioPlayerComponent,
        EpisodesComponent,
        EpisodesListComponent,
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
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
