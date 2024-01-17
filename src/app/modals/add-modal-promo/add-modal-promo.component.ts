import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EdtManager } from 'src/app/_model/entity/edtManager.model';
import { Group } from 'src/app/_model/entity/group.model';
import { Promotion } from 'src/app/_model/entity/promotion.model';
import { Teacher } from 'src/app/_model/entity/teacher.model';
import { AffiliationRespEdtService } from 'src/app/_service/affiliationRespEdt.service';
import { EdtManagerService } from 'src/app/_service/edtManager.service';
import { PromotionService } from 'src/app/_service/promotion.service';
import { TeacherService } from 'src/app/_service/teacher.service';

@Component({
  selector: 'app-add-modal-promo',
  templateUrl: './add-modal-promo.component.html',
  styleUrls: ['./add-modal-promo.component.scss']
})
export class AddModalPromoComponent {

  formAddPromo = new FormGroup({
    name: new FormControl("", Validators.required),
    niveau: new FormControl("", Validators.required), 
    // id_resp: new FormControl("", Validators.required),
    // group: new FormControl("", Validators.required)
  })

  searchText: any;

  aProfIsSelected = false;
  profSelected : Teacher | undefined;
  profs : EdtManager[] = [];

  constructor(
    private teacherService: TeacherService,
    private AffiliationRespEdtService: AffiliationRespEdtService,
    private responsableService: EdtManagerService,
    private promoService: PromotionService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.responsableService.getEdtManagers().subscribe({
      next: response => {
        this.profs = response;
      },
      error: error => {
        this.toastr.error('erreur lors du chargement des professeurs');
        console.log(error);
      }
    });
  }

  selectProf(prof : Teacher) {
    this.profSelected = prof;
    this.aProfIsSelected = !this.aProfIsSelected;
  }

  addPromo(){
    let promotionO: Promotion = new Promotion();
    let groupO: Group = new Group();
    let group = {
      name: this.formAddPromo.value.name,
      id_group_parent: null
    };
    groupO = Object.assign(group);
    let promotion = {
      niveau: this.formAddPromo.value.niveau,
      id_resp: this.profSelected?.id,
      group: groupO
    };
    promotionO = Object.assign(promotion);
    this.promoService.addPromotion(promotionO).subscribe({
      next: response => {
        this.clear();
        this.toastr.success('promotion ajoutée');
        console.log(response.id);
        console.log(promotion.id_resp!);
        this.AffiliationRespEdtService.affiliateRespEdtToPromo(promotion.id_resp!, response.id).subscribe({
          next: response => {
            this.toastr.success('promotion affiliée');
            this.promoService.notifyPromoRefresh();
          },
          error: error => {
            console.log(error);
          }
        });
      },
      error: error => {
        this.toastr.error('erreur lors de l ajout de la promotion');
        console.log(error);
      }
    });
    
  }

  clear(){
    this.aProfIsSelected = false;
    this.profSelected = undefined;
    this.formAddPromo.reset();
  }

}
