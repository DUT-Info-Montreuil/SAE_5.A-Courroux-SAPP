import { ChangeDetectorRef, Component, EventEmitter, Input, NgZone, OnInit, Output, SimpleChanges } from '@angular/core';
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
import { Promotion } from 'src/app/_model/entity/promotion.model';



@Component({
  selector: 'copy-course',
  templateUrl: './copy-course.component.html',
  styleUrls: ['./copy-course.component.scss']
})

export class CopyCourseComponent{

    @Input() courses: Course[];
    @Input() displayedDates: Date[] = [];
    @Input() showModal: boolean = false;
    @Input() showModalPaste: boolean = false;
    @Input() promotion: Promotion;
    @Input() selectedDays: any[];
  
    @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
    @Output() closeModalP: EventEmitter<void> = new EventEmitter<void>();
    @Output() selectedDaysOutput: EventEmitter<any[]> = new EventEmitter<any[]>();
    @Output() refresh: EventEmitter<void> = new EventEmitter<void>();
    @Output() setPaste: EventEmitter<boolean> = new EventEmitter<boolean>();



    weekdays: { name: string, selected: boolean, date: Date }[] = [
        { name: 'Lundi', selected: false, date: new Date() },
        { name: 'Mardi', selected: false, date: new Date() },
        { name: 'Mercredi', selected: false, date: new Date() },
        { name: 'Jeudi', selected: false, date: new Date() },
        { name: 'Vendredi', selected: false, date: new Date() }
    ];;

    sat = new Date();
    sun = new Date();

    selectedStartDateToAttempt: Date | null;

    constructor(
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private courseService: CourseService) {
            this.setWeekDays();

    }

    /*
        @function ngOnInit
        @desc: on init
    */
    ngOnInit(): void {

    }

    /*
        @function ngOnChanges
        @param changes: SimpleChanges
        @desc: on changes displayedDates
    */
    ngOnChanges(changes: SimpleChanges) {
        if (changes['displayedDates']) {
            const newDisplayedDates = changes['displayedDates'].currentValue;
            this.setWeekDays();
        }
    }


    /*
      @function closeModalCopy
      @desc: close modal copy
    */
    closeModalCopy() {
      this.showModal=false;
      this.closeModal.emit();
    }

    /*
      @function closeModalPaste
      @desc: close modal paste and reset selected days
    */
    closeModalPaste() {
      this.showModalPaste=false;
      this.closeModalP.emit();

      this.weekdays.forEach((weekday) => {
        weekday.selected = false;
      });
    }


    /*
      @function onSubmitCopy
      @desc: on submit copy send selected days to parent
    */
    onSubmitCopy() {
        this.closeModalCopy();

        this.weekdays.forEach((weekday) => weekday.selected=false);

        let copiedSelectedDays = JSON.parse(JSON.stringify(this.selectedDays));

        this.selectedDaysOutput.emit(copiedSelectedDays);

        this.toastr.success('Les cours ont été copiés', 'Succès',{timeOut: 1500});
        this.setPaste.emit(true);

        

    }

    /*
      @function onSubmitPaste
      @desc: on submit paste send selected days to parent
    */
    onSubmitPaste() {
      if(this.selectedDays.length===0) {
        this.toastr.error("Veuillez sélectionner au moins un jour");
        return;
      } else {
        this.paste();
        this.closeModalPaste();
        this.selectedStartDateToAttempt = null
      }  
  }

  /*
    @function isOneDaySelected
    @return boolean
    @desc: check if one day is selected
  */
  oneDaySelected(): boolean {
    return this.weekdays.filter(day => day.selected).length >= 1;
  }
  
  /*
    @function updateSelection
    @param day: { name: string, selected: boolean, date: Date }
    @desc: update selection of days and add to selectedDays
  */
  updateSelection(day: { name: string, selected: boolean, date: Date }) {
    if (this.selectedDays.length >= 2) {
      this.selectedDays.splice(0, 2);

      this.weekdays.forEach((weekday) => {
          if (weekday.selected) {
              weekday.selected = false;
          }
      });

    }

    day.selected = !day.selected;

    const existingEntryIndex = this.selectedDays.findIndex(existingDay => existingDay.name === day.name);

    if (day.selected) {
        if (existingEntryIndex !== -1) {
            this.selectedDays.splice(existingEntryIndex, 1);
        }
        this.selectedDays.push(day);
    } else {
        if (existingEntryIndex !== -1) {
            this.selectedDays.splice(existingEntryIndex, 1);
        }
    }
  }

  /*
    @function isSelectedDay
    @param day: { name: string, selected: boolean, date: Date }
    @return boolean
    @desc: check if day is selected
  */
  isSelectedDay(day: { name: string, selected: boolean, date: Date }): boolean {
    if (this.selectedDays.length == 2) {
      return this.selectedDays[0].date >= day.date && this.selectedDays[1].date <= day.date 
          || this.selectedDays[0].date <= day.date && this.selectedDays[1].date >= day.date;
    }
    else if (this.selectedDays.length == 1) {
      return this.selectedDays[0].date === day.date;
    }
    return false
  }


