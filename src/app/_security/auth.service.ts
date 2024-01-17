import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'
// import { User } from '../_model/entity/user.model'
import { BehaviorSubject, Observable, map, retry } from 'rxjs'
import { Router } from '@angular/router'
import { UtilsService } from '../_service/utils.service'
import { StorageService } from './storage.service'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubject: BehaviorSubject<string | null>
  public user: Observable<string | null>

  constructor(
    private router: Router,
    private http: HttpClient,
    private utilsService: UtilsService,
    private storageService: StorageService) {

    // this.userSubject = new BehaviorSubject(this.storageService.getUsername())
    // this.user = this.userSubject.asObservable()
  }

//   public get userValue() {
//     return this.userSubject.value
//   }

//   public saveUser(): void {
//     console.log('this.storageService.getUsername()', this.storageService.getUsername())
//     this.userSubject = new BehaviorSubject(this.storageService.getUsername())
//   }

  /*login(username: string, password: string): Observable<any> {
    const url = `${this.utilsService.getEndPoint().apiUrl}/auth`
    return this.http.post<any>(url, { username, password })
      .pipe(map(user => {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('user', JSON.stringify(user))
          this.userSubject.next(user)
          return user
      }))
  }*/

  logoutUser() {
    // remove user from local storage to log user out
    // this.logout().subscribe({
    //   next: () => {
    //     this.storageService.signOut()
    //     this.userSubject.next(null)
    //     window.location.href = '/login'
    //   },
    //   error: () => {
    //     this.storageService.signOut()
    //     this.userSubject.next(null)
    //     window.location.href = '/login'
    //   },
    //   complete: () => {
    //     this.storageService.signOut()
    //     this.userSubject.next(null)
    //     window.location.href = '/login'
    //   }
    // })
    this.storageService.signOut()
    // this.userSubject.next(null)
    window.location.href = '/login'
  }


  login(username: string, password: string): Observable<any> {
    const url = `${this.utilsService.getEndPoint().apiUrl}/auth/login`
    return this.http.post(url, { username, password }, this.utilsService.getJsonHeader())
      .pipe(
        retry(1)
      )
  }


  logout(): Observable<any> {
    const url = `${this.utilsService.getEndPoint().apiUrl}/logout`
    return this.http.get(url, this.utilsService.getJsonHeader())
      .pipe(
        retry(1)
      )
  }
}
