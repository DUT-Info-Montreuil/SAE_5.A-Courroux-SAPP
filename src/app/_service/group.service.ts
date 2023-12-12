import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilsService } from './utils.service';
import { Observable, retry } from 'rxjs';
import { Group } from '../_model/entity/group.model';

@Injectable({
    providedIn: 'root'
})
export class GroupService {

    constructor(private http: HttpClient, private utilsService: UtilsService) { }

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
}
