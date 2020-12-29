import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChannelsListComponent } from './channels-list/channels-list.component';
import { HttpClientModule } from '@angular/common/http';
import { TableModule } from 'primeng-lts/table';
import { ToolbarModule } from 'primeng-lts/toolbar';
import { DropdownModule } from 'primeng-lts/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ChannelsComponent } from './channels.component';
import { ProgramsComponent } from './programs.component';
import { ProgramsListComponent } from './programs-list/programs-list.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        AppComponent,
        ChannelsComponent,
        ChannelsListComponent,
        ProgramsComponent,
        ProgramsListComponent
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