    /*
        @function setWeekDays
        @desc: set weekdays with displayedDates
    */
    setWeekDays() {
        for (let i = 0; i < this.weekdays.length; i++) {
          this.weekdays[i].date = this.displayedDates[i];
        }
        this.sat = this.displayedDates[5];
        this.sun = this.displayedDates[6];
    }

    /*
        @function paste
        @desc: paste course with selected days
    */
    paste() {
      let sAndHdays = this.findSmallestAndHighestDate();
      
      let dateAttempt = this.formatDate(this.selectedStartDateToAttempt);
      let SatFormatted = this.formatDate(this.sat);
      let SunFormatted = this.formatDate(this.sun);

      this.courseService.pasteCourse(sAndHdays[0], sAndHdays[1], this.promotion.id, dateAttempt, SatFormatted, SunFormatted).subscribe({
        next: response => {
          this.toastr.success('Les cours ont été collés', 'Succès',{timeOut: 1500});
          this.refresh.emit();
        },
        error: error => {
          this.toastr.error(error.error.message);
        }
    })


    }

    /*
        @function findSmallestAndHighestDate
        @return string[]
        @desc: find smallest and highest date of selected days
    */
    findSmallestAndHighestDate() {
      
      let smallestDate: Date = this.selectedDays[0].date;
      let highestDate: Date = this.selectedDays[0].date;

      this.selectedDays.forEach(day => {
        if (smallestDate === null || day.date < smallestDate) {
          smallestDate = day.date;
        }
        if (highestDate === null || day.date > highestDate) {
          highestDate = day.date;
        }
      });

      if (this.selectedDays.length == 2){
        const diff = this.getDifferenceInDays(new Date(this.selectedDays[0].date), new Date(this.selectedDays[1].date));
        const date_end = this.addDays(this.selectedStartDateToAttempt!, diff);
        if (date_end.getDay() == 6 || date_end.getDay() < this.selectedStartDateToAttempt!.getDay()) {
          let friday: Date;
          if(date_end.getDay() == 6){
            friday = this.addDays(highestDate, -1);
          }
          else {
            const diff = date_end.getDay() + 2
            friday = this.addDays(highestDate, -diff);
          
          }
          highestDate = friday
        }

      }
  
      let sDate = this.formatDate(smallestDate);
      let hDate = this.formatDate(highestDate);

      return [String(sDate), String(hDate)];
    }

    /*
        @function addDays
        @param originalDate: Date
        @param daysToAdd: number
        @return Date
        @desc: add days to date and return new date
    */
    addDays(originalDate: Date, daysToAdd: number): Date {
      const newDate = new Date(originalDate);
      newDate.setDate(newDate.getDate() + daysToAdd);
    
      return newDate;
    }

    /*
        @function getDifferenceInDays
        @param date1: Date
        @param date2: Date
        @return number
        @desc: get difference in days between two dates
    */
    getDifferenceInDays(date1: Date, date2: Date): number {
      const timeDifference = new Date(this.selectedDays[0].date).getTime() - new Date(this.selectedDays[1].date).getTime();
      const daysDifference = Math.abs(timeDifference / (1000 * 3600 * 24));
      return Math.round(daysDifference);
    }

    /*
        @function isPasteDay
        @param weekday: { name: string, selected: boolean, date: Date }
        @return boolean
        @desc: check if weekday is paste day
    */
    isPasteDay(weekday: { name: string, selected: boolean, date: Date }): boolean{
      if (this.selectedStartDateToAttempt){
        if (this.selectedDays.length == 2) {
            const diff = this.getDifferenceInDays(new Date(this.selectedDays[0].date), new Date(this.selectedDays[1].date));
            const date_end = this.addDays(this.selectedStartDateToAttempt, diff);
            return weekday.date >= this.selectedStartDateToAttempt && weekday.date <= date_end ;
        }
        
        return new Date(weekday.date).getTime() === new Date(this.selectedStartDateToAttempt).getTime()
      }
      return false
    }

    /*
        @function selectWeekday
        @param weekday: { name: string, selected: boolean, date: Date }
        @desc: select weekday and set selectedStartDateToAttempt
    */
    selectWeekday(weekday: { name: string, selected: boolean, date: Date }): void {
      this.weekdays.forEach(day => {
        if (day !== weekday) {
          day.selected = false;
        }
      });
      weekday.selected = !weekday.selected;

      this.selectedStartDateToAttempt = weekday.date;
    }

    /*
        @function formatDate
        @param date: any
        @return string
        @desc: format date to string yyyy-MM-dd
    */
    formatDate(date: any): string {
      date = new Date(date); 
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2); // Adding leading zero if needed
      const day = ('0' + date.getDate()).slice(-2); // Adding leading zero if needed
  
      return `${year}-${month}-${day}`;
    }
}