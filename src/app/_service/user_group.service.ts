import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, retry } from 'rxjs';
import { UtilsService } from './utils.service';

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

    addStudentToGroup(idStudent: number, idGroupe: number): Observable<any> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/usergroupe/addGroupeEtudiant`;
        const requestData = {
            idStudent: idStudent,
            idGroupe: idGroupe
        };
        const requestBody = JSON.stringify(requestData);
        const headers = new HttpHeaders({
            'Content-Type': 'application/json'
        });
        return this.http.post<any>(url, requestBody, { headers: headers })
            .pipe(
                retry(1)
            );
    }

    deleteUserFromGroup(idStudent: number): Observable<any> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/usergroupe/delete/${idStudent}`;
        return this.http.delete<any>(url, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
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

    migratePromotion(idEtudiants: number[], idAncPromo:number, idNvPromo: number, idResp:number): Observable<any> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/usergroupe/migrate`;

        const body = {
            idEtudiants: idEtudiants,
            idAncPromo: idAncPromo,
            idNvPromo: idNvPromo,
            idResp: idResp
        };

        return this.http.post<any>(url, body, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
    }
}