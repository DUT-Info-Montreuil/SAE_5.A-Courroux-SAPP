import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { CalendarEvent, CalendarView, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/moment';
import * as moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { EdtService } from '../services/edt.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HttpHeaders } from '@angular/common/http';

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
    groupe: new FormControl(""),
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
    couleur: new FormGroup({
      couleurP: new FormControl(""),
      couleurS: new FormControl(""),
    }),
    debut: new FormControl(""),
    fin: new FormControl("")
  })
  
  profs!: any[];
  salles!: any[];
  ressources!: any[];
  groupes!: any[];

  // minEndTime!: string;
  // maxStartTime!: string;

  public eventSelectionne: any = null;

  showModalMod = false;
  showModalAdd = false;

  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Week;

  events: CalendarEvent[] = [];

  refresh = new Subject<void>();

  getIndex(event: any){
    return this.events.indexOf(event.event);
  }

  constructor(
    private datePipe: DatePipe,
    private edtService: EdtService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone) {
      this.loadEvents();
      this.profs = this.edtService.getProfs();
      this.ressources = this.edtService.getRessources();
      this.salles = this.edtService.getSalles();
      this.groupes = this.edtService.getPromotions();
  }

  openModalMod() {
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
    let cours = this.edtService.getCours();

    for (var val of cours) {
      this.events.push(val);
    }
  }

  addEvent() {
    const debutString = this.formAddEvent.value.debut;
    const finString = this.formAddEvent.value.fin;

    if (typeof debutString === 'string' && typeof finString === 'string') {
      const debutDate = new Date(debutString);
      const finDate = new Date(finString);

      const newEvent = {
        title: this.formAddEvent.value.cours!,
        salle: this.formAddEvent.value.salle!,
        professeur: this.formAddEvent.value.professeur!,
        groupe: this.formAddEvent.value.groupe!,
        color: {
          primary: this.formAddEvent.value.couleur?.couleurP!,
          secondary: this.formAddEvent.value.couleur?.couleurS!,
        },
        start: debutDate,
        end: finDate,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        }
      };
      this.events.push(newEvent);
      this.refresh.next();
    } else {
      console.error("valeur de debut ou de fin n'est pas une chaine valide")
    }
  }

  addCoursToDb() {
    for (let cour of this.events) {
      this.edtService.addCours(cour.title, cour.salle, cour.professeur, cour.groupe, cour.color!.primary, cour.color!.secondary, cour.start, cour.end!, headers);
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
        this.openModalMod();
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
}
