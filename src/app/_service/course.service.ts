import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilsService } from './utils.service';
import { Observable, retry } from 'rxjs';
import { Course } from '../_model/entity/course.model';
import { format } from 'date-fns';


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
        const courseData = this.parseCourse(course);

        let url = `${this.utilsService.getEndPoint().apiUrl}/course`;
        return this.http.post<Course>(url, courseData, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
      }
    updateCourse(course: Course): Observable<Course> {
        const courseData = this.parseCourse(course);

        let url = `${this.utilsService.getEndPoint().apiUrl}/course/${course.id}`;
        return this.http.put<Course>(url, courseData, this.utilsService.getJsonHeader())
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

    parseCourse(course: Course): any {
        let courseParsed = {
            id: course.id,
            start_time: format(course.start_time, 'yyyy-MM-dd HH:mm:ss'),
            end_time: format(course.end_time, 'yyyy-MM-dd HH:mm:ss'),
            id_enseignant: course.id_enseignant,
            initial_ressource: course.initial_ressource,
            id_group: course.id_group,
            name_salle: course.name_salle,
            appelEffectue: course.appelEffectue,
            is_published: course.is_published
        }
        return courseParsed;
    }
}
