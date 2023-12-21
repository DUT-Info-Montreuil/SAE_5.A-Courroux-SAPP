import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EdtService } from '../services/edt.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ModifModalFormComponent } from '../modals/modif-modal-form/modif-modal-form.component';
import { Subscription, share } from 'rxjs';
import { DeleteModalComponent } from '../modals/delete-modal/delete-modal.component';
import { TeacherService } from '../_service/teacher.service';
import { Teacher } from '../_model/entity/teacher.model';
import { RoomService } from '../_service/room.service';
import { Room } from '../_model/entity/room.model';
import { ResourceService } from '../_service/resource.service';
import { Resource } from '../_model/entity/resource.model';
import { GroupService } from '../_service/group.service';
import { Student } from '../_model/entity/student.model';
import { Group } from '../_model/entity/group.model';
import { StudentService } from '../_service/student.service';
import { Promotion } from '../_model/entity/promotion.model';
import { PromotionService } from '../_service/promotion.service';


@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss']
})
export class FormsComponent implements OnInit, OnDestroy{

  teacher:Teacher;
  room:Room = new Room();
  ressource:Resource = new Resource();
  eleve:Student;
  promo:Group;
  groupe: Group;

  showModal = false;

  searchText: any;

  ressources : Resource[] = [];
  profs : Teacher[] = [];
  salles : Room[] = [];
  eleves : Student[] = [];
  promos : Promotion[] = [];
  groups : Group[] = [];

  isSection1Open = false;
  isSection2Open = false;

  formAddRessource = new FormGroup({
    name: new FormControl("", Validators.required),
    initial: new FormControl("", Validators.required),
    id_promo: new FormControl("", Validators.required)
  })

  formAddSalle = new FormGroup({
    name: new FormControl("", Validators.required),
    ordi: new FormControl("", Validators.required),
    videoProjecteur: new FormControl("", Validators.required),
    tableauNumerique: new FormControl("", Validators.required)
  })

  formAddProfesseur = new FormGroup({
    lastname: new FormControl("", Validators.required),
    name: new FormControl("", Validators.required),
    username: new FormControl("", Validators.required),
    password: new FormControl("", Validators.required)
  })

  formAddEleve = new FormGroup({
    lastname: new FormControl("", Validators.required),
    name: new FormControl("", Validators.required),
    INE: new FormControl("", Validators.required),
    username: new FormControl("", Validators.required),
    password: new FormControl("", Validators.required)
  })

  formAddGroupe = new FormGroup({
    niveau: new FormControl("", Validators.required),
    TD : new FormControl("", Validators.required),
    TP : new FormControl("", Validators.required)
  })

  promoSelectionnee: Promotion | null = null;
  public formSelectionne: any = null;
  public selection: any = null;
  public typeGroupeSelectionne: any = null;

  private salleRefreshSubscription!: Subscription;
  private profRefreshSubscription!: Subscription;
  private ressourceRefreshSubscription!: Subscription;
  private eleveRefreshSubscription!: Subscription;
  private groupeRefreshSubscription!: Subscription;

  constructor(
    private toastr: ToastrService,
    private dialogModif: MatDialog,
    private dialogDelete: MatDialog,
    private teacherService: TeacherService,
    private roomService: RoomService,
    private ressourceService: ResourceService,
    private groupeService: GroupService,
    private studentService: StudentService,
    private promotionService: PromotionService,){
  }

  ngOnInit(): void{
    this.refreshSalle();
    this.refreshProfs();
    this.refreshRessources();
    this.refreshPromo();
    this.refreshEleves();
    this.refreshGroupes();
    this.groupeRefreshSubscription = this.groupeService.groupeRefresh$.subscribe(() => {
      this.refreshGroupes();
    });
    this.eleveRefreshSubscription = this.studentService.studentRefresh$.subscribe(() => {
      this.refreshEleves();
    });
    this.ressourceRefreshSubscription = this.ressourceService.ressourceRefresh$.subscribe(() => {
      this.refreshRessources();
    });
    this.salleRefreshSubscription = this.roomService.salleRefresh$.subscribe(() => {
      this.refreshSalle();
    });
    this.profRefreshSubscription = this.teacherService.profRefresh$.subscribe(() => {
      this.refreshProfs();
    });
  }

