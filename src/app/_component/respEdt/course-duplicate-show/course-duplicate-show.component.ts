import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Group } from '../../../_model/entity/group.model';


@Component({
  selector: 'course-duplicate-show',
  templateUrl: './course-duplicate-show.component.html',
  styleUrls: ['./course-duplicate-show.component.scss']
})

export class CourseDuplicateShowComponent {
  @Input() group : GroupAvailable;
  @Input() group_available: GroupAvailable[];

  @Output() updateGroup: EventEmitter<GroupAvailable> = new EventEmitter<GroupAvailable>();

  constructor() {}

  getGroupAvailable(group: Group){
    return this.group_available.find(g => g.group.id == group.id);
  }

  clickOnGroupAvailable(group: GroupAvailable){
    group.available = !group.available;
    group.selected = !group.selected;
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