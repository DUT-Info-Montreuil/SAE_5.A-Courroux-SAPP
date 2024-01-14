import { Component, EventEmitter, Output, Input } from '@angular/core';
import { Course } from 'src/app/_model/entity/course.model';
import { CourseService } from 'src/app/_service/course.service';

@Component({
  selector: 'stats-teacher',
  templateUrl: './stats-teacher.component.html',
  styleUrls: ['./stats-teacher.component.scss']
})
export class StatsTeacherComponent {

  @Input() idTeacher: number;
  @Input() showModalStats: boolean;

  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  courses_of_teacher: Course[] = [];

  constructor(private courseService : CourseService) { }

  ngOnInit(): void {
    this.courseService.getByTeacher(this.idTeacher).subscribe((courses: Course[]) => {
      this.courses_of_teacher = courses;
    });
  }



  closeModalStats() {
    this.closeModal.emit();
  }
}
