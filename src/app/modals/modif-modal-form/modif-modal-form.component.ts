import { Component, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { EdtService } from 'src/app/services/edt.service';

@Component({
  selector: 'app-modif-modal-form',
  templateUrl: './modif-modal-form.component.html',
  styleUrls: ['./modif-modal-form.component.scss']
})
export class ModifModalFormComponent implements OnInit{

  elementName: any = null;

  public formSelectionne: any = null;

  formModifSalle = new FormGroup({
    ordi: new FormControl("", Validators.required),
    videoProjecteur: new FormControl("", Validators.required),
    tableauNumerique: new FormControl("", Validators.required)
  })

  formModifProfesseur = new FormGroup({
    nom: new FormControl("", Validators.required),
    prenom: new FormControl("", Validators.required)
  })

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private edtService: EdtService,
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
  }

  setProfValues(){
    this.formModifProfesseur.patchValue({
      prenom: this.data.element.staff.user.name,
      nom: this.data.element.staff.user.lastname,
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
      let name = this.data.element.nom;
      let lastname = this.data.element.lastname;
      this.edtService.modifProf(name, lastname, this.data.element.id).subscribe(
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
}
