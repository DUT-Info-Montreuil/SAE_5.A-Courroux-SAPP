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
    private edtService: EdtService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    private teacherService: TeacherService,
    private courseService: CourseService,
    private resourceService: ResourceService,
    private groupService: GroupService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService) {

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
      this.edtService.getSalles().subscribe({
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
    this.courseForEdit = this.findCoursebyEventId(eventId);

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
    this.events = [];

    let day = this.viewDate.getDay();
    let diff = this.viewDate.getDate() - day + (day == 0 ? -6:1);
    let monday = new Date(this.viewDate.setDate(diff));
    let friday = new Date(this.viewDate.setDate(diff + 4));

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
    console.log(this.events);
  }

  replaceEvent(course: Course): void {

    this.courses = this.courses.filter((course) => course.id !== course.id);
    this.courses.push(course);
    
    this.events = this.events.filter((event) => event.id !== course.id);
    this.addEvent(course);
    this.refresh.next();

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
    let course = this.courses.find(course => course.id == event.event.id);
    if (!course){
      return;
    }
    
    course.start_time = event.newStart;
    course.end_time = event.newEnd;
    this.courseService.updateCourse(course).subscribe({
      next: course => {
        this.replaceEvent(course);
      },
      error: response => {
        console.log(response);
        this.toastr.error(response.error.error, 'Erreur');
      }
    })




    event.event.start = event.newStart;
    event.event.end = event.newEnd;
    console.log(event.event)
    // this.loadEvents();
    this.refresh.next();
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
    // for (const course of this.courses) {
    //   if (course.id == eventId) {
    //     console.log(course);
    //     return course;
    //   }
    // }

    
    return this.courses.find(course => course.id == eventId);
  }

  getNomProfesseurById(id_enseignant: number) {
    
    console.log("Debut recherche professeur");
    console.log(id_enseignant);
    for (const professeur of this.teachers) {
      if (professeur.id === id_enseignant) {
        console.log("Fin recherche professeur");
        console.log(professeur.id);
        return professeur.staff.user.username;
      }
    }
    
    return null;
  }

  getNomGroupeById(id_group: number) {
    for (const groupe of this.groupes) {
      if (groupe.id === id_group) {
        return groupe.name;
      }
    }
    
    return null;
  }

  findCoursebyEventId(id: number) {
    let c: Course 
    for(let course of this.courses) {
      if(course.id == id) {
        c = course;
      }
    }

    return c!;
  }

  getEventId(event: any): number {
    // console.log(event.id);

    if (typeof event.id === 'number') {
      return event.id;
    }
    
    return event.id;
  }
  
  getNomRessourceByInitial(initial: string) {
    for (const ressource of this.ressources) {
      if (ressource.initial === initial) {
        return ressource.name;
      }
    }
    
    return null;
  }

  getTimeOfEvent(event: any) {
    let c = this.getCourseByEventId(event.id);

    if (c !== null) {
      return [c!.start_time, c!.end_time];
    }

    return "nope";
  }

}