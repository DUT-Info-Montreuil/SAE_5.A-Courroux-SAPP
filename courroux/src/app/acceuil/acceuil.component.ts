import { Component } from '@angular/core';

@Component({
  selector: 'app-acceuil',
  templateUrl: './acceuil.component.html',
  styleUrls: ['./acceuil.component.scss']
})
export class AcceuilComponent {
  nbRdm: number = Math.floor(Math.random() * 7);
  imageName = "assets/images/Frame" + this.nbRdm + ".png"; 
}
