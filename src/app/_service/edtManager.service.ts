import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilsService } from './utils.service';
import { Observable, retry } from 'rxjs';
import { EdtManager } from '../_model/entity/edtManager.model';

@Injectable({
    providedIn: 'root'
})
export class EdtManagerService {

    constructor(private http: HttpClient, private utilsService: UtilsService) { }

    getEdtManagers(): Observable<EdtManager[]> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/responsables`;
        return this.http.get<EdtManager[]>(url, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
      }
    addEdtManager(edtManager: EdtManager): Observable<EdtManager> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/responsable`;
        return this.http.post<EdtManager>(url, edtManager, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
      }
    updateEdtManager(edtManager: EdtManager): Observable<EdtManager> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/responsable/${edtManager.id}`;
        return this.http.put<EdtManager>(url, edtManager, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
      }
    getEdtManager(id: number): Observable<EdtManager> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/responsable/${id}`;
        return this.http.get<EdtManager>(url, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
    }

    parseEdtManager(edtManager: EdtManager): any {
        return {
            "name": edtManager.staff.user.name,
            "lastName": edtManager.staff.user.lastname,
            "password": edtManager.staff.user.password!,
            "username": edtManager.staff.user.username,
        }
    }
}
