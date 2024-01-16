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

  @Output() closeModal: EventEmitter<void> = new EventEmitter<void>();

  stats: any[] = [];

  constructor(private courseService : CourseService) { }

  ngOnInit(): void {
    this.courseService.getStatsTeacher(this.idTeacher).subscribe((stats: any[]) => {
      this.stats = stats;
    });
  }



  closeModalStats() {
    this.closeModal.emit();
  }
}
