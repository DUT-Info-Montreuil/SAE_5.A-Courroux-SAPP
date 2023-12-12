import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EdtService } from '../services/edt.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ModifModalFormComponent } from '../modals/modif-modal-form/modif-modal-form.component';
import { Subscription, share } from 'rxjs';
import { DeleteModalComponent } from '../modals/delete-modal/delete-modal.component';
import { TeacherService } from '../_service/teacher.service';
import { Teacher } from '../_model/entity/teacher.model';


@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss']
})
export class FormsComponent implements OnInit, OnDestroy{

  teacher:Teacher = new Teacher();

  showModal = false;

  searchText: any;

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
    lastname: new FormControl("", Validators.required),
    name: new FormControl("", Validators.required),
    username: new FormControl("", Validators.required),
    password: new FormControl("", Validators.required)
  })

  formAddEleve = new FormGroup({
    nom: new FormControl("", Validators.required),
    prenom: new FormControl("", Validators.required),
    numINE: new FormControl("", Validators.required),
    identifiant: new FormControl("", Validators.required),
    password: new FormControl("", Validators.required)
  })

  formAddGroupe = new FormGroup({
    promo: new FormControl("", Validators.required),
    
  })

  public formSelectionne: any = null;
  public selection: any = null;
  public typeGroupeSelectionne: any = null;

  private salleRefreshSubscription!: Subscription;
  private profRefreshSubscription!: Subscription;

  constructor(
    private edtService: EdtService,
    private toastr: ToastrService,
    private dialogModif: MatDialog,
    private dialogDelete: MatDialog,
    private teacherService: TeacherService,
    private cdr: ChangeDetectorRef){
  }

  ouvrirModalModif(element: any){
    this.dialogModif.open(ModifModalFormComponent, {
      data: {
        formSelectionne : this.formSelectionne,
        element : element
      }
    });
  }

  ouvrirModalDelete(element: any){
    this.dialogDelete.open(DeleteModalComponent, {
      data: {
        formSelectionne : this.formSelectionne,
        element: element
      }
    });
  }

  ngOnInit(): void{
    this.refreshSalle();
    this.refreshProfs();
    this.salleRefreshSubscription = this.edtService.salleRefresh$.subscribe(() => {
      this.refreshSalle();
    });
    this.profRefreshSubscription = this.edtService.profRefresh$.subscribe(() => {
      this.refreshProfs();
    });
  }

  ngOnDestroy() {
    this.salleRefreshSubscription.unsubscribe();
  }

  refreshSalle(): void {
    this.edtService.getSalles().subscribe(
      (liste: any[]) => {
        this.salles = liste;
      },
      (erreur) => {
        console.error(erreur);
        this.toastr.error("erreur");
      }
    );
  }

  refreshProfs(): void {
    this.teacherService.getTeachers().subscribe(
      (liste: any[]) => {
        this.profs = liste;
      },
      (erreur) => {
        console.error(erreur);
        this.toastr.error("erreur");
      }
    );
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
  
  onBoutonClique(valeurBouton: string) {
    this.typeGroupeSelectionne = valeurBouton;
  }

  onSubmitAddProfesseur(){
    if (this.formAddProfesseur.valid){
      this.teacher = Object.assign(this.teacher, this.formAddProfesseur.value);
      this.teacherService.addTeacher(this.teacher).subscribe({
        next: response => {
          this.toastr.success("le prof a bien été ajouté !");
          this.refreshProfs();
        },
        error: error=> {this.toastr.error("erreur");}
      });
      this.formAddProfesseur.reset();
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
      this.edtService.addSalle(name, ordi, tableauNumerique, videoProjecteur).subscribe(
        (response) => {
          this.toastr.success("la salle à bien été ajouté");
          this.refreshSalle();
        },
        (error) => {this.toastr.error("erreur");}
      );
      this.formAddSalle.reset();
    } else {
      this.toastr.error('Veuillez remplir correctement tous les champs du formulaire.');
    }
  }

  onSubmitAddEleve(){
    if (this.formAddEleve.valid){
      let lastname = this.formAddEleve.value.nom!;
      let name = this.formAddEleve.value.prenom!;
      let INE = this.formAddEleve.value.numINE!;
      let identifier = this.formAddEleve.value.identifiant!;
      let password = this.formAddEleve.value.password!;
      this.edtService.addEleve(lastname, name, INE, identifier, password);
      this.toastr.success('Eleve ajoutée !')
    } else {
      this.toastr.error('Veuillez remplir correctement tous les champs du formulaire.');
    } 
  }
}
