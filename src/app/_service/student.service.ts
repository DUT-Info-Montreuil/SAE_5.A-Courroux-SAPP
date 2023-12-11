import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilsService } from './utils.service';
import { Observable, retry } from 'rxjs';
import { Student } from '../_model/entity/student.model';

@Injectable({
    providedIn: 'root'
})
export class StudentService {

    constructor(private http: HttpClient, private utilsService: UtilsService) { }

    getStudents(): Observable<Student[]> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/students`;
        return this.http.get<Student[]>(url, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
      }
    addStudent(student: Student): Observable<Student> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/student`;
        return this.http.post<Student>(url, student, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
      }
    updateStudent(student: Student): Observable<Student> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/student/${student.id}`;
        return this.http.put<Student>(url, student, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
      }
    getStudent(id: number): Observable<Student> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/student/${id}`;
        return this.http.get<Student>(url, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
    }
}
