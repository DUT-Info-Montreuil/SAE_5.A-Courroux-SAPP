import { Injectable } from '@angular/core'
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { catchError, switchMap } from 'rxjs/operators'
import { AuthService } from './auth.service'
import { EventBusService } from '../_shared/event-bus.service'
import { EventData } from '../_shared/event.class'
import { StorageService } from './storage.service'
import { UtilsService } from '../_service/utils.service'
import { AuthResponse } from '../_model/fonctional/auth-response.model'
import { Router } from '@angular/router'

const TOKEN_HEADER_KEY = 'Authorization'  // for Spring Boot back-end
const BEARER_TOKEN_HEADER_KEY = 'Bearer'  // for Spring Boot back-end

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private eventBusService: EventBusService,
    private utilsService: UtilsService,
    private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<Object>> {
    let authReq = req
    const token = this.storageService.getToken()
    // const csrfToken = this.getCookie('XSRF-TOKEN')
    if (token != null && !authReq.url.includes('auth/login')    ) {
      if (this.storageService.isTokenExpired(token)) {
        this.eventBusService.emit(new EventData('unauthorized', null))
        // this.router.navigate(['/logout']); // Ajoutez le chemin de la page de déconnexion
        // return throwError('Token expired'); // Stoppez le flux observable pour éviter toute autre requête

      } 
    }
    if (token) {
        
      authReq = authReq.clone({
        setHeaders: {
          [TOKEN_HEADER_KEY]: BEARER_TOKEN_HEADER_KEY + " " + token
        }
      })
    }
    return next.handle(authReq).pipe(catchError(error  => {
        if (error instanceof HttpErrorResponse && !authReq.url.includes('auth/login') && error.status === 401) {
            this.eventBusService.emit(new EventData('logout', null))
            this.router.navigate(['/login']); // Ajoutez le chemin de la page de déconnexion
        }
        return throwError(() => error)
    
    }));

  }
  


  private getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  }
}
