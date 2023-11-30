import { Component } from '@angular/core';
import { SessionLoginService } from '../services/session-login.service';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

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
    private toastr: ToastrService,
    private router: Router) { }

  onSubmit() {
    if (this.formLogin.valid){
      let identifier = this.formLogin.value.identifier!;
      let password = this.formLogin.value.password!;
      this.sessionLoginService.login(identifier, password).subscribe(
        (response) => {
          this.router.navigate(['/edt']);
          // pour envoyer le groupe quand on load l'edt
          // this.router.navigate(['/edt'], { queryParams: { key: 'value' } });
          this.toastr.success('vous etes bien connecté')
          console.log(response);
        },
        (error) => {
          this.toastr.error('identifiant et/ou un mot de passe incorect(s)');
        }
      );
    } else {
      this.toastr.warning('veuillez rensegner un identifiant et/ou un mot de passe');
    }
  }
}