  ouvrirModalModif(element: any){
    this.dialogModif.open(ModifModalFormComponent, {
      data: {
        promos : this.promos,
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

  changerPromo(event: any) {
    const selectedValue: Promotion | null = event.target.value;
  
    console.log('Selected Value:', selectedValue);
  
    if (selectedValue) {
      this.promoSelectionnee = selectedValue;
      console.log('Promo sélectionnée ID:', this.promoSelectionnee.id);
      this.refreshGroupes();  
    } else {
      this.toastr.error("Veuillez sélectionner une promo");
    }
  }
  
  ngOnDestroy() {
    this.salleRefreshSubscription.unsubscribe();
    this.profRefreshSubscription.unsubscribe();
    this.ressourceRefreshSubscription.unsubscribe();
    this.eleveRefreshSubscription.unsubscribe();
    this.groupeRefreshSubscription.unsubscribe();
  }

  redirectToEdt(){
    window.location.href = "/";
  }

  refreshGroupes(): void {
    if (this.promoSelectionnee !== null) {
      console.log(this.promoSelectionnee.id_resp);
      this.groupeService.getTreeGroup(parseInt(this.promoSelectionnee.id)).subscribe(
        (element: any) => {
          this.groups = element.children;
          // liste.forEach(element => {
          //   if (element.id_group_parent == this.idPromoSelectionnee 
          //     && element.id_group_parent != null) {
          //     this.tds.push(element);
          //   }
          // });
        },
        (erreur) => {
          console.error(erreur);
          this.toastr.error("erreur");
        }
      );
    }
  }

  refreshPromo(): void {
    this.promotionService.getPromotions().subscribe(
      (liste: Promotion[]) => {
        this.promos = liste;
      },
      (erreur) => {
        console.error(erreur);
        this.toastr.error("erreur");
      }
    );
  }

  refreshEleves(): void {
    this.studentService.getStudents().subscribe(
      (liste: Student[]) => {
        this.eleves = liste;
      },
      (erreur) => {
        console.error(erreur);
        this.toastr.error("erreur");
      }
    );
  }

  refreshSalle(): void {
    this.roomService.getSalles().subscribe(
      (liste: Room[]) => {
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
      (liste: Teacher[]) => {
        this.profs = liste;
      },
      (erreur) => {
        console.error(erreur);
        this.toastr.error("erreur");
      }
    );
  }

  refreshRessources(): void {
    this.ressourceService.getResources().subscribe(
      (liste: Resource[]) => {
        this.ressources = liste;
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
      let id = this.profs[this.profs.length - 1].id - 1;
      let name = this.formAddProfesseur.value.name!;
      let lastname = this.formAddProfesseur.value.lastname!;
      let username = this.formAddProfesseur.value.username!;
      let password = this.formAddProfesseur.value.password!;
      this.teacher = new Teacher(id, name, lastname, username, password);
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
      this.ressource = Object.assign(this.ressource, this.formAddRessource.value);
      this.ressourceService.addResource(this.ressource).subscribe({
        next: response => {
          this.toastr.success("la ressource a bien été ajoutée !");
          this.refreshRessources();
        },
        error: error=> {this.toastr.error("erreur");}
      });
      this.formAddProfesseur.reset();
    } else {
      this.toastr.error('Veuillez remplir correctement tous les champs du formulaire.');
    }
  }

  onSubmitAddSalle(){
    if (this.formAddSalle.valid){
      this.room = Object.assign(this.room, this.formAddSalle.value);
      this.roomService.addSalle(this.room).subscribe({
        next: response => {
          this.toastr.success("la salle a bien été ajouté !");
          this.refreshSalle();
        },
        error: error=> {this.toastr.error("erreur");}
      });
      this.formAddSalle.reset();
    } else {
      this.toastr.error('Veuillez remplir correctement tous les champs du formulaire.');
    }
  }

  onSubmitAddEleve(){
    if (this.formAddEleve.valid){
      let id = this.eleves[this.eleves.length - 1].id - 1;;
      let INE = parseInt(this.formAddEleve.value.INE!, 10);
      let name = this.formAddEleve.value.name!;
      let lastname = this.formAddEleve.value.lastname!;
      let username = this.formAddEleve.value.username!;
      let password = this.formAddEleve.value.password!;
      this.eleve = new Student(id, INE, name, lastname, username, password);
      this.studentService.addStudent(this.eleve).subscribe({
        next: responde => {
          this.toastr.success("l'élève a bien été ajouté !");
          this.refreshEleves();
        },
        error: error=> {this.toastr.error("erreur");}
      });
      this.formAddEleve.reset();
    } else {
      this.toastr.error('Veuillez remplir correctement tous les champs du formulaire.');
    }
  }

  onSubmitAddGroupe() {
    if (this.formAddGroupe.valid){
      this.groupe = Object.assign(this.groupe, this.formAddGroupe.value);
      this.groupeService.addGroup(this.groupe).subscribe({
        next: response => {
          this.toastr.success("le groupe a bien été ajouté !");
          this.refreshGroupes();
        },
        error: error=> {this.toastr.error("erreur");}
      });
      this.formAddGroupe.reset();
    } else {
      this.toastr.error('Veuillez remplir correctement tous les champs du formulaire.');
    }
  }
}
