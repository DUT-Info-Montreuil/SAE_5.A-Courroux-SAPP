import { Component } from '@angular/core';
import { CalendarEvent, CalendarView, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/moment';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { FormControl } from '@angular/forms';

export function momentAdapterFactory() {
  return adapterFactory(moment);
};

@Component({
  selector: 'app-edt',
  templateUrl: './edt.component.html',
  styleUrls: ['./edt.component.scss']
})

export class EdtComponent {

  eventSelectionne: any = null;

  showModal = false;

  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Week;

  events: CalendarEvent[] = [];

  refresh = new Subject<void>()

  constructor() {
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
      start: new Date("2023-10-16T10:30"),
      end: new Date("2023-10-16T12:30"),
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
      end: new Date(start.getTime() + 2 * 60 * 60 * 1000),
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      }
    };

    this.events.push(newEvent);
    this.refresh.next();
    console.log(newEvent);
  }

  eventClicked(event: any){
    this.eventSelectionne = event;
    this.openModal();
    console.log(event);
  }

  buttonClicked(){
    //var cours = new Cours()
    //this.events.push(cours);
  }

  eventTimesChanged(event: any) {
    event.event.start = event.newStart;
    event.event.end = event.newEnd;
    this.refresh.next();
  }
}
