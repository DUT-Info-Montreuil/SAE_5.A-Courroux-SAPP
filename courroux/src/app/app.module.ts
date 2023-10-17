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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: momentAdapterFactory }),
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
    DatePipe,
    {provide: CalendarDateFormatter, useClass:CustomDateFormater}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
