import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { EdtService } from 'src/app/services/edt.service';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss']
})
export class DeleteModalComponent implements OnInit{
  elementASupp: any;

  public formSelectionne: any = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private edtService: EdtService,
    private toastr: ToastrService,
  ){}

  ngOnInit(): void {
    this.formSelectionne = this.data.formSelectionne;
    this.setElementASupp();
  }

  somethingChanged() {
    this.edtService.notifySalleRefresh();
  }

  setElementASupp(){
    switch (this.data.formSelectionne) {
      case 'formSalle':
        this.elementASupp = this.data.element.nom;
        break;
      case 'formProfesseur':
        this.elementASupp = this.data.element.staff.user.name + ' ' + this.data.element.staff.user.lastname;
        break;
    }
  }

  supprimerSalle(){
    this.edtService.supprimerSalle(this.elementASupp).subscribe(
      (response) => {
        this.toastr.success("la salle à bien été supprimée");
        this.somethingChanged();
      },
      (error) => {
        this.toastr.error("erreur");
      }
    );
    this.elementASupp = null;
  }

  supprimerProf(){
    this.edtService.supprimerProf(this.data.element.id).subscribe(
      (response) => {
        this.toastr.success("le professeur à bien été supprimé(e)");
        this.somethingChanged();
      },
      (error) => {
        this.toastr.error("erreur");
      }
    );
    this.elementASupp = null;
  }
}