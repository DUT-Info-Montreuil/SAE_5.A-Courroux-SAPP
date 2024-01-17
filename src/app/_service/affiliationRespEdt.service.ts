import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilsService } from './utils.service';
import { Observable, Subject, retry } from 'rxjs';
import { EdtManager } from '../_model/entity/edtManager.model';
import { Promotion } from '../_model/entity/promotion.model';

@Injectable({
    providedIn: 'root'
})
export class AffiliationRespEdtService {

    constructor(private http: HttpClient, private utilsService: UtilsService) { }

    affiliateRespEdtToPromo(idResp : number, idPromo : number) : Observable<any>{
        let url = `${this.utilsService.getEndPoint().apiUrl}/affiliateRespEdt`;

        const requestBody = {
            idResp: idResp,
            idPromo: idPromo
        };

        return this.http.post<any>(url, requestBody, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
    }

    getPromosForRespEdt(idResp : number) : Observable<Promotion[]>{
        let url = `${this.utilsService.getEndPoint().apiUrl}/affiliateRespEdt/getPromosByResp/${idResp}`;
        return this.http.get<Promotion[]>(url, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
    }

    deleteAffiliation(idResp : number) : Observable<any>{
        let url = `${this.utilsService.getEndPoint().apiUrl}/affiliateRespEdt/delete/${idResp}`;
        return this.http.delete<any>(url, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
    }
}