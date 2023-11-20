import { Component } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EdtService } from '../services/edt.service';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss']
})
export class FormsComponent {

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

  public formSelectionne: any = null;

  constructor(private edtService: EdtService){}

  onSubmitAddRessource(){
    let couleur = this.formAddRessource.value.couleur;
    let nom = this.formAddRessource.value.nom;
    if (typeof nom == 'string' && typeof couleur == 'string'){
      this.edtService.addRessource(nom, couleur);
      console.log(this.edtService.getRessources());
    } else {
      console.error("nom est couleur ne peuvent pas etre null");
    }
  }

  onSubmitAddSalle(){
    let nom = this.formAddSalle.value.nom;
    let nbOrdi = this.formAddSalle.value.nbOrdi;
    let nbVideoProj = this.formAddSalle.value.nbVideoProj;
    let nbTabNum = this.formAddSalle.value.nbTabNum;
    if (typeof nom === 'string' && typeof nbOrdi === 'number'
      && typeof nbVideoProj === 'number' && typeof nbTabNum === 'number'){
      this.edtService.addSalle(nom, nbOrdi, nbVideoProj, nbTabNum);
    } else {
      console.error("null");
    }
  }
}
