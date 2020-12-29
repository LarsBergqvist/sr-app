import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChannelsComponent } from './channels.component';
import { ProgramsComponent } from './programs.component';

const routes: Routes = [
    { path: 'channels', component: ChannelsComponent },
    { path: 'programs', component: ProgramsComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
