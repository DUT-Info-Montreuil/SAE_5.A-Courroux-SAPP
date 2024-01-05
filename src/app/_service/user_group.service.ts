import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilsService } from './utils.service';
import { Observable, Subject, map, retry } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class UserGroupService {

    constructor(private http: HttpClient, private utilsService: UtilsService) { }

    getStudentsFromGroup(idGroup: number): Observable<any> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/usergroupe/groupe/${idGroup}`;
        return this.http.get<any>(url, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
    }
}