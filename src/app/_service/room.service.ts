import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilsService } from './utils.service';
import { Observable, Subject, retry } from 'rxjs';
import { Room } from '../_model/entity/room.model';


@Injectable({
    providedIn: 'root'
})
export class RoomService {

    constructor(private http: HttpClient, private utilsService: UtilsService) { }

    private salleRefreshSource = new Subject<void>();
    salleRefresh$ = this.salleRefreshSource.asObservable();

    notifySalleRefresh() {
        this.salleRefreshSource.next();
    }

    getSalles(): Observable<Room[]> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/salles`;
        return this.http.get<Room[]>(url, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
    }
    addSalle(room: Room): Observable<Room> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/salle`;
        return this.http.post<Room>(url, room, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
    }
    updateSalle(room: Room): Observable<Room> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/salle/${room.nom}`;
        return this.http.put<Room>(url, room, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
    }
    getSalle(id: number): Observable<Room> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/salle/${id}`;
        return this.http.get<Room>(url, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
    }
    deleteSalle(name: string): Observable<Room> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/salle/${name}`;
        return this.http.delete<Room>(url, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
    }
}
