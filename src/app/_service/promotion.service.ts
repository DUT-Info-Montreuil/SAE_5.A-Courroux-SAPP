import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilsService } from './utils.service';
import { Observable, retry } from 'rxjs';
import { Promotion } from '../_model/entity/promotion.model';

@Injectable({
    providedIn: 'root'
})
export class PromotionService {

    constructor(private http: HttpClient, private utilsService: UtilsService) { }

    getPromotions(): Observable<Promotion[]> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/promotions`;
        return this.http.get<Promotion[]>(url, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
      }
    addPromotion(promotion: Promotion): Observable<Promotion> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/promotion`;
        return this.http.post<Promotion>(url, promotion, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
      }
    updatePromotion(promotion: Promotion): Observable<Promotion> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/promotion/${promotion.id}`;
        return this.http.put<Promotion>(url, promotion, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
      }
    getPromotion(id: number): Observable<Promotion> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/promotion/${id}`;
        return this.http.get<Promotion>(url, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
    }
}
