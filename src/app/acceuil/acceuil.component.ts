import { Component } from '@angular/core';
import { SessionLoginService } from '../services/session-login.service';

@Component({
  selector: 'app-acceuil',
  templateUrl: './acceuil.component.html',
  styleUrls: ['./acceuil.component.scss']
})
export class AcceuilComponent {

  credentials = { identifier: '', password: '' };

  constructor(private sessionLoginService: SessionLoginService) { }

  onSubmit(credential: any) {
    console.log(this.credentials.identifier);
    this.sessionLoginService.login(this.credentials).subscribe(
      (response) => {
        
      },
      (error) => {
        // Gérez les erreurs de l'appel à l'API.
      }
    );
  }

  nbRdm: number = Math.floor(Math.random() * 7);
  imageName = "assets/images/Frame" + this.nbRdm + ".png"; 
}
