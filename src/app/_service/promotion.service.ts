import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilsService } from './utils.service';
import { Observable, Subject, retry } from 'rxjs';
import { Promotion } from '../_model/entity/promotion.model';

@Injectable({
    providedIn: 'root'
})
export class PromotionService {

    constructor(private http: HttpClient, private utilsService: UtilsService) { }

    private promoRefreshSource = new Subject<void>();
    promoRefresh$ = this.promoRefreshSource.asObservable();

    notifyPromoRefresh() {
        this.promoRefreshSource.next();
    }

    getPromotions(): Observable<Promotion[]> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/promotions`;
        return this.http.get<Promotion[]>(url, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
      }
    addPromotion(promotion: Promotion): Observable<Promotion> {
        const promotionData = this.parsePromotion(promotion);
        let url = `${this.utilsService.getEndPoint().apiUrl}/promotion`;
        return this.http.post<Promotion>(url, promotionData, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
      }
    updatePromotion(promotion: Promotion): Observable<Promotion> {
        const promotionData = this.parsePromotion(promotion);

        let url = `${this.utilsService.getEndPoint().apiUrl}/promotion/${promotion.id}`;
        return this.http.put<Promotion>(url, promotionData, this.utilsService.getJsonHeader())
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

    parsePromotion(promotion: Promotion): any {
        return {
            "niveau": promotion.niveau,
            "name": promotion.group.name,
            "id_resp": promotion.id_resp
         };
    }
}
