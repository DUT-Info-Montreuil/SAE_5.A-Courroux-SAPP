import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { CalendarEvent, CalendarView, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/moment';
import * as moment from 'moment';
import { Observable, Subject, find } from 'rxjs';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { EdtService } from '../../../services/edt.service';
import { TeacherService } from '../../../_service/teacher.service';
import { Teacher } from '../../../_model/entity/teacher.model';
import { CourseService } from '../../../_service/course.service';
import { Course } from '../../../_model/entity/course.model';
import { ResourceService } from '../../../_service/resource.service';
import { Resource } from '../../../_model/entity/resource.model';
import { Group } from '../../../_model/entity/group.model';
import { GroupService } from '../../../_service/group.service';
import { format } from 'date-fns';
import { ToastrService } from 'ngx-toastr';
import { RoomService } from 'src/app/_service/room.service';


export function momentAdapterFactory() {
  return adapterFactory(moment);
};



@Component({
  selector: 'app-calendar-week',
  templateUrl: './week-calendar.component.html',
  styleUrls: ['./week-calendar.component.scss']
})

export class WeekCalendarComponent{
  
  courses: Course[] = [];
  teachers: Teacher[] = [];
  salles: any[] = [];
  ressources: Resource[] = [];
  groupes: Group[] = [];

  courseForEdit: Course;

  // minEndTime!: string;
  // maxStartTime!: string;

  public eventSelectionne: any = null;

  showModalMod = false;
  showModalAdd = false;

  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Week;

  events: CalendarEvent[] = [];
  eventsToPushToBd: CalendarEvent[] = [];

  refresh = new Subject<void>();

  getIndex(event: any){
    return this.events.indexOf(event.event);
  }

  constructor(
    private datePipe: DatePipe,
    // private edtService: EdtService,
    // private cdr: ChangeDetectorRef,
    // private zone: NgZone,
    private teacherService: TeacherService,
    private courseService: CourseService,
    private resourceService: ResourceService,
    private groupService: GroupService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private roomService: RoomService) {

  }

  ngOnInit(): void {
    this.loadEvents();

      this.teacherService.getTeachers().subscribe({
        next: data => {
          for(let teacher of data) {
            this.teachers.push(teacher);
          }
        },
        error :error => {
          console.log(error);
        }
      }
      );
      this.roomService.getSalles().subscribe({
        next: data => {
          for (let salle of data) {
            this.salles.push(salle);
          }
        },
        error: error => {
          console.log(error);
        }
      }
      );
      this.resourceService.getResources().subscribe({
        next: data => {
          for(let resource of data) {
            this.ressources.push(resource);
          }
        },
        error: error => {
          console.log(error);
        }
      }
      )
      this.groupService.getGroups().subscribe({
        next: data => {
          for(let group of data) {
            this.groupes.push(group);
          }
        },
        error: error => {
          console.log(error);
        }
      }
      )
  }

  openModalMod(eventId: number) {
    this.courseForEdit = this.getCourseByEventId(eventId)!;

    this.showModalMod = true;

  }
  
  closeModalMod() {
    this.showModalMod = false;
    this.eventSelectionne.event.start = Date.parse(this.eventSelectionne.event.start);
    this.eventSelectionne.event.end = Date.parse(this.eventSelectionne.event.end);
  }

  openModalAdd() {
    this.showModalAdd = true;
  }
  

  closeModalAdd() {
    this.showModalAdd = false;
  }



  loadEvents(){
    console.log("loadEvents");
    this.events = [];

    let day = this.viewDate.getDay();
    let diff = this.viewDate.getDate() - day + (day == 0 ? -6:1);
    console.log(diff);
    let date_temp = new Date(this.viewDate);
    let monday = new Date(date_temp.setDate(diff));
    let friday = new Date(date_temp.setDate(diff + 4));

    const args = [{date_min: format(monday, 'yyyy-MM-dd')}, {date_max: format(friday, 'yyyy-MM-dd')}];

    this.courseService.getCourses(args).subscribe({
      next : courses => {
        this.courses = courses;
        this.events = [];
        console.log(this.courses);
        for (let course of courses) {
          this.addEvent(course);
        }
        this.refresh.next();

        console.log(this.events);

      },
      error: error => {
        console.log(error);
      }
    }
    )
  }


  addCourse(course: Course) {
    this.courses.push(course);
    this.addEvent(course);
    // this.refresh.next();
  }
    

  addEvent(course: Course): void {

    this.events.push({
      id: course.id,
      title: course.initial_ressource,
      start: new Date(course.start_time),
      end: new Date(course.end_time),
      color: {
        primary: "#1e90ff",
        secondary: "#D1E8FF",
      },        
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      }
    });
  }


  removeCourse(course_remove: Course): void {
    this.courses = this.courses.filter((course) => course.id !== course_remove.id);
    this.events = this.events.filter((event) => event.id !== course_remove.id);
    // this.refresh.next();
  }

  



  eventClicked(event: any) {
    this.eventSelectionne = event;
    // this.maxStartTime = new Date(this.eventSelectionne.event.start - 15 * 60 * 1000).toISOString().slice(0, 16);
    // this.minEndTime = new Date(this.eventSelectionne.event.end + 15 * 60 * 1000).toISOString().slice(0, 16);
    // console.log(this.maxStartTime);
    // console.log(this.minEndTime);
  
    Promise.all([this.loadEventStart(this.eventSelectionne), this.loadEventEnd(this.eventSelectionne)])
      .then(([loadedEventStart, loadedEventEnd]) => {
        this.updateDateStart(loadedEventStart);
        this.updateDateEnd(loadedEventEnd);
        this.openModalMod(this.eventSelectionne.event.id);
      });
  }
  
  loadEventStart(event: any): Promise<Date> {
    return new Promise<Date>((resolve, reject) => {
      setTimeout(() => {
        const loadedEventStart = event.event.start;
        resolve(loadedEventStart);
      }, 100);
    });
  }
  
  loadEventEnd(event: any): Promise<Date> {
    return new Promise<Date>((resolve, reject) => {
      setTimeout(() => {
        const loadedEventEnd = event.event.end;
        resolve(loadedEventEnd);
      }, 100);
    });
  }

  onSubmitMod(){
    this.closeModalMod();
  }


  eventTimesChanged(event: any) {
    console.log("here")
    let course_find = this.courses.find(course => course.id == event.event.id);
    if (!course_find){
      return;
    }
    

    course_find.start_time = event.newStart;
    course_find.end_time = event.newEnd;

    const event_backup = this.events.find(event => event.id == course_find!.id);

    this.events = this.events.filter((event) => event.id !== course_find!.id);
    this.addEvent(course_find);

    this.courseService.updateCourse(course_find).subscribe({
      next: course => {
        this.courses.filter((course) => course.id !== course_find!.id);
        this.events = this.events.filter((event) => event.id !== course_find!.id);
        this.addCourse(course);

      },
      error: response => {
        console.log(response);
        this.events = this.events.filter((event) => event.id !== course_find!.id);
        this.events.push(event_backup!);
        this.toastr.error(response.error.error, 'Erreur',{timeOut: 2000});
      }
    })



  }

  endTimeChanged(newEvent: any, ancienneDate: string) {
    newEvent.event.end = Date.parse(ancienneDate);
    this.refresh.next();
    this.updateDateEnd(newEvent.event.end);
  }

  startTimeChanged(newEvent: any, ancienneDate: string) {
    newEvent.event.start = Date.parse(ancienneDate);
    this.refresh.next();
    this.updateDateStart(newEvent.event.start);
  }

  updateDateStart(date: Date) {
    this.eventSelectionne.event.start = this.datePipe.transform(date, 'yyyy-MM-ddTHH:mm');
  }

  updateDateEnd(date: Date) {
    this.eventSelectionne.event.end = this.datePipe.transform(date, 'yyyy-MM-ddTHH:mm');
  }

  supprimerCours(event: any){
    this.events.splice(this.getIndex(event), 1);
    this.refresh.next();
    this.closeModalMod();
    // console.log(this.events);
  }

  getCourseByEventId(eventId: number) {

    return this.courses.find(course => course.id == eventId);
  }

  getRessourcesByInitial(initial_resource: string) {
    return this.ressources.find(resource => resource.initial == initial_resource)?.name;
  }

  getTimeString(date: Date) {
    return this.datePipe.transform(date, 'HH:mm');
  }




  getInitialTeacher(id: number) {
    let id_teacher =  this.courses.find(course => course.id == id)?.id_enseignant;
    let teacher = this.teachers.find(teacher => teacher.id == id_teacher);
    return teacher? teacher.staff.initial : "";
  }

  

  publishCourse(){
    this.courseService.publishCourses().subscribe({
      next:() => {
        this.toastr.success('Les cours ont été publiés', 'Succès',{timeOut: 1500,});
        this.loadEvents()
      },
      error: error => {
        this.toastr.error(error, 'Erreur',{timeOut: 2000});
      }
    })
  }
  cancelCourse(){
    this.courseService.cancelCourses().subscribe({
      next:() => {
        this.toastr.success('Les cours ont été annulés', 'Succès',{timeOut: 1500});
        this.loadEvents()
      },
      error: error => {
        this.toastr.error(error, 'Erreur',{timeOut: 2000});
      }
    })
  }

}