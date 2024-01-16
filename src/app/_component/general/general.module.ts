import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { WeekCalendarComponent } from '../respEdt/calendar-week/week-calendar.component';
import { WeekViewCalendarComponent } from '../user/calendar-week/week-view-calendar.component';
import { Calendar } from './calendar/calendar.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UsersModule } from '../user/user.module';
import { EdtModule } from '../respEdt/edt.module';
import { TeacherModule } from '../teacher/teacher.module';


@NgModule({
  declarations: [
    Calendar,
  ],
  imports: [
    RouterModule,
    CommonModule,
    UsersModule,
    EdtModule,
    TeacherModule
    // WeekCalendarComponent,
    // WeekViewCalendarComponent
  ],
  providers: [
    
    // { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }


  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

  
})
export class GeneralModule { }
