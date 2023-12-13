import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilsService } from './utils.service';
import { Observable, retry } from 'rxjs';
import { Course } from '../_model/entity/course.model';

@Injectable({
    providedIn: 'root'
})
export class CourseService {

    constructor(private http: HttpClient, private utilsService: UtilsService) { }

    getCourses(args: any[]= []): Observable<Course[]> {


        let params: String[] = []

        args.forEach(arg => {
            const key = Object.keys(arg)[0];
            params.push(`${key}=${arg[key]}`);
        });


        let url = `${this.utilsService.getEndPoint().apiUrl}/courses`;

        if (params.length > 0) {
            url += `?${params.join('&')}`;
        }


        

        return this.http.get<Course[]>(url, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
      }


      getCoursesWithDate(date_min:string, date_max:string): Observable<Course[]> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/courses?date_min=${date_min}&date_max=${date_max}`;
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
