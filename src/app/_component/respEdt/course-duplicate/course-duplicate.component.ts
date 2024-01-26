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
  selector: 'course-duplicate',
  templateUrl: './course-duplicate.component.html',
  styleUrls: ['./course-duplicate.component.scss']
})

export class CourseDuplicateComponent implements OnInit{

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

    // groupe_available: Group[] = [];
    groupe_available: GroupAvailable[] = [];





    constructor(private formBuilder: FormBuilder,
                private courseService: CourseService,
                private toastr: ToastrService) {}


    ngOnInit() {

        console.log("Groupes", this.groupes);
        this.getGroupAvailableForDuplicate();
    }




      onSubmitDuplicate() {
        
        this.groupe_available.forEach(group => {
          if (group.selected){
            this.selectedGroups.push(group.group.id);
          }
        })
        console.log("courseToDup", this.course);
        console.log("SelectedGroups", this.selectedGroups);
        this.courseService.duplicate(this.course.id, this.selectedGroups).subscribe({
          next: response => {
            this.toastr.success("Duplication reussie");
            this.refresh.emit();
            this.closeModal.emit();
            this.selectedGroups = []

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
        return this.course.start_time >= course.start_time && this.course.start_time < course.end_time 
              || this.course.end_time > course.start_time && this.course.end_time <= course.end_time
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
      const groupe_available = this.groupes.filter(group => !group_unavailable.find(group_unavailable => group_unavailable.id === group.id));
      this.groupe_available = this.transformToGroupAvailable(groupe_available);
      console.log("Groupes disponibles", this.groupe_available)

    }

    transformToGroupAvailable(groups: Group[]): GroupAvailable[] {
      const group_available: GroupAvailable[] = [];
      groups.forEach(group_current => {
        group_available.push({
          group: group_current,
          parent: groups.find(group => group.id === group_current.id_group_parent)!,
          children: groups.filter(group => group.id_group_parent === group_current.id),
          available: true,
          selected: false
        })
      })
      return group_available
    }

    getParentsGroupAvailable(){
      
      return this.groupe_available.filter(group => group.parent  === undefined);
    
    }

    updateGroupAvailable(group: GroupAvailable){
      console.log("herreee")
      let group_find = this.groupe_available.find(group_available => group_available.group.id === group.group.id)!;
      group_find = group;

      let parent = group.parent
      while (parent){
        let parent_find = this.groupe_available.find(group_available => group_available.group.id === parent.id)!;
        if (group.available){
          let available = true
          parent_find.children.forEach(child => {
            const child_find = this.groupe_available.find(group_available => group_available.group.id === child.id)!;
            if (!child_find.available){
              available = false;
            }
          });
          parent_find.available = available;
        }
        else {
          parent_find.available = group.available;
        }
        console.log("change parent", parent_find.group.name, parent_find.available)
        parent = parent_find.parent;
      }

      const children = [...group.children];
      while (children.length > 0){
        const child = children[0];
        const child_find = this.groupe_available.find(group_available => group_available.group.id === child.id)!;
        child_find.available = group.available;
        console.log("change child", child_find.group.name, child_find.available)
        children.shift();
      }
      console.log("here", this.groupe_available)
    }




}

interface GroupAvailable {
  group: Group;
  parent: Group;
  children: Group[];
  available: boolean;
  selected: boolean;
}