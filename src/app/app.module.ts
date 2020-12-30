import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChannelsListComponent } from './components/channels/channels-list.component';
import { HttpClientModule } from '@angular/common/http';
import { TableModule } from 'primeng-lts/table';
import { ToolbarModule } from 'primeng-lts/toolbar';
import { DropdownModule } from 'primeng-lts/dropdown';
import { ButtonModule } from 'primeng-lts/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChannelsComponent } from './components/channels/channels.component';
import { ProgramsComponent } from './components/programs/programs.component';
import { ProgramsListComponent } from './components/programs/programs-list.component';
import { FormsModule } from '@angular/forms';
import { AudioPlayerComponent } from './components/audio-player/audio-player.component';
import { EpisodesListComponent } from './components/episodes/episodes-list.component';
import { EpisodesComponent } from './components/episodes/episodes.component';
import { CategoryComponent } from './components/common/category.component';
import { ProgramSelectorComponent } from './components/common/program-selector.component';

@NgModule({
    declarations: [
        AppComponent,
        ChannelsComponent,
        ChannelsListComponent,
        ProgramsComponent,
        ProgramsListComponent,
        AudioPlayerComponent,
        EpisodesComponent,
        EpisodesListComponent,
        CategoryComponent,
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
