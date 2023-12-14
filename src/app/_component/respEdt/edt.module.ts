import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CalendarDateFormatter, CalendarModule, CalendarNativeDateFormatter, DateAdapter, DateFormatterParams } from 'angular-calendar';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import localeFr from '@angular/common/locales/fr';
import { registerLocaleData, DatePipe } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { WeekCalendarComponent, momentAdapterFactory } from './calendar-week/week-calendar.component';
import { ModifModalFormComponent } from 'src/app/modals/modif-modal-form/modif-modal-form.component';
import { DeleteModalComponent } from 'src/app/modals/delete-modal/delete-modal.component';
import { CourseAddComponent } from './course-add/course-add.component';
import { CourseEditComponent } from './course-edit/course-edit.component';
import { AuthInterceptor } from 'src/app/_security/auth.interceptor';

registerLocaleData(localeFr, 'fr');

class CustomDateFormater extends CalendarNativeDateFormatter {

  public override dayViewHour({ date, locale }: DateFormatterParams): string {
      return new Intl.DateTimeFormat(locale, {hour: 'numeric', minute:'numeric'}).format(date);
  }
}

@NgModule({
  declarations: [
    // AppComponent,
    WeekCalendarComponent,
    CourseAddComponent,
    CourseEditComponent,
    // FormsComponent,
    // FilterPipe,
    ModifModalFormComponent,
    DeleteModalComponent,
    
  ],
  imports: [
    BrowserAnimationsModule,
    MatDialogModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-center',
      progressBar: true,
    }),
    BrowserModule,
    // AppRoutingModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: momentAdapterFactory }),
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    
    
  ],
  providers: [
    DatePipe,
    {provide: CalendarDateFormatter, useClass:CustomDateFormater},
    HttpClientModule,
    // { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }


  ],
  
})
export class EdtModule { }
