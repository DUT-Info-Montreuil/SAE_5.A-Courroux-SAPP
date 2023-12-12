import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilsService } from './utils.service';
import { Observable, Subject, retry, map } from 'rxjs';
import { Resource } from '../_model/entity/resource.model';

@Injectable({
    providedIn: 'root'
})
export class ResourceService {

    constructor(private http: HttpClient, private utilsService: UtilsService) { }

    private ressourceRefreshSource = new Subject<void>();
    ressourceRefresh$ = this.ressourceRefreshSource.asObservable();

    notifyRessourceRefresh() {
        this.ressourceRefreshSource.next();
    }

    getResources(): Observable<Resource[]> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/ressources`;
        return this.http.get<Resource[]>(url, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
      }
    addResource(resource: Resource): Observable<Resource> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/ressource`;
        return this.http.post<Resource>(url, resource, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
      }
    updateResource(resource: Resource): Observable<Resource> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/ressource/${resource.initial}`;
        return this.http.put<Resource>(url, resource, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
      }

    deleteResource(resource: Resource): Observable<Resource> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/ressource/${resource.initial}`;
        return this.http.delete<Resource>(url, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
    }
    
    getResource(id: number): Observable<Resource> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/ressource/${id}`;
        return this.http.get<Resource>(url, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
    }
}
