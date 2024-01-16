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

    @Input() courses: Course[];

    @Output() courseEvent: EventEmitter<Course> = new EventEmitter<Course>();
    @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
    @Output() removeEvent: EventEmitter<Course> = new EventEmitter<Course>();
    @Output() refresh: EventEmitter<void> = new EventEmitter<void>();

    showModalDuplicate: boolean;
    selectedGroups: number[] = [];

    groupe_available: Group[] = [];





    constructor(private formBuilder: FormBuilder,
                private courseService: CourseService,
                private toastr: ToastrService) {}


    ngOnInit() {

        
        this.initializeForm();
        console.log("Groupes", this.groupes);
        this.getGroupAvailableForDuplicate();
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
            evaluation: [this.course.evaluation,[Validators.required]],
            date: [date, [Validators.required]],
            start: [start, [Validators.required]],
            end: [end, [Validators.required]],  
        });
    }

    toggleEvaluation() {
      this.courseForm.patchValue({
          evaluation: !this.courseForm.value.evaluation
      })
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
        const course_edit: Course = new Course()
        Object.assign(course_edit, this.course);
        Object.assign(course_edit, this.courseForm.value);

        
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
            error: response => {
                console.log(response)
                this.toastr.error(response.error.error, 'Erreur',{timeOut: 2000});
                console.log(this.course)

            }
        })

      }
      closeModalEdit() {
        console.log("close modal");
        this.closeModal.emit();
      }

      deleteCourse(){
        this.courseService.deleteCourse(this.course).subscribe({
            next: course => {
                this.removeEvent.emit(course);
                this.closeModalEdit()
                this.toastr.success('Le cours a été supprimé', 'Cours supprimé',{timeOut: 1500});
            },
            error: response => {
                console.log(response)
                this.toastr.error(response.error.error, 'Erreur',{timeOut: 2000});
                console.log(this.course)

            }
        })
      }

      openModalDuplicate() {
        this.selectedGroups = [];
        this.showModalDuplicate = true;
        // console.log("Course viewed", this.course);
      }

      closeModalDuplicate() {
        this.showModalDuplicate = false;
        // console.log("Groups to duplicate", this.selectedGroups);
      }

      onSubmitDuplicate() {
        this.closeModalDuplicate();
        console.log("courseToDup", this.course);
        console.log("SelectedGroups", this.selectedGroups);
        this.courseService.duplicate(this.course.id, this.selectedGroups).subscribe({
          next: response => {
            this.toastr.success("Duplication reussie");
            this.refresh.emit();
            this.closeModal.emit();
          },
          error: error => {
            this.toastr.error(error.error.error, 'Erreur',{timeOut: 2000});
          }
        }
      );
      }

      groupsToDuplicateCourse(groupId: number) {
        const index = this.selectedGroups.indexOf(groupId);
        if (index === -1) {
            // Si le groupe n'est pas déjà dans la liste, l'ajouter
            this.selectedGroups.push(groupId);
        } else {
            // Si le groupe est déjà dans la liste, le retirer
            this.selectedGroups.splice(index, 1);
        }
    }

    getGroupAvailableForDuplicate() {
      const course_same_time = this.courses.filter(course => {
        return this.course.start_time >= course.start_time && this.course.start_time <= course.end_time 
              || this.course.end_time >= course.start_time && this.course.end_time <= course.end_time
              || this.course.start_time <= course.start_time && this.course.end_time >= course.end_time
      });
      const group_unavailable: Group[] = []
      course_same_time.forEach(course => {
        let current_group = this.groupes.find(group => group.id === course.id_group)!;


        // parent unavailable
        if(!group_unavailable.find(group => group.id === current_group.id))  {
          group_unavailable.push(current_group);
          while (current_group.id_group_parent != null){
            current_group = this.groupes.find(group => group.id === current_group.id_group_parent)!;
            if(!group_unavailable.find(group => group.id === current_group.id))  {
              group_unavailable.push(current_group);
            }
          }
        }


        // children unavailable
        let group_children: Group[] = this.groupes.filter(group => group.id_group_parent === course.id_group);
        while(group_children.length > 0) {
          const children_current = this.groupes.find(group => group.id === group_children[0].id)!;          
          if(!group_unavailable.find(group => group.id === children_current.id))  {
            group_unavailable.push(children_current);
          }

          const other_children = this.groupes.filter(group => group.id_group_parent === children_current.id);
          group_children = group_children.concat(other_children);
          console.log("look", group_children[0])
          group_children.shift();
        }
      }
      );
      console.log("Groupes indisponibles", group_unavailable)
      this.groupe_available = this.groupes.filter(group => !group_unavailable.find(group_unavailable => group_unavailable.id === group.id));
      console.log("Groupes disponibles", this.groupe_available)

    }
}