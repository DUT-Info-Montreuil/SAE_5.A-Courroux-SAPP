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



@Component({
  selector: 'copy-course',
  templateUrl: './copy-course.component.html',
  styleUrls: ['./copy-course.component.scss']
})

export class CopyCourseComponent{

    @Input() courses: Course[];
    @Input() displayedDates: Date[] = [];
  
    @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

    weekdays: { name: string, selected: boolean, date: Date }[] = [
        { name: 'Lundi', selected: false, date: new Date() },
        { name: 'Mardi', selected: false, date: new Date() },
        { name: 'Mercredi', selected: false, date: new Date() },
        { name: 'Jeudi', selected: false, date: new Date() },
        { name: 'Vendredi', selected: false, date: new Date() }
    ];;

    selectedDays: { name: string, selected: boolean, date: Date }[] = [];


    constructor(
        private formBuilder: FormBuilder,
        private toastr: ToastrService) {
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
        this.closeModal.emit();
    }

    onSubmit() {
        console.log("Submit");
        console.log(this.selectedDays);
        this.closeModalCopy();
    }

    updateSelection(day: { name: string, selected: boolean, date: Date }) {
        day.selected = !day.selected; // Inverse l'état de sélection du jour
        if (day.selected) {
          this.selectedDays.push(day); // Ajoute le jour sélectionné
        } else {
          const index = this.selectedDays.indexOf(day);
          if (index !== -1) {
            this.selectedDays.splice(index, 1); // Retire le jour désélectionné
          }
        }
        console.log('Jours sélectionnés : ', this.selectedDays);
    }
    setWeekDays() {
        // console.log(this.weekdays);
        // console.log(this.displayedDates);   
      
        for (let i = 0; i < this.weekdays.length; i++) {
          this.weekdays[i].date = this.displayedDates[i];
        }
        console.log(this.displayedDates);
    }  
      
}