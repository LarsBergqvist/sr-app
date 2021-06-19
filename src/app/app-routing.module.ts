import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChannelsListComponent } from './components/channels/channels-list.component';
import { EpisodeDetailsComponent } from './components/episodes/episode-details.component';
import { EpisodesListComponent } from './components/episodes/episodes-list.component';
import { ProgramDetailsComponent } from './components/programs/program-details.component';
import { ProgramsListComponent } from './components/programs/programs-list.component';

const routes: Routes = [
  { path: 'channels', component: ChannelsListComponent },
  { path: 'channels/:id', component: ChannelsListComponent },
  { path: 'programs/:id', component: ProgramDetailsComponent },
  { path: 'programs', component: ProgramsListComponent },
  { path: 'episodes/:id', component: EpisodeDetailsComponent },
  { path: 'episodes', component: EpisodesListComponent },
  { path: '**', redirectTo: '/channels', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
