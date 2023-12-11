import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject} from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class EdtService{

  ADD_COURS = 'http://localhost:8000/course';
  GET_COURS = 'http://localhost:8000/courses';
  GET_GROUPES = 'http://localhost:8000/groupes';
  GET_PROMOTIONS = 'http://localhost:8000/promotions';

  //API = 'http://localhost:5000/';

  API = 'http://localhost:8000/';
  // profs
  ADD_PROF = this.API + 'teacher';
  GET_PROFS = this.API + 'teachers';
  DELETE_MODIF_PROF = this.API + 'teacher/'; // + id du prof
  // salles
  GET_SALLES = this.API + 'salles';
  ADD_SALLE = this.API + 'salle';
  DELETE_MODIF_SALLE = this.API + 'salle/'; // + nom de la salle
  //ressources
  GET_RESSOURCES = this.API + 'ressources';
  
  constructor(private http: HttpClient, private toastr: ToastrService) {
  }

  private salleRefreshSource = new Subject<void>();
  
  salleRefresh$ = this.salleRefreshSource.asObservable();

  private profRefreshSource = new Subject<void>();
  
  profRefresh$ = this.profRefreshSource.asObservable();

  notifySalleRefresh() {
    this.salleRefreshSource.next();
  }

  addRessource(nom: string, couleur: string){
      let res = {
        nom: nom,
        couleur: couleur
      }
    //this.ressources.push(res);
  }

  getRessources(){
    let ressources : any[] = [];
    this.http.get<any[]>(this.GET_RESSOURCES).subscribe(
      (data: any[]) => {
        for (const item of data) {
          ressources.push(item);
        }
      },
      (error) => {
        console.error(error);
        // Gérez l'erreur si nécessaire
      }
    );

    return ressources;
  } 

  addSalle(nom: string, nbOrdi: number, nbVideoProj: number, nbTabNum: number){
    let salle = {
      name: nom,
      ordi: nbOrdi,
      videoProjecteur: nbVideoProj,
      tableauNumerique: nbTabNum
    }
    return this.http.post(this.ADD_SALLE, salle);
  }

  modifSalle(nom: string, nbOrdi: number, nbVideoProj: number, nbTabNum: number){
    let salle = {
      name: nom,
      ordi: nbOrdi,
      videoProjecteur: nbVideoProj,
      tableauNumerique: nbTabNum
    }
    return this.http.put(this.DELETE_MODIF_SALLE + nom, salle);
  }

  modifProf(lastname: string, name: string, id: number){
    let prof = {
      lastname: lastname,
      name: name
    }
    return this.http.put(this.DELETE_MODIF_PROF + id, prof);
  }

  supprimerSalle(nom: string){
    return this.http.delete(this.DELETE_MODIF_SALLE + nom);
  }

  supprimerProf(id: string){
    return this.http.delete(this.DELETE_MODIF_PROF + id);
  }

  getSalles(): Observable<any[]>{
    return this.http.get<any[]>(this.GET_SALLES);
  } 

  addProf(lastname: string, name: string, identifier: string, password: string){
    let prof = {
      lastname: lastname,
      name: name,
      identifier: identifier,
      password: password
    }
    this.http.post(this.ADD_PROF, prof).subscribe(
      (response) => {
        this.toastr.success("le professeur " + name + " à bien été ajouté");
      },
      (error) => {
        this.toastr.error("erreur");
      }
    );
  }

  getGroupes(){
    let groupes : any[] = [];

    this.http.get<any[]>(this.GET_GROUPES).subscribe(
      (data: any[]) => {
        for (const item of data) {
          groupes.push(item);
        }
      },
      (error) => {
        console.error(error);
        // Gérez l'erreur si nécessaire
      }
    );

    return groupes;
  }

  getPromotions(){
    let promotions : any[] = [];

    this.http.get<any[]>(this.GET_PROMOTIONS).subscribe(
      (data: any[]) => {
        for (const item of data) {
          promotions.push(item);
        }
      },
      (error) => {
        console.error(error);
        // Gérez l'erreur si nécessaire
      }
    );

    return promotions;
  }

  getProfs(): Observable<any[]>{
    return this.http.get<any[]>(this.GET_PROFS);
  }


  addEleve(nom: string, prenom: string, numINE: string, identifiant: string, password: string){
    let eleve = {
      nom: nom,
      prenom: prenom,
      numINE: numINE, 
      identifier : identifiant,
      password : password
    }
    //this.eleves.push(eleve);
  }

  getEleves(){
    //return this.eleves;
  }

  addCours(title:string, salle: string, professeur: string, groupe:number, debut: Date, fin: Date, headers: HttpHeaders){
    let coursToAdd = {
      initial_ressource: title,
      name_salle: salle,
      initial_enseignant: professeur,
      id_group: groupe,
      start_time: debut.toISOString(),
      end_time: fin.toISOString()
    }

    this.http.post(this.ADD_COURS, coursToAdd, { headers })
    .subscribe(
      (data) => {
        console.log("Le cours a bien été ajouté : ", data);
      },
      (error) => {
        console.error("Le cours n'a pas pu être ajouter : ", error);
      }
    );
  }

  getCours(){
    // à remplacer avec l'appel à l'api
    // const event1 = {
    //   title: "Prog avancée",
    //   salle: "A1-01",
    //   professeur: "abossard",
    //   groupe: "BUT INFO",
    //   color: {
    //     primary: '#ad2121',
    //     secondary: '#FAE3E3',
    //   },
    //   start: new Date("2023-11-07T10:30"),
    //   end: new Date("2023-11-07T12:30"),
    //   draggable: true,
    //   resizable: {
    //     beforeStart: true,
    //     afterEnd: true,
    //   }
    // }
    let cours : any[] = [];

    this.http.get<any[]>(this.GET_COURS).subscribe(
      (data: any[]) => {
        for (const item of data) {
          cours.push(item);
        }
      },
      (error) => {
        console.error(error);
        // Gérez l'erreur si nécessaire
      }
    );

    return cours;
  }
}
