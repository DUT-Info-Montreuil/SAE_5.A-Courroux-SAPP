import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { GroupService } from 'src/app/_service/group.service';
import { ResourceService } from 'src/app/_service/resource.service';
import { RoomService } from 'src/app/_service/room.service';
import { StudentService } from 'src/app/_service/student.service';
import { TeacherService } from 'src/app/_service/teacher.service';
import { EdtService } from 'src/app/services/edt.service';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.scss']
})
export class DeleteModalComponent implements OnInit{
  elementASupp: string;

  public formSelectionne: any = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private teacherService: TeacherService,
    private roomService: RoomService,
    private ressourceService: ResourceService,
    private studentService: StudentService,
    private groupService: GroupService,
    private toastr: ToastrService,
  ){}

  ngOnInit(): void {
    this.formSelectionne = this.data.formSelectionne;
    this.setElementASupp();
  }

  setElementASupp(){
    switch (this.formSelectionne) {
      case "formSalle":
        this.elementASupp = this.data.element.nom;
        break;
      case "formProfesseur":
        this.elementASupp = this.data.element.staff.user.name + " " + this.data.element.staff.user.lastname;
        break;
      case "formRessource":
        this.elementASupp = this.data.element.initial;
        break;
      case "formEleve":
        this.elementASupp = this.data.element.user.name + " " + this.data.element.user.lastname;
        break;
      case "formGroupe":
        this.elementASupp = this.data.element.name;
        break;
    }
  }

  groupesChanged(){
    this.groupService.notifyGroupRefresh();
  }

  studentsChanged(){
    this.studentService.notifyStudentRefresh();
  }

  sallesChanged() {
    this.roomService.notifySalleRefresh();
  }

  profsChanged(){
    this.teacherService.notifyProfRefresh();
  }

  ressourcesChanged(){
    this.ressourceService.notifyRessourceRefresh();
  }

  supprimerSalle(){
    this.roomService.deleteSalle(this.data.element.nom).subscribe({
      next: response => {
        this.toastr.success("la salle a bien été supprimée!");
        this.sallesChanged();
      },
      error: error=> {this.toastr.error("erreur");}
    });
    this.elementASupp = "";
  }

  supprimerProf(){
    this.teacherService.deleteTeacher(this.data.element.id).subscribe({
      next: response => {
        this.toastr.success("le professeur a bien été supprimé!");
        this.profsChanged();
      },
      error: error=> {this.toastr.error("erreur");}
    });
    this.elementASupp = "";
  }

  // code 200 mais ne supprime pas la ressource dans la liste
  supprimerRessource(){
    this.ressourceService.deleteResource(this.data.element).subscribe({
      next: response => {
        this.toastr.success("la ressource a bien été supprimée!");
        this.ressourcesChanged();
      },
      error: error=> {this.toastr.error("erreur");}
    });
    this.elementASupp = "";
  }

  supprimerEleve(){
    this.studentService.deleteStudent(this.data.element.id).subscribe({
      next: response => {
        this.toastr.success("l'élève a bien été supprimé(e)!");
        this.studentsChanged();
      },
      error: error=> {this.toastr.error("erreur");}
    });
    this.elementASupp = "";
  }

  supprimerGroupe(){
    this.groupService.deleteGroup(this.data.element.id).subscribe({
      next: response => {
        this.toastr.success("le groupe a bien été supprimé!");
        this.studentsChanged();
      },
      error: error=> {this.toastr.error("erreur");}
    });
    this.elementASupp = "";
  }
}