import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Teacher } from '../../../_model/entity/teacher.model';
import { Course } from '../../../_model/entity/course.model';
import { Resource } from '../../../_model/entity/resource.model';
import { Group } from '../../../_model/entity/group.model';
import { Room } from 'src/app/_model/entity/room.model';
import { CourseService } from 'src/app/_service/course.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'course-add',
  templateUrl: './course-add.component.html',
  styleUrls: ['./course-add.component.scss']
})

export class CourseAddComponent implements OnInit {
  courseForm: FormGroup;
  @Input() teachers: Teacher[];
  @Input() salles: Room[];
  @Input() groupes: Group[];
  @Input() resources: Resource[];

  @Output() courseEvent: EventEmitter<Course> = new EventEmitter<Course>();
  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private formBuilder: FormBuilder,
    private courseService: CourseService,
    private toastr: ToastrService
    ) {}

  ngOnInit() {
    this.courseForm = this.formBuilder.group({
      id_enseignant: ['', []],
      initial_ressource: ['', [Validators.required, this.validateSelect]],
      id_group: ['', [Validators.required, this.validateSelect]],
      name_salle: [''],
      evaluation: [false, [Validators.required]],
      date: ['', [Validators.required]],
      start: ['', [Validators.required]],
      end: ['', [Validators.required]],  
    });
  }

  toggleEvaluation() {
    this.courseForm.patchValue({
      evaluation: !this.courseForm.value.evaluation
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

  onSubmit() {
    if (this.courseForm.invalid) {
      return;
    }

    const course: Course = this.courseForm.value;
    course.start_time = this.createDateObject(this.courseForm.value.date, this.courseForm.value.start);
    course.end_time = this.createDateObject(this.courseForm.value.date, this.courseForm.value.end);

    this.courseService.addCourse(course).subscribe({
      next: course => {
        this.courseEvent.emit(course);
        this.closeModalAdd();
        this.toastr.success('Cours ajouté', 'Succès',{timeOut: 1500});
      },
      error: response => {
        console.log(response);
        this.toastr.error(response.error.error , 'Erreur',{timeOut: 2000});
      }
    });
  }

  closeModalAdd() {
    this.closeModal.emit();
  }
}