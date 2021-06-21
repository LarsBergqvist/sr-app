import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChannelDetailsComponent } from './components/channels/channel-details.component';
import { ChannelScheduleComponent } from './components/channels/channel-schedule.component';
import { ChannelsListComponent } from './components/channels/channels-list.component';
import { EpisodeDetailsComponent } from './components/episodes/episode-details.component';
import { EpisodesListComponent } from './components/episodes/episodes-list.component';
import { ProgramDetailsComponent } from './components/programs/program-details.component';
import { ProgramsListComponent } from './components/programs/programs-list.component';

const routes: Routes = [
  { path: 'channels', component: ChannelsListComponent, data: { animation: 'channels' } },
  { path: 'channels/:id', component: ChannelDetailsComponent, data: { animation: 'details' } },
  { path: 'channels/schedule/:id', component: ChannelScheduleComponent, data: { animation: 'details' } },
  { path: 'programs/:id', component: ProgramDetailsComponent, data: { animation: 'details' } },
  { path: 'programs', component: ProgramsListComponent, data: { animation: 'programs' } },
  { path: 'episodes/:id', component: EpisodeDetailsComponent, data: { animation: 'details' } },
  { path: 'episodes', component: EpisodesListComponent, data: { animation: 'episodes' } },
  { path: '**', redirectTo: '/channels', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
