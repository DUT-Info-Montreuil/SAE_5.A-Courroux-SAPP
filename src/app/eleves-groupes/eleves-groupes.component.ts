import { Component, Input, OnDestroy, OnInit, SimpleChanges, OnChanges  } from '@angular/core';
import { Promotion } from '../_model/entity/promotion.model';
import { PromotionService } from '../_service/promotion.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { GroupService } from '../_service/group.service';
import { Group } from '../_model/entity/group.model';
import { BehaviorSubject, Observable, catchError, map, of } from 'rxjs';
import { UserGroupService } from '../_service/user_group.service';

@Component({
  selector: 'app-eleves-groupes',
  templateUrl: './eleves-groupes.component.html',
  styleUrls: ['./eleves-groupes.component.scss']
})
export class ElevesGroupesComponent {

  public idPromoSelectionnee: number | null = null;

  promos : Promotion[] = [];
  groupes = new Map<Group, Group[]>();
  eleve_groupes = new Map<Group, any[]>();
  groupesKeys : Group[] = [];
  groupesValues : Group[][] = [];
  eleve_groupesKeys : Group[] = [];
  eleve_groupesValues : any[][] = [];

  constructor(
    private promotionService: PromotionService,
    private groupService: GroupService,
    private userGroupService: UserGroupService,
    private toastr: ToastrService,
  ){}

  ngOnInit(){
    this.initPromotions();
  }

  redirectToEdt(){
    window.location.href = "/";
  }

  initPromotions(){
    this.promotionService.getPromotions().subscribe({
      next :(liste: Promotion[]) => {
        this.promos = liste;
      },
      error: (error: HttpErrorResponse) => {
        this.toastr.error('Une erreur est survenue au chargement des promotions');
        console.log(error);
      }
    })
  }

  initGroupes(): Observable<any> {
    this.groupes.clear();
    return this.groupService.getTreeGroup(this.idPromoSelectionnee!).pipe(
      map((element) => {
        element.children.forEach((group) => {
          let sousGroupes: Group[] = [];
          if (group.children.length > 0) {
            group.children.forEach((sousGroupe) => {
              sousGroupes.push(sousGroupe);
            });
          }
          this.groupes.set(group, sousGroupes);
        });
        this.groupesKeys = Array.from(this.groupes.keys());
        this.groupesValues = Array.from(this.groupes.values());
      }),
      catchError((error: any) => {
        this.toastr.error('Une erreur est survenue au chargement des groupes');
        console.log(error);
        return of(null);
      })
    );
  }

  setElevesGroupe(){
    this.eleve_groupes.clear();
    if (this.groupes.size > 0) {
      this.groupes.forEach((values: Group[]) => {
        values.forEach((tp: Group) => {
          this.userGroupService.getStudentsFromGroup(tp.id).subscribe({
            next :(liste: any[]) => {
              this.eleve_groupes.set(tp, liste);
            },
            error: (error: HttpErrorResponse) => {
              this.toastr.error('Une erreur est survenue au chargement des eleves');
              console.log(error);
            }
          });
        });
      });
    } else {
      console.log('La Map est encore vide.');
    }
  }

  changerPromo(event: any) {
    this.idPromoSelectionnee = event.target.value;
    this.initGroupes().subscribe(() => {
      this.setElevesGroupe();
    });
  }
}
