import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JoinComponent } from './join/join.component';
import { PlayComponent } from './play/play.component';
import { UserAuthGuard } from './services/user.auth.guard';

const routes: Routes = [
  { path: 'play', component: PlayComponent, canActivate: [UserAuthGuard] },
  { path: 'join', component: JoinComponent },
  { path: '',   redirectTo: '/join', pathMatch: 'full' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }