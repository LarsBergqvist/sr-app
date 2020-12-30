import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChannelsComponent } from './components/channels/channels.component';
import { ProgramsComponent } from './components/programs/programs.component';

const routes: Routes = [
    { path: 'channels', component: ChannelsComponent },
    { path: 'programs', component: ProgramsComponent },
    { path: '',   redirectTo: '/channels', pathMatch: 'full' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
