import { Component, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { EdtService } from 'src/app/services/edt.service';
import { TeacherService } from 'src/app/_service/teacher.service';
import { Teacher } from 'src/app/_model/entity/teacher.model';
import { __values } from 'tslib';

@Component({
  selector: 'app-modif-modal-form',
  templateUrl: './modif-modal-form.component.html',
  styleUrls: ['./modif-modal-form.component.scss']
})
export class ModifModalFormComponent implements OnInit{

  teacher:Teacher = new Teacher();

  elementName: any = null;

  public formSelectionne: any = null;

  formModifSalle = new FormGroup({
    ordi: new FormControl("", Validators.required),
    videoProjecteur: new FormControl("", Validators.required),
    tableauNumerique: new FormControl("", Validators.required)
  })

  formModifProfesseur = new FormGroup({
    id: new FormControl<number|null>(null),
    name: new FormControl("", Validators.required),
    lastname: new FormControl("", Validators.required)
  })

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private edtService: EdtService,
    private teacherService: TeacherService,
    private toastr: ToastrService,
    ){
  }

  somethingChanged() {
    this.edtService.notifySalleRefresh();
  }

  ngOnInit(): void{
    this.formSelectionne = this.data.formSelectionne;
    this.setSalleValues();
    this.setProfValues();
    this.elementName = this.data.element.nom;
    console.log(this.data);
  }

  getElementId(): number{
    return this.data.element.id;
  }

  setProfValues(){
    this.formModifProfesseur.patchValue({
      id: this.getElementId(),
      name: this.data.element.staff.user.name,
      lastname: this.data.element.staff.user.lastname,
    });
  }

  setSalleValues(){
    this.formModifSalle.patchValue({
      ordi: this.data.element.ordi,
      videoProjecteur: this.data.element.videoProjecteur,
      tableauNumerique: this.data.element.tableauNumerique
    });
  }

  onSubmitModifSalle(){
    if (this.formModifSalle.valid){
      let name = this.data.element.nom;
      let ordi = parseInt(this.formModifSalle.value.ordi!);
      let videoProjecteur = parseInt(this.formModifSalle.value.videoProjecteur!);
      let tableauNumerique = parseInt(this.formModifSalle.value.tableauNumerique!);
      this.edtService.modifSalle(name, ordi, tableauNumerique, videoProjecteur).subscribe(
        (response) => {
          this.toastr.success("la salle à bien été modifié");
          this.somethingChanged();
        },
        (error) => {this.toastr.error("erreur");}
      );
    } else {
      this.toastr.error('Veuillez remplir correctement tous les champs du formulaire.');
    }
  }

  onSubmitModifProfesseur(){
    if (this.formModifProfesseur.valid){
      this.teacher = Object.assign(this.teacher, this.formModifProfesseur.value);
      this.teacherService.updateTeacher(this.teacher).subscribe({
        next: response => {
          this.toastr.success("la salle à bien été modifié");
          this.somethingChanged();
        },
        error: error=> {this.toastr.error("erreur");}
      });
    } else {
      this.toastr.error('Veuillez remplir correctement tous les champs du formulaire.');
    }
  }
}
