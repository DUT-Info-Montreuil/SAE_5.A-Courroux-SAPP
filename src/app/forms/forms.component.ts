import { Component } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EdtService } from '../services/edt.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss']
})
export class FormsComponent {

  isSection1Open = false;
  isSection2Open = false;
  isSection3Open = false;

  formAddRessource = new FormGroup({
    nom: new FormControl("", Validators.required),
    couleur: new FormControl("", Validators.required)
  })

  formAddSalle = new FormGroup({
    nom: new FormControl("", Validators.required),
    nbOrdi: new FormControl("", Validators.required),
    nbVideoProj: new FormControl("", Validators.required),
    nbTabNum: new FormControl("", Validators.required)
  })

  formAddProfesseur = new FormGroup({
    nom: new FormControl("", Validators.required),
    prenom: new FormControl("", Validators.required),
    nbHeurePrevisionnel: new FormControl("", Validators.required)
  })

  formAddEleve = new FormGroup({
    nom: new FormControl("", Validators.required),
    prenom: new FormControl("", Validators.required),
    numINE: new FormControl("", Validators.required)
  })

  formAddGroupe = new FormGroup({
    promo: new FormControl("", Validators.required),
    
  })

  public formSelectionne: any = null;
  public selection: any = null;
  public typeGroupeSelectionne: any = null;

  constructor(private edtService: EdtService,
    private toastr: ToastrService){}

  changerSelection(){
    this.selection = this.formSelectionne.substring(4);
  }
  
  onBoutonClique(valeurBouton: string) {
    this.typeGroupeSelectionne = valeurBouton;
  }

  onSubmitAddProfesseur(){
    if (this.formAddProfesseur.valid){
      let nom = this.formAddProfesseur.value.nom!;
      let prenom = this.formAddProfesseur.value.prenom!;
      let nbHeurePrevisionnel = this.formAddProfesseur.value.nbHeurePrevisionnel!;
      this.edtService.addProf(nom, prenom, nbHeurePrevisionnel);
      console.log(this.edtService.getProfs());
      this.toastr.success('Professeur ajoutée !')
    } else {
      this.toastr.error('Veuillez remplir correctement tous les champs du formulaire.');
    } 
  }

  onSubmitAddRessource(){
    if (this.formAddRessource.valid) {
      let couleur = this.formAddRessource.value.couleur!;
      let nom = this.formAddRessource.value.nom!;
      this.edtService.addRessource(nom, couleur);
      this.toastr.success('Ressource ajoutée !');
    } else {
      this.toastr.error('Veuillez remplir correctement tous les champs du formulaire.');
    }
  }

  onSubmitAddSalle(){
    if (this.formAddSalle.valid){
      let nom = this.formAddSalle.value.nom!;
      let nbOrdi = this.formAddSalle.value.nbOrdi!;
      let nbVideoProj = this.formAddSalle.value.nbVideoProj!;
      let nbTabNum = this.formAddSalle.value.nbTabNum!;
      this.edtService.addSalle(nom, nbOrdi, nbVideoProj, nbTabNum);
      console.log(this.edtService.getSalles());
      this.toastr.success('Salle ajoutée !');
    } else {
      this.toastr.error('Veuillez remplir correctement tous les champs du formulaire.');
    }
  }

  onSubmitAddEleve(){
    if (this.formAddEleve.valid){
      let nom = this.formAddEleve.value.nom!;
      let prenom = this.formAddEleve.value.prenom!;
      let numINE = this.formAddEleve.value.numINE!;
      this.edtService.addEleve(nom, prenom, numINE);
      console.log(this.edtService.getEleves());
      this.toastr.success('Eleve ajoutée !')
    } else {
      this.toastr.error('Veuillez remplir correctement tous les champs du formulaire.');
    } 
  }
}
