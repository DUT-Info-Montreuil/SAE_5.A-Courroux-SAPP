import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './_component/user/login/login.component';
import { WeekCalendarComponent } from './_component/calendar/calendar-week/week-calendar.component';
import { FormsComponent } from './forms/forms.component';

const routes: Routes = [
  { path: 'edt', component: WeekCalendarComponent},
  { path: 'login', component: LoginComponent},
  { path: 'ajout', component: FormsComponent},
  { path: '', redirectTo: '/acceuil', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], //RouterModule.forRoot(routes, { useHash: true }) 
  exports: [RouterModule]
})

export class AppRoutingModule { }
