import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, retry } from 'rxjs';
import { Group } from '../_model/entity/group.model';
import { UtilsService } from './utils.service';

@Injectable({
    providedIn: 'root'
})
export class GroupService {

    constructor(private http: HttpClient, private utilsService: UtilsService) { }

    private groupeRefreshSource = new Subject<void>();
    groupeRefresh$ = this.groupeRefreshSource.asObservable();

    notifyGroupRefresh() {
        this.groupeRefreshSource.next();
    }

    getGroups(): Observable<Group[]> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/groupes`;
        return this.http.get<Group[]>(url, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
    }
    addGroup(group: Group): Observable<Group> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/groupe`;
        return this.http.post<Group>(url, group, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
    }
    updateGroup(group: Group): Observable<Group> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/groupe/${group.id}`;
        return this.http.put<Group>(url, group, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
    }
    getGroup(id: number): Observable<Group> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/groupe/${id}`;
        return this.http.get<Group>(url, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
    }
    getTreeGroup(id: number): Observable<Group> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/groupe/tree/${id}`;
        return this.http.get<Group>(url, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
    }
    getChildsGroup(id: number): Observable<Group> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/groupe/childs/${id}`;
        return this.http.get<Group>(url, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
    }
    deleteGroup(id: number): Observable<Group> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/groupe/${id}`;
        return this.http.delete<Group>(url, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
    }
}
