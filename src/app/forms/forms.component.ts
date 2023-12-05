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

  showModal = false;

  searchText: any;

  elementASupp: any;

  ressources : any[] = [];
  profs : any[] = [];
  salles : any[] = [];
  eleves : any[] = []; 

  isSection1Open = false;
  isSection2Open = false;

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
    identifiant: new FormControl("", Validators.required),
    password: new FormControl("", Validators.required),
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
    private toastr: ToastrService){
      this.salles = this.edtService.getSalles();
      this.profs = edtService.getProfs();
  }

  afficherModal(): void {
    this.showModal = true;
  }

  cacherModal(): void {
    this.showModal = false;
  }

  changerSelection(){
    this.selection = this.formSelectionne.substring(4);
  }

  // getSalles(){
  //   return this.salles;
  // }
  
  onBoutonClique(valeurBouton: string) {
    this.typeGroupeSelectionne = valeurBouton;
  }

  onSubmitAddProfesseur(){
    if (this.formAddProfesseur.valid){
      let lastname = this.formAddProfesseur.value.nom!;
      let name = this.formAddProfesseur.value.prenom!;
      let identifier = this.formAddProfesseur.value.identifiant!;
      let password = this.formAddProfesseur.value.password!;
      this.edtService.addProf(lastname, name, identifier, password);
      console.log(this.edtService.getProfs());
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
      let name = this.formAddSalle.value.nom!;
      let ordi = parseInt(this.formAddSalle.value.nbOrdi!);
      let videoProjecteur = parseInt(this.formAddSalle.value.nbVideoProj!);
      let tableauNumerique = parseInt(this.formAddSalle.value.nbTabNum!);
      this.edtService.addSalle(name, ordi, tableauNumerique, videoProjecteur);
    } else {
      this.toastr.error('Veuillez remplir correctement tous les champs du formulaire.');
    }
  }

  choixSalleSupp(nom: string){
    this.elementASupp = nom;
  }

  supprimerSalle(){
    this.edtService.supprimerSalle(this.elementASupp);
    this.salles = this.edtService.getSalles();
    this.elementASupp = null;
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
