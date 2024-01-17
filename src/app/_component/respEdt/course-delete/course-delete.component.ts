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
  selector: 'course-delete',
  templateUrl: './course-delete.component.html',
  styleUrls: ['./course-delete.component.scss']
})

export class CourseDeleteComponent implements OnInit{


    @Input() course: Course;


    @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
    @Output() removeEvent: EventEmitter<Course> = new EventEmitter<Course>();







    constructor(
                private courseService: CourseService,
                private toastr: ToastrService) {}


      ngOnInit(): void {
          
      }

      deleteCourse(){
        this.courseService.deleteCourse(this.course).subscribe({
            next: course => {
                this.removeEvent.emit(course);
                this.closeModal.emit()
                this.toastr.success('Le cours a été supprimé', 'Cours supprimé',{timeOut: 1500});
            },
            error: response => {
                console.log(response)
                this.toastr.error(response.error.error, 'Erreur',{timeOut: 2000});
                console.log(this.course)

            }
        })
      }

      
}