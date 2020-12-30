import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChannelsListComponent } from './components/channels/channels-list.component';
import { HttpClientModule } from '@angular/common/http';
import { TableModule } from 'primeng-lts/table';
import { ToolbarModule } from 'primeng-lts/toolbar';
import { DropdownModule } from 'primeng-lts/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChannelsComponent } from './components/channels/channels.component';
import { ProgramsComponent } from './components/programs/programs.component';
import { ProgramsListComponent } from './components/programs/programs-list.component';
import { FormsModule } from '@angular/forms';
import { AudioPlayerComponent } from './components/audio-player/audio-player.component';

@NgModule({
    declarations: [
        AppComponent,
        ChannelsComponent,
        ChannelsListComponent,
        ProgramsComponent,
        ProgramsListComponent,
        AudioPlayerComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        TableModule,
        ToolbarModule,
        DropdownModule,
        FormsModule,
        BrowserAnimationsModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
