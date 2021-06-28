import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppRoutes } from './app-routes';
import { ChannelDetailsComponent } from './components/channels/channel-details.component';
import { ChannelScheduleComponent } from './components/channels/channel-schedule.component';
import { ChannelsListComponent } from './components/channels/channels-list.component';
import { EpisodeDetailsComponent } from './components/episodes/episode-details.component';
import { EpisodesListComponent } from './components/episodes/episodes-list.component';
import { ProgramDetailsComponent } from './components/programs/program-details.component';
import { ProgramsListComponent } from './components/programs/programs-list.component';

const routes: Routes = [
  { path: AppRoutes.Channels, component: ChannelsListComponent, data: { animation: 'channels' } },
  { path: AppRoutes.ChannelDetails, component: ChannelDetailsComponent, data: { animation: 'details' } },
  { path: AppRoutes.ChannelSchedule, component: ChannelScheduleComponent, data: { animation: 'details' } },
  { path: AppRoutes.ProgramDetails, component: ProgramDetailsComponent, data: { animation: 'details' } },
  { path: AppRoutes.Programs, component: ProgramsListComponent, data: { animation: 'programs' } },
  { path: AppRoutes.EpisodeDetails, component: EpisodeDetailsComponent, data: { animation: 'details' } },
  { path: AppRoutes.Episodes, component: EpisodesListComponent, data: { animation: 'episodes' } },
  { path: '**', redirectTo: AppRoutes.Channels, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy', scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
