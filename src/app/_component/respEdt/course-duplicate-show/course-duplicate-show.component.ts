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
  selector: 'course-duplicate-show',
  templateUrl: './course-duplicate-show.component.html',
  styleUrls: ['./course-duplicate-show.component.scss']
})

export class CourseDuplicateShowComponent implements OnInit{

    @Input() group : GroupAvailable;

    @Input() group_available: GroupAvailable[];

    @Output() updateGroup: EventEmitter<GroupAvailable> = new EventEmitter<GroupAvailable>();
    // @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();
    // @Output() removeEvent: EventEmitter<Course> = new EventEmitter<Course>();
    // @Output() refresh: EventEmitter<void> = new EventEmitter<void>();






    constructor() {}


    ngOnInit() {

    }

    getGroupAvailable(group: Group){
      return this.group_available.find(g => g.group.id == group.id);
    }
    clickOnGroupAvailable(group: GroupAvailable){
      group.available = !group.available;
      group.selected = !group.selected;
      console.log("here")
      this.updateGroup.emit(group);
    }

    updateGroupAvailable(group: GroupAvailable){
      this.updateGroup.emit(group);
    }

}

interface GroupAvailable {
  group: Group;
  parent: Group;
  children: Group[];
  available: boolean;
  selected: boolean;
}