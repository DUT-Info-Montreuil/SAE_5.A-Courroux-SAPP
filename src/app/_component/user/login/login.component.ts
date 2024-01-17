import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/_security/auth.service';
import { AuthResponse } from 'src/app/_model/fonctional/auth-response.model';
import { StorageService } from 'src/app/_security/storage.service';

@Component({
  selector: 'app-acceuil',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm!: FormGroup

  loading: boolean = false;


  nbRdm: number = Math.floor(Math.random() * 7);
  imageName = "assets/images/Frame" + this.nbRdm + ".png"; 

  

  formLogin = new FormGroup({
    identifier: new FormControl("", Validators.required),
    password: new FormControl("", Validators.required)
  })

  constructor(private toastr: ToastrService,
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private storageService: StorageService) { }

  ngOnInit() {
    this.loading = true
    this.loginForm = this.formBuilder.group({
      username: ['', [
        Validators.required,
        // Validators.email
      ]],
      password: ['', [
        Validators.required, 
        // Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&-.]).{12,}$")
      ]]
    })
    this.loading = false

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

  onSubmit() {
    // this.submitted = true
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      this.toastr.warning('veuillez rensegner un identifiant et/ou un mot de passe');
      return
    }    
    const { username, password } = this.loginForm.value
    console.log(username.trim(), password)
    this.authService.login(username.trim().toLowerCase(), password).subscribe({
      next: (data: AuthResponse) => {
        this.storageService.saveResponse(data)
        // this.authService.saveUser()
        this.router.navigate(['/edt']);
        this.toastr.success('vous etes bien connecté')

      },
      error: err => {
        console.log('error login :: ', err)
        this.toastr.error('identifiant et/ou un mot de passe incorect(s)');
      }
    })
  }
}