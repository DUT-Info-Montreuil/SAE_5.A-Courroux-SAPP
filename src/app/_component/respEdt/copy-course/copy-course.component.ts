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


    weekdays: { name: string, selected: boolean, date: Date }[] = [
        { name: 'Lundi', selected: false, date: new Date() },
        { name: 'Mardi', selected: false, date: new Date() },
        { name: 'Mercredi', selected: false, date: new Date() },
        { name: 'Jeudi', selected: false, date: new Date() },
        { name: 'Vendredi', selected: false, date: new Date() }
    ];;

    sat = new Date();
    sun = new Date();

    selectedStartDateToAttempt: Date = new Date();

    constructor(
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private courseService: CourseService) {
            this.setWeekDays();

    }

    ngOnInit(): void {

    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['displayedDates']) {
            const newDisplayedDates = changes['displayedDates'].currentValue;
            this.setWeekDays();
        }
    }

    closeModalCopy() {
      this.showModal=false;
      this.closeModal.emit();
    }

    closeModalPaste() {
      for(let c of this.weekdays) {
        console.log(c.name, c.date);
      }
      this.showModalPaste=false;
      this.closeModalP.emit();
    }

    onSubmitCopy() {
        // console.log("Submit");
        // console.log(this.selectedDays);
        console.log("SelectInterval");
        // this.selectCoursesInInterval();
        console.log(this.courses);
        this.closeModalCopy();

        this.weekdays.forEach((weekday) => weekday.selected=false);
        console.log("SelectedDays", this.selectedDays);

        let copiedSelectedDays = JSON.parse(JSON.stringify(this.selectedDays));

        this.selectedDaysOutput.emit(copiedSelectedDays);
        this.loadEvents.emit();

        this.toastr.success('Les cours ont été copiés', 'Succès',{timeOut: 1500});

    }

    onSubmitPaste() {
      if(this.selectedDays.length===0) {
        this.toastr.error("Veuillez sélectionner au moins un jour");
        return;
      } else {
        this.paste();
        console.log(this.courses);
        this.closeModalPaste();
      }  
  }

  updateSelection(day: { name: string, selected: boolean, date: Date }) {
    if (this.selectedDays.length > 2) {
      this.selectedDays.splice(0, 2);

      this.weekdays.forEach((weekday) => {
          if (weekday.selected) {
              weekday.selected = false;
          }
      });

    }

    day.selected = !day.selected; // Inverse l'état de sélection du jour

    // Trouve une entrée existante avec le même nom
    const existingEntryIndex = this.selectedDays.findIndex(existingDay => existingDay.name === day.name);

    if (day.selected) {
        if (existingEntryIndex !== -1) {
            // Si une entrée avec le même nom existe déjà, la supprime
            this.selectedDays.splice(existingEntryIndex, 1);
        }
        // Ajoute le jour sélectionné
        this.selectedDays.push(day);
    } else {
        if (existingEntryIndex !== -1) {
            // Retire le jour désélectionné
            this.selectedDays.splice(existingEntryIndex, 1);
        }
    }
    console.log('Jours sélectionnés : ', this.selectedDays);
  }


    setWeekDays() {
        for (let i = 0; i < this.weekdays.length; i++) {
          this.weekdays[i].date = this.displayedDates[i];
        }

        this.sat = this.displayedDates[5];
        this.sun = this.displayedDates[6];
        // console.log("displayed dates", this.displayedDates);
        // console.log("Saturday", this.sat);
        // console.log("Sunday", this.sun);
    }
    
    paste() {
      console.log("selectedDays paste", this.selectedDays);
      let sAndHdays = this.findSmallestAndHighestDate();

      let dateAttempt = this.formatDate(this.selectedStartDateToAttempt);
      let SatFormatted = this.formatDate(this.sat);
      let SunFormatted = this.formatDate(this.sun);

      this.courseService.pasteCourse(sAndHdays[0], sAndHdays[1], this.promotion.id, dateAttempt, SatFormatted, SunFormatted).subscribe({
        next: response => {
          console.log("paste");
          console.log(response);
          this.refresh.emit();
        },
        error: error => {
          console.log(error);
        }
    })
    }

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
  
      console.log(smallestDate, highestDate);
      let sDate = this.formatDate(smallestDate);
      let hDate = this.formatDate(highestDate);

      console.log(sDate, hDate);
      return [String(sDate), String(hDate)];
    }

    selectWeekday(weekday: any): void {
      this.weekdays.forEach(day => {
        if (day !== weekday) {
          day.selected = false;
        }
      });
      weekday.selected = !weekday.selected;

      this.selectedStartDateToAttempt = weekday.date;
    }

    formatDate(date: any): string {
      date = new Date(date); // Convertit date en Date si ce n'est pas déjà le cas
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2); // Adding leading zero if needed
      const day = ('0' + date.getDate()).slice(-2); // Adding leading zero if needed
  
      return `${year}-${month}-${day}`;
    }
}