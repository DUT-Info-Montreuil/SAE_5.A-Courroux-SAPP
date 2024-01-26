import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable, retry } from 'rxjs'
import { UtilsService } from '../_service/utils.service'
import { StorageService } from './storage.service'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  public user: Observable<string | null>

  constructor(
    private http: HttpClient,
    private utilsService: UtilsService,
    private storageService: StorageService
  ) {}

  /*
      @function logoutUser
      @desc: logout user
  */
  logoutUser() {
    this.storageService.signOut();
    window.location.href = '/login';
  }

  /*
      @function login
      @param username: string
      @param password: string
      @return Observable<any>
      @desc: login user
  */
  login(username: string, password: string): Observable<any> {
    const url = `${this.utilsService.getEndPoint().apiUrl}/auth/login`;
    return this.http.post(url, { username, password }, this.utilsService.getJsonHeader())
      .pipe(
        retry(1)
      );
  }

  /*
      @function logout
      @return Observable<any>
      @desc: logout user
  */
  logout(): Observable<any> {
    const url = `${this.utilsService.getEndPoint().apiUrl}/logout`;
    return this.http.get(url, this.utilsService.getJsonHeader())
      .pipe(
        retry(1)
      );
  }
}
