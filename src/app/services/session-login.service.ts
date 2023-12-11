import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SessionLoginService {
  //Python
  // LOGIN_URL = 'http://localhost:5000/login';
  //Docker
  LOGIN_URL = 'http://localhost:8000/auth/login';

  constructor(private http: HttpClient) { }

  login(identifier: string, password: string) {
    let credentials = {identifier: identifier, password: password } 
    return this.http.post(this.LOGIN_URL, credentials);
  }
}
