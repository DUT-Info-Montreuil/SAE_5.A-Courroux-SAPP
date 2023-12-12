import { Component, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { EdtService } from 'src/app/services/edt.service';
import { TeacherService } from 'src/app/_service/teacher.service';
import { Teacher } from 'src/app/_model/entity/teacher.model';
import { __values } from 'tslib';
import { RoomService } from 'src/app/_service/room.service';
import { Room } from 'src/app/_model/entity/room.model';
import { FormsComponent } from 'src/app/forms/forms.component';
import { ResourceService } from 'src/app/_service/resource.service';
import { Resource } from 'src/app/_model/entity/resource.model';
import { StudentService } from 'src/app/_service/student.service';
import { Student } from 'src/app/_model/entity/student.model';

@Component({
  selector: 'app-modif-modal-form',
  templateUrl: './modif-modal-form.component.html',
  styleUrls: ['./modif-modal-form.component.scss']
})
export class ModifModalFormComponent implements OnInit{

  teacher:Teacher = new Teacher();
  salle:Room = new Room();
  ressource:Resource = new Resource();
  eleve:Student = new Student();

  promos = this.formsComponent.promos;
  elementName: any = null;

  public formSelectionne: any = null;

  formModifSalle = new FormGroup({
    ordi: new FormControl("", Validators.required),
    videoProjecteur: new FormControl("", Validators.required),
    tableauNumerique: new FormControl("", Validators.required)
  })

  formModifProfesseur = new FormGroup({
    id: new FormControl<number|null>(null),
    name: new FormControl("", Validators.required),
    lastname: new FormControl("", Validators.required)
  })

  formModifStudent = new FormGroup({
    id: new FormControl<number|null>(null),
    name: new FormControl("", Validators.required),
    lastname: new FormControl("", Validators.required)
  })

  formModifRessource = new FormGroup({
    name: new FormControl("", Validators.required),
    initial: new FormControl("", Validators.required),
    id_promo: new FormControl("", Validators.required)
  })

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private teacherService: TeacherService,
    private roomService: RoomService,
    private ressourceService: ResourceService,
    private studentService: StudentService,
    private toastr: ToastrService,
    private formsComponent: FormsComponent
    ){
  }

  sallesChanged() {
    this.roomService.notifySalleRefresh();
  }

  profsChanged() {
    this.teacherService.notifyProfRefresh();
  }

  ressourceChanged(){
    this.ressourceService.notifyRessourceRefresh();
  }

  elevesChanged(){
    this.studentService.notifyStudentRefresh();
  }

  ngOnInit(): void{
    this.promos = this.data.promos;
    this.formSelectionne = this.data.formSelectionne;
    switch (this.formSelectionne) {
      case "formSalle":
        this.elementName = this.data.element.nom;
        this.setSalleValues();
        break;
      case "formProfesseur":
        this.elementName = this.data.element.staff.user.name + " " + this.data.element.staff.user.lastname;
        this.setProfValues();
        break;
      case "formRessource":
        this.elementName = this.data.element.initial;
        this.setRessourceValues();
        break;
      case "formEleve":
        this.elementName = this.data.element.user.name + " " + this.data.element.user.lastname;
        this.setEleveValues();
        break;
    }
    
  }

  getElementId(): number{
    return this.data.element.id;
  }

  setProfValues(){
    this.formModifProfesseur.patchValue({
      id: this.getElementId(),
      name: this.data.element.staff.user.name,
      lastname: this.data.element.staff.user.lastname,
    });
  }

  setEleveValues(){
    this.formModifStudent.patchValue({
      id: this.getElementId(),
      name: this.data.element.user.name,
      lastname: this.data.element.user.lastname,
    });
  }

  setSalleValues(){
    this.formModifSalle.patchValue({
      ordi: this.data.element.ordi,
      videoProjecteur: this.data.element.videoProjecteur,
      tableauNumerique: this.data.element.tableauNumerique
    });
  }

  setRessourceValues(){
    this.formModifRessource.patchValue({
      name: this.data.element.name,
      initial: this.data.element.initial,
      id_promo: this.data.element.id_promo
    })
  }

  onSubmitModifSalle(){
    if (this.formModifSalle.valid){
      this.salle = Object.assign(this.salle, this.formModifSalle.value);
      this.roomService.updateSalle(this.salle).subscribe({
        next: response => {
          this.toastr.success("la salle a bien été modifiée !");
          this.sallesChanged();
        },
        error: error=> {this.toastr.error("erreur");}
      });
    } else {
      this.toastr.error('Veuillez remplir correctement tous les champs du formulaire.');
    }
  }

  onSubmitModifProfesseur(){
    if (this.formModifProfesseur.valid){
      this.teacher = Object.assign(this.teacher, this.formModifProfesseur.value);
      console.log(this.teacher);
      this.teacherService.updateTeacher(this.teacher).subscribe({
        next: response => {
          this.toastr.success("le professeur a bien été modifié !");
          this.profsChanged();
        },
        error: error=> {this.toastr.error("erreur");}
      });
    } else {
      this.toastr.error('Veuillez remplir correctement tous les champs du formulaire.');
    }
  }

  onSubmitModifRessource(){
    if (this.formModifRessource.valid){
      this.ressource = Object.assign(this.ressource, this.formModifRessource.value);
      this.ressourceService.updateResource(this.ressource).subscribe({
        next:reponse => {
          this.toastr.success("la ressource a bien été modifié !");
          this.ressourceChanged();
        },
        error: error=> {this.toastr.error("erreur");}
      });
    } else {
      this.toastr.error('Veuillez remplir correctement tous les champs du formulaire.');
    }
  }

  onSubmitModifEleve(){
    if (this.formModifStudent.valid){
      this.eleve = Object.assign(this.eleve, this.formModifStudent.value);
      console.log(this.eleve);
      this.studentService.updateStudent(this.eleve).subscribe({
        next: response => {
          this.toastr.success("le professeur a bien été modifié !");
          this.elevesChanged();
        },
        error: error=> {this.toastr.error("erreur");}
      });
    } else {
      this.toastr.error('Veuillez remplir correctement tous les champs du formulaire.');
    }
  }
}
