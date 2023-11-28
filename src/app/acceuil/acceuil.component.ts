import { Component } from '@angular/core';
import { SessionLoginService } from '../services/session-login.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-acceuil',
  templateUrl: './acceuil.component.html',
  styleUrls: ['./acceuil.component.scss']
})
export class AcceuilComponent {

  nbRdm: number = Math.floor(Math.random() * 7);
  imageName = "assets/images/Frame" + this.nbRdm + ".png"; 

  

  formLogin = new FormGroup({
    identifier: new FormControl("", Validators.required),
    password: new FormControl("", Validators.required)
  })

  constructor(private sessionLoginService: SessionLoginService,
    private toastr: ToastrService) { }

  onSubmit() {
    if (this.formLogin.valid){
      let identifier = this.formLogin.value.identifier!;
      let password = this.formLogin.value.password!;
      this.sessionLoginService.login(identifier, password).subscribe(
        (response) => {},
        (error) => {}
      );
    } else {
      this.toastr.error('Identifiant ou mot de passe incorrect', '', {
        
      });
    }
  }
}
