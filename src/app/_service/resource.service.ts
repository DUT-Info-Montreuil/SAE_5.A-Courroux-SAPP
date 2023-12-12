import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilsService } from './utils.service';
import { Observable, retry } from 'rxjs';
import { Resource } from '../_model/entity/resource.model';

@Injectable({
    providedIn: 'root'
})
export class ResourceService {

    constructor(private http: HttpClient, private utilsService: UtilsService) { }

    getResources(): Observable<Resource[]> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/ressources`;
        return this.http.get<Resource[]>(url, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
      }
    addResource(teacher: Resource): Observable<Resource> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/ressource`;
        return this.http.post<Resource>(url, teacher, this.utilsService.getJsonHeader())
        .pipe(
            retry(1)
        );
      }
    updateResource(resource: Resource): Observable<Resource> {
        let url = `${this.utilsService.getEndPoint().apiUrl}/ressource/${resource.name}`;
        return this.http.put<Resource>(url, resource, this.utilsService.getJsonHeader())
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
