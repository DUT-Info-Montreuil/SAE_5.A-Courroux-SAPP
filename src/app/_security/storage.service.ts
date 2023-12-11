import { Injectable } from '@angular/core'
import { AuthResponse } from '../_model/fonctional/auth-response.model'
// import { User } from '../_model/entity/user.model'

const TOKEN_KEY = 'auth-token'
// const REFRESHTOKEN_KEY = 'auth-refreshtoken'
// const USER_KEY = 'auth-user'
// const ROLE_KEY = 'auth-role'
// const CURRENT_USER_ID = 'user-id'  
// const ESTABLISHMENT_CARACTS_KEY = 'auth-establishment-caracts'
// const ESTABLISHMENTS_KEY = 'auth-establishments'
// const FIRSTNAME_KEY = 'auth-firstname'
// const SECONDNAME_KEY = 'auth-secondname'
// const USERNAME_KEY = 'auth-username'


@Injectable({
  providedIn: 'root'
})
export class StorageService {
  
  constructor() {}

  signOut(): void {
    window.localStorage.clear()
  }

  public saveToken(token: string): void {
    window.localStorage.removeItem(TOKEN_KEY)
    window.localStorage.setItem(TOKEN_KEY, token)
  }

  public getToken(): string | null {
    return window.localStorage.getItem(TOKEN_KEY)
  }


  public saveResponse(auth: AuthResponse): void {
    // this.saveCacheVersion(auth.accessToken)
    this.saveToken(auth.access_token)
    // this.saveRefreshToken(auth.refreshToken)
   
  }

  

  public isLoggedIn(): boolean {
    if (this.getToken()) {
      return true
    }
    return false
  }

  isTokensValid(): boolean {
    console.log('this.getToken() :: ', this.getToken())
    if(this.getToken() == undefined || this.getToken() == null) { return false }
    return this.isTokenExpired(this.getToken())
  }
  
  // TODO :: à enlever, le cas échéant la changer
  getRoleList(): string[] {
    return ['ROLE_STUDENT', 'ROLE_TEACHER', 'ROLE_RESP_EDT']
  }

  // Fonction pour verifier si le token a expire
  isTokenExpired(token: string | null): boolean {
    const tokenData = this.decodeToken(token)
    if (!tokenData) {
      return true // Le token est invalide
    }
    const currentTime = Date.now() / 1000 // Temps actuel en secondes
    return tokenData.exp < currentTime
  }

  // Fonction pour decoder un token JWT (exemples de decodeurs disponibles en ligne)
  private decodeToken(token: string | null): any {
    try {
      const tokenPayload = JSON.parse(window.atob(token!.split('.')[1]))
      return tokenPayload
    } catch (error) {
      return null
    }
  }
}
