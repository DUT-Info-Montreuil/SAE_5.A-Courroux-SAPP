import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './_component/user/login/login.component';
import { WeekCalendarComponent } from './_component/respEdt/calendar-week/week-calendar.component';
import { FormsComponent } from './forms/forms.component';
import { WeekViewCalendarComponent } from './_component/user/calendar-week/week-view-calendar.component';
import { ElevesGroupesComponent } from './eleves-groupes/eleves-groupes.component';

const routes: Routes = [
  { path: '', component: WeekCalendarComponent},
  { path: 'login', component: LoginComponent},
  { path: 'ajout', component: FormsComponent},
  { path: 'user', component: WeekViewCalendarComponent },
  { path: 'groupes', component: ElevesGroupesComponent },
  { path: '**', redirectTo: '/', data: { error404: true } }, 

];

@NgModule({
  imports: [RouterModule.forRoot(routes)], //RouterModule.forRoot(routes, { useHash: true }) 
  exports: [RouterModule]
})

export class AppRoutingModule { }
