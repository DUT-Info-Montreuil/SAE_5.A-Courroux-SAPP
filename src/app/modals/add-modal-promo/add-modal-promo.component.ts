import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Group } from 'src/app/_model/entity/group.model';
import { Promotion } from 'src/app/_model/entity/promotion.model';
import { Teacher } from 'src/app/_model/entity/teacher.model';
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
    niveau: new FormControl("", Validators.required)
  })

  searchText: any;

  aProfIsSelected = false;
  profSelected : Teacher | undefined;
  profs : Teacher[] = [];

  constructor(
    private teacherService: TeacherService,
    private promoService: PromotionService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.teacherService.getTeachers().subscribe({
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
    let promotion: Promotion = new Promotion();
    let group: Group = new Group();
    let id_resp = this.profSelected?.id;
    group = Object.assign(group, this.formAddPromo.value.name);
    promotion = Object.assign(promotion, this.formAddPromo.value.niveau, id_resp, group);
    console.log(promotion);
    this.promoService.addPromotion(promotion).subscribe({
      next: response => {
        this.clear();
        this.toastr.success('promotion ajoutée');
      },
      error: error => {
        this.toastr.error('erreur lors de l ajout de la promotion');
        console.log(error);
      }
    })
  }

  clear(){
    this.aProfIsSelected = false;
    this.profSelected = undefined;
    this.formAddPromo.reset();
  }

}
