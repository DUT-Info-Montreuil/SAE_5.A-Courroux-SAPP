import { Component } from '@angular/core';
import { CalendarEvent, CalendarView, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/moment';
import * as moment from 'moment';
import { Subject } from 'rxjs';

export function momentAdapterFactory() {
  return adapterFactory(moment);
};

@Component({
  selector: 'app-edt',
  templateUrl: './edt.component.html',
  styleUrls: ['./edt.component.scss']
})
export class EdtComponent {
  viewDate: Date = new Date();
  view: CalendarView = CalendarView.Week;

  events: CalendarEvent[] = [];

  refresh = new Subject<void>()

  constructor() {
    const event1 = {
      title: "Prog avancée",
      start: new Date("2023-10-12T10:30"),
      end: new Date("2023-10-12T12:30"),
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      }
    }
    this.events.push(event1);
  }

  eventClicked(event: any){
    console.log(event);
  }

  eventTimesChanged(event: any) {
    event.event.start = event.newStart;
    event.event.end = event.newEnd;
    this.refresh.next();
  }
}
