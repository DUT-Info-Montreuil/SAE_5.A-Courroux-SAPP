import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilsService } from './utils.service';
import { Observable, retry } from 'rxjs';
import { Course } from '../_model/entity/course.model';

@Injectable({
    providedIn: 'root'
})
export class CourseService {

    constructor(private http: HttpClient, private utilsService: UtilsService) { }

    getCourses(): Observable<Course[]> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/courses`;
        return this.http.get<Course[]>(url, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
      }
    addCourse(course: Course): Observable<Course> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/course`;
        return this.http.post<Course>(url, course, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
      }
    updateCourse(course: Course): Observable<Course> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/course/${course.id}`;
        return this.http.put<Course>(url, course, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
      }
    getCourse(id: number): Observable<Course> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/course/${id}`;
        return this.http.get<Course>(url, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
    }
}
