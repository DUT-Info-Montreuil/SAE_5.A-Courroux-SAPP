import { Component } from '@angular/core';
import { CalendarEvent, CalendarView, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/moment';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { FormControl, FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { EventColor } from 'calendar-utils';

export function momentAdapterFactory() {
  return adapterFactory(moment);
};

@Component({
  selector: 'app-edt',
  templateUrl: './edt.component.html',
  styleUrls: ['./edt.component.scss']
})

export class EdtComponent {
  

  public eventSelectionne: any = null;

  showModal = false;

  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Week;

  events: CalendarEvent[] = [];

  refresh = new Subject<void>()

  getIndex(event: any){
    return this.events.indexOf(event.event);
  }

  constructor(private datePipe: DatePipe) {
    this.loadEvents();
  }

  openModal() {
    this.showModal = true;
  }
  
  closeModal() {
    this.showModal = false;
  }  

  loadEvents(){
    const event1 = {
      title: "Prog avancée",
      salle: "A1-01",
      professeur: "abossard",
      color: {
        primary: '#ad2121',
        secondary: '#FAE3E3',
      },
      start: new Date("2023-10-23T10:30"),
      end: new Date("2023-10-23T12:30"),
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      }
    }
    this.events.push(event1);
  }

  addEvent() {
    let start = new Date();
    start.setHours(8);
    start.setMinutes(0);
    start.setSeconds(0);
    const newEvent = {
      title: "nom du cours",
      salle: "salle",
      professeur: "professeur",
      start: start,
      color: {
        primary: '#ad2121',
        secondary: '#FAE3E3',
      },
      end: new Date(start.getTime() + 2 * 60 * 60 * 1000),
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      }
    };

    this.events.push(newEvent);
    this.refresh.next();
  }

  eventClicked(event: any) {
    this.eventSelectionne = event;
  
    Promise.all([this.loadEventStart(this.eventSelectionne), this.loadEventEnd(this.eventSelectionne)])
      .then(([loadedEventStart, loadedEventEnd]) => {
        this.updateDateStart(loadedEventStart);
        this.updateDateEnd(loadedEventEnd);
        this.openModal();
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

  onSubmit(){
    this.closeModal();
  }

  eventTimesChanged(event: any) {
    if (event.event.start != event.newStart) {
      event.event.start = event.newStart;
    }
    if (event.event.end != event.newEnd) {
      event.event.end = event.newEnd;
    }
    this.refresh.next();
  }

  startTimeChanged(newEvent: any, ancienneDate: string) {
    newEvent.event.start = Date.parse(ancienneDate);
    this.refresh.next();
    this.updateDateStart(newEvent.event.start);
  }

  endTimeChanged(newEvent: any, ancienneDate: string) {
    newEvent.event.end = Date.parse(ancienneDate);
    this.refresh.next();
    this.updateDateEnd(newEvent.event.end);
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
    this.closeModal();
    console.log(this.events);
  }
}
