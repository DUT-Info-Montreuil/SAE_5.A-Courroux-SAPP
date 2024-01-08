import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilsService } from './utils.service';
import { Observable, Subject, retry } from 'rxjs';
import { Teacher } from '../_model/entity/teacher.model';

@Injectable({
    providedIn: 'root'
})
export class TeacherService {

    constructor(private http: HttpClient, private utilsService: UtilsService) { }

    private profRefreshSource = new Subject<void>();
    profRefresh$ = this.profRefreshSource.asObservable();

    notifyProfRefresh(){
        this.profRefreshSource.next();
    }

    getTeachers(): Observable<Teacher[]> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/teachers`;
        return this.http.get<Teacher[]>(url, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
    }
    addTeacher(teacher: Teacher): Observable<Teacher> {

        const teacherData = this.parseAddTeacher(teacher);

        let url = `${this.utilsService.getEndPoint().apiUrl}/teacher`;
        return this.http.post<Teacher>(url, teacherData, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
    }
    updateTeacher(teacher: Teacher): Observable<Teacher> {

        const teacherData = this.parseUpdateTeacher(teacher);
        
        let url = `${this.utilsService.getEndPoint().apiUrl}/teacher/${teacher.id}`;
        return this.http.put<Teacher>(url, teacherData, this.utilsService.getJsonHeader())
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
    deleteTeacher(id: number): Observable<Teacher> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/teacher/${id}`;
        return this.http.delete<Teacher>(url, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
    }

    parseUpdateTeacher(teacher: Teacher): any {
        return {
            "name": teacher.staff.user.name,
            "lastname": teacher.staff.user.lastname,
            // "password": teacher.staff.user.password!,
            // "username": teacher.staff.user.username,
        }
    }

    parseAddTeacher(teacher: Teacher): any {
        return {
            "name": teacher.staff.user.name,
            "lastname": teacher.staff.user.lastname,
            "password": teacher.staff.user.password!,
            "username": teacher.staff.user.username,
        }
    }
}
