import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_security/auth.service';
import { AuthResponse } from 'src/app/_model/fonctional/auth-response.model';
import { StorageService } from 'src/app/_security/storage.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {

  loginForm!: FormGroup

  loading: boolean = false;


  nbRdm: number = Math.floor(Math.random() * 7);
  imageName = "assets/images/Frame" + this.nbRdm + ".png"; 

  

  formLogin = new FormGroup({
    identifier: new FormControl("", Validators.required),
    password: new FormControl("", Validators.required)
  })

  constructor(
    private authService: AuthService,
    private storageService: StorageService) { }

  ngOnInit() {
    this.authService.logoutUser()

  }


  // onSubmit() {
  //   if (this.formLogin.valid){
  //     let identifier = this.formLogin.value.identifier!;
  //     let password = this.formLogin.value.password!;
  //     this.sessionLoginService.login(identifier, password).subscribe(
  //       (response) => {
  //         this.router.navigate(['/edt']);
  //         // pour envoyer le groupe quand on load l'edt
  //         // this.router.navigate(['/edt'], { queryParams: { key: 'value' } });
  //         this.toastr.success('vous etes bien connecté')
  //         console.log(response);
  //       },
  //       (error) => {
  //         this.toastr.error('identifiant et/ou un mot de passe incorect(s)');
  //       }
  //     );
  //   } else {
  //     this.toastr.warning('veuillez rensegner un identifiant et/ou un mot de passe');
  //   }
  // }


}