import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilsService } from './utils.service';
import { Observable, retry } from 'rxjs';
import { Teacher } from '../_model/entity/teacher.model';

@Injectable({
    providedIn: 'root'
})
export class TeacherService {

    constructor(private http: HttpClient, private utilsService: UtilsService) { }

    getTeachers(): Observable<Teacher[]> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/teachers`;
        return this.http.get<Teacher[]>(url, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
      }
    addTeacher(teacher: Teacher): Observable<Teacher> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/teacher`;
        return this.http.post<Teacher>(url, teacher, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
      }
    updateTeacher(teacher: Teacher): Observable<Teacher> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/teacher/${teacher.id}`;
        return this.http.put<Teacher>(url, teacher, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
      }
    getTeacher(id: number): Observable<Teacher> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/teacher/${id}`;
        return this.http.get<Teacher>(url, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
    }
}
