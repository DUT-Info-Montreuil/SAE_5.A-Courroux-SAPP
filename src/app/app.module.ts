import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './_component/user/login/login.component';
import { CalendarDateFormatter, CalendarModule, CalendarNativeDateFormatter, CalendarWeekModule, DateAdapter, DateFormatterParams } from 'angular-calendar';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import localeFr from '@angular/common/locales/fr';
import { registerLocaleData, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsComponent } from './forms/forms.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FilterPipe } from './pipes/filter.pipe';
import { UsersModule } from './_component/user/user.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './_security/auth.interceptor';
import { MatDialogModule } from '@angular/material/dialog';
import { ModifModalFormComponent } from './modals/modif-modal-form/modif-modal-form.component';
import { DeleteModalComponent } from './modals/delete-modal/delete-modal.component';
import { WeekCalendarComponent, momentAdapterFactory } from './_component/respEdt/calendar-week/week-calendar.component';
import { EdtModule } from './_component/respEdt/edt.module';
import { ElevesGroupesComponent } from './eleves-groupes/eleves-groupes.component';
import { ModifModalGroupComponent } from './modals/modif-modal-group/modif-modal-group.component';
import { AddModalEleveComponent } from './modals/add-modal-eleve/add-modal-eleve.component';
import { CsvEleveModalComponent } from './modals/csv-eleve-modal/csv-eleve-modal.component';
import { AddModalPromoComponent } from './modals/add-modal-promo/add-modal-promo.component';

registerLocaleData(localeFr, 'fr');

class CustomDateFormater extends CalendarNativeDateFormatter {

  public override dayViewHour({ date, locale }: DateFormatterParams): string {
      return new Intl.DateTimeFormat(locale, {hour: 'numeric', minute:'numeric'}).format(date);
  }
}

@NgModule({
  declarations: [
    AppComponent,
    // CalendarWeekComponent,
    FormsComponent,
    FilterPipe,
    ElevesGroupesComponent,
    ModifModalGroupComponent,
    AddModalEleveComponent,
    CsvEleveModalComponent,
    AddModalPromoComponent
    // ModifModalFormComponent,
    // DeleteModalComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    MatDialogModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-center',
      progressBar: true,
    }),
    BrowserModule,
    AppRoutingModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: momentAdapterFactory }),
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    UsersModule,
    EdtModule
    
  ],
  providers: [
    FormsComponent,
    DatePipe,
    {provide: CalendarDateFormatter, useClass:CustomDateFormater},
    HttpClientModule,
    FormsModule,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
