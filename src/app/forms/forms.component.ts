import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ModifModalFormComponent } from '../modals/modif-modal-form/modif-modal-form.component';
import { Observable, Subscription, catchError, map, of } from 'rxjs';
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
import { AddModalEleveComponent } from '../modals/add-modal-eleve/add-modal-eleve.component';
import { AddModalPromoComponent } from '../modals/add-modal-promo/add-modal-promo.component';
import { EdtManager } from '../_model/entity/edtManager.model';
import { EdtManagerService } from '../_service/edtManager.service';
import { AffiliationRespEdtService } from '../_service/affiliationRespEdt.service';


@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss']
})
export class FormsComponent implements OnInit, OnDestroy{

  // promoManagers = new Map<number,number[]>();
  // promoManagersKeys : number[] = [];
  // promoManagersValues : number[][] = [];
  promoManagers : PromotionResponsable[] = [];

  teacher:Teacher;
  responsable : EdtManager;
  room:Room = new Room();
  ressource:Resource = new Resource();
  promo:Group;
  groupe: Group = new Group();

  showModal = false;

  searchText: any;

  responsables : EdtManager[] = [];
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

  formAddResponsable = new FormGroup({
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
  private promoRefreshSubscription!: Subscription;
  private respRefreshSubscription!: Subscription;

  constructor(
    private toastr: ToastrService,
    private dialog: MatDialog,
    private teacherService: TeacherService,
    private roomService: RoomService,
    private ressourceService: ResourceService,
    private groupeService: GroupService,
    private responsableService: EdtManagerService,
    private affiliationService: AffiliationRespEdtService,
    private studentService: StudentService,
    private promotionService: PromotionService,
    ){
  }

  ngOnInit(): void{
    this.refreshSalle();
    this.refreshProfs();
    this.refreshRessources();
    // this.refreshPromo().subscribe({
    //   next: () => {
    //     this.promos.forEach((promo) => {
    //       this.getRespsByPromo(promo.id);
    //     });
    //   }
    // });
    this.refreshGroupes();
    this.refreshResps();
    this.respRefreshSubscription = this.responsableService.respRefresh$.subscribe(() => {
      this.refreshResps();
    });
    // this.promoRefreshSubscription = this.promotionService.promoRefresh$.subscribe(() => {
    //   this.refreshPromo().subscribe({
    //     next: () => {
    //       this.promos.forEach((promo) => {
    //         console.log("promo", promo)
    //         this.getRespsByPromo(promo.id);
    //       });
    //     }
    //   });
    // });
    this.promotionService.getPromotions().subscribe({
      next: (liste: Promotion[]) => {
        this.promos = liste;
        this.promos.forEach((promo) => {
          this.getRespsByPromo(promo);
        });
      },
      error: (error) => {
        console.log(error);
      }
    });
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
    this.promoRefreshSubscription.unsubscribe();
    this.respRefreshSubscription.unsubscribe();
  }

  ouvrirModalAjoutPromo() {
    this.dialog.open(AddModalPromoComponent);
  }

  ouvrirModalModif(element: any){
    let activated;
    if (element instanceof Teacher){
      activated = element.activated
    } else {
      activated = true
    }
    this.dialog.open(ModifModalFormComponent, {
      data: {
        promos : this.promos,
        formSelectionne : this.formSelectionne,
        element : element,
        prof_activated : activated
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

  getResponsableNotInPromo(promo: Promotion): EdtManager[] {
    let resps: EdtManager[] = [];

    const promoManager  = this.promoManagers.find((promoManager) => promoManager.promo.id == promo.id)!;
    this.responsables.forEach((resp) => {
      if (!promoManager.resp.find((respPromo) => respPromo.id == resp.id)){
        resps.push(resp);
      }
    });
    return resps;
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

  getRespsByPromo(promo : Promotion) {
    this.affiliationService.getRespEdtByPromo(promo.id).subscribe({
      next: (liste) => {
        this.promoManagers.push({promo: promo, resp: liste});
        console.log("this.promoManagers", this.promoManagers);
        // this.promoManagers.set(idPromo, liste);
        // this.promoManagersKeys.push(idPromo);
        // this.promoManagersValues.push(liste);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  // setMap(){
  //   let managers : EdtManager[] = [];
  //   this.promos.forEach((promo) => {
  //     console.log("promo", promo);
  //     managers = [];
  //     this.affiliationService.getRespEdtByPromo(promo.id).subscribe({
  //       next: (liste) => {
  //         console.log("liste", liste);
  //         liste.forEach((id) =>{
  //           console.log("id", id);
  //           this.responsableService.getEdtManager(id).subscribe({
  //             next: (edtManager) => {
  //               console.log("edtManager", edtManager);
  //               managers.push(edtManager);
  //             },
  //             error: (error) => {
  //               console.log(error);
  //             }
  //           });
  //         });
  //       }
  //     });
  //     this.promoManagers.set(promo, managers);
  //   });
  // }

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

  getResponsable(id : number) : EdtManager{
    return this.responsables.find((resp) => resp.id == id)!;
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

  // refreshPromo(): void {
  //   this.promotionService.getPromotions().subscribe(
  //     (liste: Promotion[]) => {
  //       this.promos = liste;
  //     },
  //     (erreur) => {
  //       console.error(erreur);
  //       this.toastr.error("erreur");
  //     }
  //   );
  // }

  refreshPromo(): Observable<any>{
    return this.promotionService.getPromotions().pipe(
      map((liste: Promotion[]) => {
        this.promos = liste;
      }),
      catchError((error: any) => {
        console.error(error);
        this.toastr.error("erreur");
        return of(null);
      })
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

  refreshResps(): void {
    this.responsableService.getEdtManagers().subscribe(
      (liste: EdtManager[]) => {
        this.responsables = liste;
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

  changerSelection(event: any){
    this.formSelectionne = event.target.value;
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
      this.teacher = new Teacher(id, name, lastname, username, password, true);
  
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

  onSubmitAddResponsable() {
    if (this.formAddResponsable.valid) {
      let id = this.responsables[this.responsables.length - 1].id - 1;
      let name = this.formAddResponsable.value.name!;
      let lastname = this.formAddResponsable.value.lastname!;
      let username = this.formAddResponsable.value.username!;
      let password = this.formAddResponsable.value.password!;
      this.responsable = new EdtManager(id, name, lastname, username, password);
      console.log(this.responsable);
      this.responsableService.addEdtManager(this.responsable).subscribe({
        next: response => {
          // Si la requête est réussie, affiche un toast de succès
          this.toastr.success("Le résponsable a bien été ajouté !");
          this.refreshResps();
        },
        error: error => {
          this.handleError(error, "résponsable");
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

  getPromoById(id: number): Promotion {
    return this.promos.find(promo => promo.id === id)!;
  }
}

interface PromotionResponsable {
  promo: Promotion;
  resp: EdtManager[];
}
