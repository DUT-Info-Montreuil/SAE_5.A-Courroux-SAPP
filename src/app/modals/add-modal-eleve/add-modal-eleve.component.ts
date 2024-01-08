import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Student } from 'src/app/_model/entity/student.model';
import { StudentService } from 'src/app/_service/student.service';
import { UserGroupService } from 'src/app/_service/user_group.service';

@Component({
  selector: 'app-add-modal-eleve',
  templateUrl: './add-modal-eleve.component.html',
  styleUrls: ['./add-modal-eleve.component.scss']
})
export class AddModalEleveComponent {

  eleve: Student;

  formAddEleve = new FormGroup({
    lastname: new FormControl("", Validators.required),
    name: new FormControl("", Validators.required),
    INE: new FormControl("", Validators.required),
    username: new FormControl("", Validators.required),
    password: new FormControl("", Validators.required)
  })

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private studentService: StudentService,
    private userGroupService: UserGroupService,
    private toastr: ToastrService
  ) { }

  onSubmitAddEleve(){
    if (this.formAddEleve.valid){
      let id = 0;
      let INE = parseInt(this.formAddEleve.value.INE!, 10);
      let name = this.formAddEleve.value.name!;
      let lastname = this.formAddEleve.value.lastname!;
      let username = this.formAddEleve.value.username!;
      let password = this.formAddEleve.value.password!;
      this.eleve = new Student(id, INE, name, lastname, username, password);
      this.studentService.addStudent(this.eleve).subscribe({
        next: responde => {
          this.toastr.success("l'élève a bien été ajouté !");
          this.userGroupService.notifyUserGroupRefresh();
        },
        error: error => {
          this.toastr.error("Une erreur est survenue lors de l'ajout de l'élève");
          console.log(error);
        }
      });
      this.formAddEleve.reset();
    } else {
      this.toastr.error('Veuillez remplir correctement tous les champs du formulaire.');
    }
  }

}
