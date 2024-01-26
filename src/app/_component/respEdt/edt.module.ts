import { DatePipe, registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import localeFr from '@angular/common/locales/fr';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarDateFormatter, CalendarModule, CalendarNativeDateFormatter, DateAdapter, DateFormatterParams } from 'angular-calendar';
import { ToastrModule } from 'ngx-toastr';
import { DeleteModalComponent } from 'src/app/_component/respEdt/modals/delete-modal/delete-modal.component';
import { WeekCalendarComponent, momentAdapterFactory } from './calendar-week/week-calendar.component';
import { ChoiceCourseComponent } from './choice-course/choice-course.component';
import { CommentAddComponent } from './comment-add/comment-add.component';
import { CopyCourseComponent } from './copy-course/copy-course.component';
import { CourseAddComponent } from './course-add/course-add.component';
import { CourseDeleteComponent } from './course-delete/course-delete.component';
import { CourseDuplicateShowComponent } from './course-duplicate-show/course-duplicate-show.component';
import { CourseDuplicateComponent } from './course-duplicate/course-duplicate.component';
import { CourseEditComponent } from './course-edit/course-edit.component';
import { ModifModalFormComponent } from './modals/modif-modal-form/modif-modal-form.component';

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
    CommentAddComponent,
    CopyCourseComponent,
    // FormsComponent,
    // FilterPipe,
    ModifModalFormComponent,
    DeleteModalComponent,
    ChoiceCourseComponent,
    CourseDeleteComponent,
    CourseDuplicateComponent,
    CourseDuplicateShowComponent
    // StatsTeacherComponent
    
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
    { provide: LOCALE_ID, useValue: 'fr' }

    // { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }


  ],
  exports: [
    WeekCalendarComponent
  ],
  
})
export class EdtModule { }
