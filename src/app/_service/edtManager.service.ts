import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilsService } from './utils.service';
import { Observable, Subject, retry } from 'rxjs';
import { EdtManager } from '../_model/entity/edtManager.model';
import { Promotion } from '../_model/entity/promotion.model';

@Injectable({
    providedIn: 'root'
})
export class EdtManagerService {

    constructor(private http: HttpClient, private utilsService: UtilsService) { }

    private respRefreshSource = new Subject<void>();
    respRefresh$ = this.respRefreshSource.asObservable();

    notifyRespRefresh(){
        this.respRefreshSource.next();
    }

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
    getPromoEdtManager(): Observable<Promotion[]> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/responsable/promos`;
        return this.http.get<Promotion[]>(url, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
    }
    deleteEdtManager(id: number): Observable<EdtManager> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/responsable/${id}`;
        return this.http.delete<EdtManager>(url, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
    }

    parseEdtManager(edtManager: EdtManager): any {
        return {
            "name": edtManager.staff.user.name,
            "lastname": edtManager.staff.user.lastname,
            "password": edtManager.staff.user.password!,
            "username": edtManager.staff.user.username,
        }
    }
}
