import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilsService } from './utils.service';
import { Observable, Subject, retry } from 'rxjs';
import { WeekComment } from '../_model/entity/weekComment.model';


@Injectable({
    providedIn: 'root'
})
export class WeekCommentService {

    constructor(private http: HttpClient, private utilsService: UtilsService) { }

    getComments(): Observable<WeekComment[]> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/week/comments`;
        return this.http.get<WeekComment[]>(url, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
    }
    addComment(comment: WeekComment): Observable<WeekComment> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/week/comment`;
        return this.http.post<WeekComment>(url, comment, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
    }
    updateComment(comment: WeekComment): Observable<WeekComment> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/week/comment/${comment.id}`;
        return this.http.put<WeekComment>(url, comment, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
    }
    getComment(id: number): Observable<WeekComment> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/week/comment/${id}`;
        return this.http.get<WeekComment>(url, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
    }
    deleteComment(id: string): Observable<WeekComment> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/week/comment/${id}`;
        return this.http.delete<WeekComment>(url, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
    }
}
