import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SessionLoginService {

  LOGIN_URL = 'https://api.courroux.org/login';

  constructor(private http: HttpClient) { }

  login(identifier: string, password: string) {
    let credentials = {identifier: identifier, password: password } 
    return this.http.post(this.LOGIN_URL, credentials);
  }
}
