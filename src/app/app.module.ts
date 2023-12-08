import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AcceuilComponent } from './acceuil/acceuil.component';
import { EdtComponent, momentAdapterFactory } from './edt/edt.component';
import { CalendarDateFormatter, CalendarModule, CalendarNativeDateFormatter, DateAdapter, DateFormatterParams } from 'angular-calendar';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import localeFr from '@angular/common/locales/fr';
import { registerLocaleData, DatePipe } from '@angular/common';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsComponent } from './forms/forms.component';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FilterPipe } from './pipes/filter.pipe';

registerLocaleData(localeFr, 'fr');

class CustomDateFormater extends CalendarNativeDateFormatter {

  public override dayViewHour({ date, locale }: DateFormatterParams): string {
      return new Intl.DateTimeFormat(locale, {hour: 'numeric', minute:'numeric'}).format(date);
  }

}

@NgModule({
  declarations: [
    AppComponent,
    AcceuilComponent,
    EdtComponent,
    SidebarComponent,
    FormsComponent,
    FilterPipe,
  ],
  imports: [
    BrowserAnimationsModule,
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
  ],
  providers: [
    DatePipe,
    {provide: CalendarDateFormatter, useClass:CustomDateFormater},
    HttpClientModule,
    FormsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
