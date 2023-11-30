import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SessionLoginService {

  LOGIN_URL = 'http://localhost:8000/login';

  constructor(private http: HttpClient) { }

  login(identifier: string, password: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    let credentials = {identifier: identifier, password: password } 
    return this.http.post(this.LOGIN_URL, credentials, { headers: headers });
  }
}
