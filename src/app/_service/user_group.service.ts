import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilsService } from './utils.service';
import { Observable, Subject, map, retry } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class UserGroupService {

    constructor(private http: HttpClient, private utilsService: UtilsService) { }

    private userGroupeRefreshSource = new Subject<void>();
    userGroupeRefresh$ = this.userGroupeRefreshSource.asObservable();

    notifyUserGroupRefresh() {
        this.userGroupeRefreshSource.next();
    }

    getStudentsFromGroup(idGroup: number): Observable<any> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/usergroupe/groupe/${idGroup}`;
        return this.http.get<any>(url, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
    }

    modifyGroupStudent(idStudent: number, newIdGroupe: number, idGroupe: number): Observable<any> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/usergroupe/modify/${idStudent}/${newIdGroupe}/${idGroupe}`;
        return this.http.put<any>(url, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
    }
}