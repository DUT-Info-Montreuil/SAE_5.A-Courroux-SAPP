import { ChangeDetectorRef, Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Teacher } from '../../../_model/entity/teacher.model';
import { Course } from '../../../_model/entity/course.model';
import { Resource } from '../../../_model/entity/resource.model';
import { Group } from '../../../_model/entity/group.model';

import { Room } from 'src/app/_model/entity/room.model';
import { CourseService } from 'src/app/_service/course.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'course-edit',
  templateUrl: './course-edit.component.html',
  styleUrls: ['./course-edit.component.scss']
})

export class CourseEditComponent implements OnInit{

    courseForm: FormGroup;
    @Input() teachers: Teacher[];
    @Input() salles: Room[];
    @Input() groupes: Group[];
    @Input() resources: Resource[];

    @Input() course: Course;

    @Output() courseEvent: EventEmitter<Course> = new EventEmitter<Course>();
    @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
    @Output() removeEvent: EventEmitter<Course> = new EventEmitter<Course>();





    constructor(private formBuilder: FormBuilder,
                private courseService: CourseService,
                private toastr: ToastrService) {}


    ngOnInit() {

        
        this.initializeForm();
    }

    initializeForm() {
        let start_time = new Date(this.course.start_time);
        let end_time = new Date(this.course.end_time);

        const date = start_time.toISOString().split('T')[0]

        const start = start_time.toTimeString().split(' ')[0];

        const end = end_time.toTimeString().split(' ')[0];
   


        this.courseForm = this.formBuilder.group({
            id_enseignant: [this.course.id_enseignant?this.course.id_enseignant:"", [
                // this.validateSelect
            ]],
            initial_ressource: [this.course.initial_ressource, [
                Validators.required,
                this.validateSelect
            ]],
            id_group: [this.course.id_group, [
                Validators.required,
                this.validateSelect
            ]],
            name_salle: [this.course.name_salle?this.course.name_salle:"", [
                // this.validateSelect
            ]],
            date: [date, [Validators.required]],
            start: [start, [Validators.required]],
            end: [end, [Validators.required]],  
        });
    }

    validateSelect(control: AbstractControl, object: any[]): { [key: string]: boolean } | null {
        const selectedValue = control.value;

        if (!selectedValue) {
          return { 'required': true };
        }
        return null;
      }


    createDateObject(dateString: string, timeString: string): Date {
        const [year, month, day] = dateString.split('-').map(Number);
      
        const [hours, minutes] = timeString.split(':').map(Number);
      
        const dateObject = new Date(year, month - 1, day, hours, minutes);
      
        return dateObject;
      }

      onSubmit(){

        console.log("courseForm", this.courseForm.value)
        if (this.courseForm.invalid) {
            return;
        }
        const course_edit: Course = Object.assign(this.course, this.courseForm.value);

        
        course_edit.start_time = this.createDateObject(this.courseForm.value.date, this.courseForm.value.start);
        course_edit.end_time = this.createDateObject(this.courseForm.value.date, this.courseForm.value.end);

        this.courseService.updateCourse(course_edit).subscribe({
            next: course => {
                this.removeEvent.emit(course_edit);
                this.courseEvent.emit(course);
                this.closeModalEdit()
                this.toastr.success('Le cours a été modifié', 'Cours modifié',{timeOut: 1500});
                // this.courseService.addCourseList(course);
                // this.initializeForm();
            },
            error: error => {
                console.log(error)
                this.toastr.error(error, 'Erreur',{timeOut: 2000});

            }
        })

      }
      closeModalEdit() {
        console.log("close modal");
        this.closeModal.emit();
      }

  

}