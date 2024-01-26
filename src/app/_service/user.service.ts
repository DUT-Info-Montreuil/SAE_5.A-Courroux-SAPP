import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilsService } from './utils.service';
import { Observable, retry } from 'rxjs';
import { Course } from '../_model/entity/course.model';
import { format } from 'date-fns';
import { User } from '../_model/entity/user.model';


@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private http: HttpClient, private utilsService: UtilsService) { }


    /*
        @function getIdentify
        @return Observable<User>
        @desc: get user from API according to token
    */
    getIdentify(): Observable<User> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/identify`;
        return this.http.get<User>(url, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
      }
}
