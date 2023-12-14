import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { CalendarEvent, CalendarView, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/moment';
import * as moment from 'moment';
import { Observable, Subject, find } from 'rxjs';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { EdtService } from '../services/edt.service';
import { HttpHeaders } from '@angular/common/http';
import { TeacherService } from '../_service/teacher.service';
import { Teacher } from '../_model/entity/teacher.model';
import { CourseService } from '../_service/course.service';
import { Course } from '../_model/entity/course.model';
import { ResourceService } from '../_service/resource.service';
import { Resource } from '../_model/entity/resource.model';
import { Group } from '../_model/entity/group.model';
import { GroupService } from '../_service/group.service';

export function momentAdapterFactory() {
  return adapterFactory(moment);
};

const headers = new HttpHeaders({
  'Content-Type': 'application/json'
});

@Component({
  selector: 'app-edt',
  templateUrl: './edt.component.html',
  styleUrls: ['./edt.component.scss']
})

export class EdtComponent{

  formAddEvent = new FormGroup({
    cours: new FormControl(""),
    salle: new FormControl(""),
    professeur: new FormControl(""),
    groupe: new FormControl(),
    couleur: new FormGroup({
      couleurP: new FormControl(""),
      couleurS: new FormControl(""),
    }),
    debut: new FormControl(""),
    fin: new FormControl("")
  })

  formModifEvent = new FormGroup({
    cours: new FormControl(""),
    salle: new FormControl(""),
    professeur: new FormControl(""),
    groupe: new FormControl(""),
    debut: new FormControl(""),
    fin: new FormControl("")
  })
  
  courses: Course[] = [];
  profs: Teacher[] = [];
  salles: any[] = [];
  ressources: Resource[] = [];
  groupes: Group[] = [];

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
    private formBuilder: FormBuilder) {
      this.loadEvents();

      console.log("Profs : ")
      this.teacherService.getTeachers().subscribe(
        (data: Teacher[]) => {
          for(let teacher of data) {
            this.profs.push(teacher);
          }
        },
        (error) => {
          console.log(error);
        }
      );
      console.log(this.profs); 

      console.log("Salles : ")
      this.edtService.getSalles().subscribe(
        (data: any[]) => {
          for (let salle of data) {
            this.salles.push(salle);
          }
        },
        (error) => {
          console.log(error);
        }
      );
      console.log(this.salles);

      console.log("Ressources : ");
      this.resourceService.getResources().subscribe(
        (data: Resource[]) => {
          for(let resource of data) {
            this.ressources.push(resource);
          }
        },
        (error) => {
          console.log(error);
        }
      )
      console.log(this.ressources);

      console.log("Groupes : ");
      this.groupService.getGroups().subscribe(
        (data: Group[]) => {
          for(let group of data) {
            this.groupes.push(group);
          }
        },
        (error) => {
          console.log(error);
        }
      )
      console.log(this.groupes);

  }

  openModalMod(eventId: number) {
    // console.log(this.eventSelectionne.event);
    // this.onCourseSelect(eventId);

    this.showModalMod = true;
    this.initializeForm(eventId);
  }

  onCourseSelect(selectedCourseId: number) {
    const selectedCourse = this.courses.find(course => course.id === selectedCourseId);
    
    if (selectedCourse) {
        // Update form controls based on selected course
        this.formModifEvent.patchValue({
            debut: this.datePipe.transform(selectedCourse.start_time, 'yyyy-MM-ddTHH:mm'),
            fin: this.datePipe.transform(selectedCourse.end_time, 'yyyy-MM-ddTHH:mm')
        });
    }

                // Example for updating 'salle' based on selected course data
      const selectedSalle = this.salles.find(salle => salle.name === selectedCourse!.name_salle);
      if (selectedSalle) {
          this.formModifEvent.get('salle')?.patchValue(selectedSalle.nom);
      }
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

    this.courseService.getCourses().subscribe(
      (courses: Course[]) => {
        this.courses = courses;
        this.coursesToEvents();

        console.log("Cours : ");
        console.log(this.courses);
      },
      (error) => {
        console.log(error);
      }
    )
    
  }

  coursesToEvents() {
    for (let course of this.courses) {
      const newEvent: CalendarEvent = {
        id: course.id,
        title: course.initial_resource,
        start: new Date(course.start_time),
        end: new Date(course.end_time),
        color: {
          primary: this.formAddEvent.value.couleur?.couleurP!,
          secondary: this.formAddEvent.value.couleur?.couleurS!,
        },        
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        }
      }

      this.events.push(newEvent);
      this.refresh.next();
    }
  }

  addEvent() {
    let debutString = this.formAddEvent.value.debut;
    let finString = this.formAddEvent.value.fin;

    debutString = (debutString?.replace('T', ' ')) + ":00";
    finString = (finString?.replace('T', ' ')) + ":00";
    

    console.log(debutString);
    console.log(finString);
    if (typeof debutString === 'string' && typeof finString === 'string') {
      const debutDate = new Date(debutString);
      const finDate = new Date(finString);

      // const newEvent: Course = {
      //   id: this.events.length+1,
      //   title: this.formAddEvent.value.cours!,
      //   salle: this.formAddEvent.value.salle!,
      //   professeur: this.formAddEvent.value.professeur!,
      //   groupe: this.formAddEvent.value.groupe!,
      //   is_published: false,
      //   color: {
      //     primary: this.formAddEvent.value.couleur?.couleurP!,
      //     secondary: this.formAddEvent.value.couleur?.couleurS!,
      //   },
      //   start: debutDate,
      //   end: finDate,
      //   draggable: true,
      //   resizable: {
      //     beforeStart: true,
      //     afterEnd: true,
      //   }
      // };
      
      this.edtService.addCours(this.formAddEvent.value.cours!, this.formAddEvent.value.salle!, this.formAddEvent.value.professeur!, Number(this.formAddEvent.value.groupe!), debutString, finString, headers);     
      this.loadEvents();
    } else {
      console.error("valeur de debut ou de fin n'est pas une chaine valide")
    }
  }


  print(){
    console.log(this.events);
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

  onSubmitAdd(){
    this.closeModalAdd();
    this.addEvent();
  }

  eventTimesChanged(event: any) {
    event.event.start = event.newStart;
    event.event.end = event.newEnd;
    this.refresh.next();
  }

  endTimeChanged(newEvent: any, ancienneDate: string) {
    newEvent.event.end = Date.parse(ancienneDate);
    this.refresh.next();
    this.updateDateEnd(newEvent.event.end);
    this.print();
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
    console.log(this.events);
  }

  getCourseByEventId(eventId: number) {
    for (const course of this.courses) {
      if (course.id === eventId) {
        return course;
      }
    }

    return null;
  }

  getNomProfesseurById(id_enseignant: number) {
    for (const professeur of this.profs) {
      if (professeur.id === id_enseignant) {
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

  initializeForm(eventId: number): void {
    let courSelected = this.getCourseByEventId(eventId);
  
    if (courSelected !== null) {
      this.formModifEvent.setControl('cours', new FormControl(courSelected.initial_resource, [
        Validators.required,
        Validators.maxLength(15)
      ]));
  
      this.formModifEvent.setControl('salle', new FormControl(courSelected.name_salle || "", [
        Validators.required,
        Validators.maxLength(63)
      ]));
  
      this.formModifEvent.setControl('professeur', new FormControl(this.getNomProfesseurById(courSelected.id_enseignant!) || "", [
        Validators.maxLength(63)
      ]));
  
      this.formModifEvent.setControl('groupe', new FormControl(this.getNomGroupeById(courSelected.id_group) || "", [
        Validators.required,
        Validators.maxLength(63)
      ]));
  
      this.formModifEvent.setControl('debut', new FormControl(courSelected.start_time ? courSelected.start_time.toISOString() : "", [
        Validators.required,
        // Ajoutez ici le validateur de format de date si nécessaire
      ]));
      
      this.formModifEvent.setControl('fin', new FormControl(courSelected.end_time ? courSelected.end_time.toISOString() : "", [
        Validators.required,
        // Ajoutez ici le validateur de format de date si nécessaire
      ]));
      
    }
  }
  
  getEventId(event: any): number {
    if (typeof event.id === 'number') {
      return event.id;
    }
    // Handle other cases like string or undefined
    // For example:
    // if (typeof event.id === 'string') {
    //   return parseInt(event.id, 10);
    // }
    return 0;
  }
  
}
