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

      this.weekdays.forEach((weekday) => {
        weekday.selected = false;
      });
    }

    // refreshWeekDays() {
    //   this.weekdays.forEach((weekday) => weekday.selected=false);
    // }

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

        this.toastr.success('Les cours ont été copiés', 'Succès',{timeOut: 1500});
        this.setPaste.emit(true);

        

    }

    onSubmitPaste() {
      if(this.selectedDays.length===0) {
        this.toastr.error("Veuillez sélectionner au moins un jour");
        return;
      } else {
        this.paste();
        console.log(this.courses);
        this.closeModalPaste();
        this.selectedStartDateToAttempt = null
      }  
  }

  oneDaySelected(): boolean {
    return this.weekdays.filter(day => day.selected).length >= 1;
  }

  updateSelection(day: { name: string, selected: boolean, date: Date }) {
    console.log(this.selectedDays)
    if (this.selectedDays.length >= 2) {
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
          this.toastr.success('Les cours ont été collés', 'Succès',{timeOut: 1500});
          this.refresh.emit();
        },
        error: error => {
          this.toastr.error(error.error.message);
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
  
      console.log(smallestDate, highestDate);
      let sDate = this.formatDate(smallestDate);
      let hDate = this.formatDate(highestDate);

      console.log(sDate, hDate);
      return [String(sDate), String(hDate)];
    }

    addDays(originalDate: Date, daysToAdd: number): Date {
      // Créez une copie de la date originale pour éviter de modifier l'objet d'origine
      const newDate = new Date(originalDate);
    
      // Ajoutez le nombre de jours à la date
      newDate.setDate(newDate.getDate() + daysToAdd);
    
      return newDate;
    }

    getDifferenceInDays(date1: Date, date2: Date): number {
      const timeDifference = new Date(this.selectedDays[0].date).getTime() - new Date(this.selectedDays[1].date).getTime();
      // Convertissez la différence en jours
      const daysDifference = Math.abs(timeDifference / (1000 * 3600 * 24));
      return Math.round(daysDifference);
    }

    isPasteDay(weekday: { name: string, selected: boolean, date: Date }): boolean{
      // console.log(this.selectedDays[0].date).getTime())
      if (this.selectedStartDateToAttempt){
        if (this.selectedDays.length == 2) {
            const diff = this.getDifferenceInDays(new Date(this.selectedDays[0].date), new Date(this.selectedDays[1].date));
            const date_end = this.addDays(this.selectedStartDateToAttempt, diff);
            return weekday.date >= this.selectedStartDateToAttempt && weekday.date <= date_end ;

        }
        return weekday.date == this.selectedStartDateToAttempt;
      }
      return false
    }

    selectWeekday(weekday: { name: string, selected: boolean, date: Date }): void {
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