import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ModifModalFormComponent } from '../modals/modif-modal-form/modif-modal-form.component';
import { Subscription } from 'rxjs';
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
import { HttpErrorResponse } from '@angular/common/http';
import { UserGroupService } from '../_service/user_group.service';


@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss']
})
export class FormsComponent implements OnInit, OnDestroy{

  teacher:Teacher;
  room:Room = new Room();
  ressource:Resource = new Resource();
  promo:Group;
  groupe: Group = new Group();

  showModal = false;

  searchText: any;

  ressources : Resource[] = [];
  profs : Teacher[] = [];
  salles : Room[] = [];
  promos : Promotion[] = [];
  groups : Group[] = [];
  sousGroupes : Group[] = [];


  isSection1Open = false;
  isSection2Open = false;

  formAddRessource = new FormGroup({
    name: new FormControl("", Validators.required),
    initial: new FormControl("", Validators.required),
    id_promo: new FormControl("", Validators.required),
    color: new FormControl("#0D4378", Validators.required)
  })
  color: string = "#0D4378"

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

  formAddGroupe = new FormGroup({
    name: new FormControl("", Validators.required),
    id_group_parent: new FormControl<number|null>(null)
  })

  public idPromoSelectionnee: number | null = null;
  public formSelectionne: any = null;
  public selection: any = null;
  public typeGroupeSelectionne: any = null;

  private salleRefreshSubscription!: Subscription;
  private profRefreshSubscription!: Subscription;
  private ressourceRefreshSubscription!: Subscription;
  private groupeRefreshSubscription!: Subscription;

  constructor(
    private toastr: ToastrService,
    private dialog: MatDialog,
    private teacherService: TeacherService,
    private roomService: RoomService,
    private ressourceService: ResourceService,
    private groupeService: GroupService,
    private studentService: StudentService,
    private promotionService: PromotionService,
    ){
  }

  ngOnInit(): void{
    this.refreshSalle();
    this.refreshProfs();
    this.refreshRessources();
    this.refreshPromo();
    this.refreshGroupes();
    this.groupeRefreshSubscription = this.groupeService.groupeRefresh$.subscribe(() => {
      this.refreshGroupes();
      this.sousGroupes = [];
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

  ngOnDestroy() {
    this.salleRefreshSubscription.unsubscribe();
    this.profRefreshSubscription.unsubscribe();
    this.ressourceRefreshSubscription.unsubscribe();
    this.groupeRefreshSubscription.unsubscribe();
  }

  ouvrirModalModif(element: any){
    this.dialog.open(ModifModalFormComponent, {
      data: {
        promos : this.promos,
        formSelectionne : this.formSelectionne,
        element : element
      }
    });
  }

  ouvrirModalDelete(element: any){
    this.dialog.open(DeleteModalComponent, {
      data: {
        formSelectionne : this.formSelectionne,
        element: element
      }
    });
  }

  changerPromo(event: any) {
    this.idPromoSelectionnee = event.target.value;
    this.refreshGroupes();
    this.sousGroupes = [];
  }
  
  setFormGroupValues(id_group_parent: number){
    this.formAddGroupe.patchValue({
      id_group_parent: id_group_parent
    });
  }

  redirectToEdt(){
    window.location.href = "/";
  }

  getTreeGroup(idGroupe: number){
    this.groupeService.getTreeGroup(idGroupe).subscribe(
      (element) => {
        console.log(element);
        this.sousGroupes = element.children;
        if (element.children.length == 0) {
          this.toastr.warning("Aucun sous-groupe");
        }
      },
      (erreur) => {
        console.error(erreur);
        this.toastr.error("erreur");
      }
    )
  }

  refreshGroupes(): void {
    this.groups = [];
    this.sousGroupes = [];
    this.groupeService.getGroups().subscribe(
      (liste: Group[]) => {
        liste.forEach((groupe) => {
          if (groupe.id_group_parent != null 
            && groupe.id_group_parent == this.idPromoSelectionnee) {
            this.groups.push(groupe);
          }
        });
      },
      (erreur) => {
        console.error(erreur);
        this.toastr.error("erreur");
      }
    )
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

  handleError(error: HttpErrorResponse, entityName: string): void {
    if (error.status === 400) {
      this.toastr.error("Veuillez remplir correctement tous les champs du formulaire.");
    } else if (error.status === 403) {
      this.toastr.error("Erreur d'autorisation. Vous n'avez pas les droits nécessaires.");
    } else if (error.status === 404) {
      this.toastr.error("Erreur : " + entityName + " non trouvé.");
    } else {
      this.toastr.error("Une erreur inattendue s'est produite.");
    }
  }

  onSubmitAddProfesseur() {
    if (this.formAddProfesseur.valid) {
      let id = this.profs[this.profs.length - 1].id - 1;
      let name = this.formAddProfesseur.value.name!;
      let lastname = this.formAddProfesseur.value.lastname!;
      let username = this.formAddProfesseur.value.username!;
      let password = this.formAddProfesseur.value.password!;
      this.teacher = new Teacher(id, name, lastname, username, password);
  
      this.teacherService.addTeacher(this.teacher).subscribe({
        next: response => {
          // Si la requête est réussie, affiche un toast de succès
          this.toastr.success("Le prof a bien été ajouté !");
          this.refreshProfs();
        },
        error: error => {
          this.handleError(error, "professeur");
        }
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
        error: error => {
          this.handleError(error, "ressource");
        }
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
        error: error => {
          this.handleError(error, "salle");
        }
      });
      this.formAddProfesseur.reset();
    } else {
      this.toastr.error('Veuillez remplir correctement tous les champs du formulaire.');
    }
  }

  

  onSubmitAddGroupe(parentPromo: boolean) {
    if (parentPromo){
      this.setFormGroupValues(this.idPromoSelectionnee!);
    }
    if (this.formAddGroupe.valid){
      this.groupe = Object.assign(this.groupe, this.formAddGroupe.value);
      this.groupeService.addGroup(this.groupe).subscribe({
        next: response => {
          this.toastr.success("le groupe a bien été ajouté !");
          this.refreshGroupes();
        },
        error: error => {
          this.handleError(error, "groupe");
        }
      });
      this.formAddProfesseur.reset();
    } else {
      this.toastr.error('Veuillez remplir correctement tous les champs du formulaire.');
    }
  }

  toggleActivationTeacher(teacher: Teacher) {
    teacher.activated = !teacher.activated
    this.teacherService.updateTeacher(teacher).subscribe({
      next: response => {
        this.toastr.success("Le prof a bien été modifié !");
        this.refreshProfs();
      },
      error: error => {
        this.handleError(error, "professeur");
      }
    });
  }
}
