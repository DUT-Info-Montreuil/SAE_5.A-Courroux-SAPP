import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AcceuilComponent } from './acceuil/acceuil.component';
import { EdtComponent } from './edt/edt.component';
import { EdtUserComponent } from './edt/edtUser/edt-user/edt-user.component';
import { FormsComponent } from './forms/forms.component';

const routes: Routes = [
  { path: 'edt', component: EdtComponent},
  { path: 'edtUser', component: EdtUserComponent},
  { path: 'acceuil', component: AcceuilComponent},
  { path: 'ajout', component: FormsComponent},
  { path: '', redirectTo: '/acceuil', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], //RouterModule.forRoot(routes, { useHash: true }) 
  exports: [RouterModule]
})

export class AppRoutingModule { }
