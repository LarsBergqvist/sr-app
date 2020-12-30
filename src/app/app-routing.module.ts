import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChannelsComponent } from './components/channels/channels.component';
import { EpisodesComponent } from './components/episodes/episodes.component';
import { ProgramsComponent } from './components/programs/programs.component';

const routes: Routes = [
    { path: 'channels', component: ChannelsComponent },
    { path: 'programs', component: ProgramsComponent },
    { path: 'episodes', component: EpisodesComponent },
    { path: '**',   redirectTo: '/channels', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
