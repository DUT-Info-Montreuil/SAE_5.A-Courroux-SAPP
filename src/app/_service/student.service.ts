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
        const studentData = this.parseStudent(student);
        let url = `${this.utilsService.getEndPoint().apiUrl}/student`;
        return this.http.post<Student>(url, studentData, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
      }
    updateStudent(student: Student): Observable<Student> {
        const studentData = this.parseStudent(student);
        let url = `${this.utilsService.getEndPoint().apiUrl}/student/${student.id}`;
        return this.http.put<Student>(url, studentData, this.utilsService.getJsonHeader())
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

    parseStudent(student: Student): any {
        return {
            "INE": student.INE,
            "name": student.user.name,
            "lastname": student.user.lastname,
            "password": student.user.password!,
            "username": student.user.username,
        }
    }
}
