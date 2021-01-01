import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChannelsComponent } from './components/channels/channels.component';
import { EpisodesComponent } from './components/episodes/episodes.component';

const routes: Routes = [
  { path: 'channels', component: ChannelsComponent },
  { path: 'episodes', component: EpisodesComponent },
  { path: '**', redirectTo: '/channels', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
