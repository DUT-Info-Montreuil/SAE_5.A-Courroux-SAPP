import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable, OnInit } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { BehaviorSubject, Observable, Subject} from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class EdtService{

  //Décommentez si vous utilisez python pour lancer le back-end
  // ADD_COURS = 'http://localhost:5000/cours/create';
  // ADD_PROF = 'http://localhost:5000/teacher';
  // GET_PROFS = 'http://localhost:5000/teachers';
  // GET_SALLES = 'http://localhost:5000/salles'
  // GET_RESSOURCES = 'http://localhost:5000/ressources';
  // GET_GROUPES = 'http://localhost:5000/groupes';
  // GET_PROMOTIONS = 'http://localhost:5000/promotions';
  ///home/drgenc/Cours/S5/Courroux/SAE_5.A-Courroux-SAPP/node_modules/calendar-utils/calendar-utils.d.ts

  ADD_COURS = 'http://localhost:8000/course';
  ADD_PROF = 'http://localhost:8000/teacher';
  GET_COURS = 'http://localhost:8000/courses';
  GET_PROFS = 'http://localhost:8000/teachers';
  GET_SALLES = 'http://localhost:8000/salles'
  GET_RESSOURCES = 'http://localhost:8000/ressources';
  GET_GROUPES = 'http://localhost:8000/groupes';
  GET_PROMOTIONS = 'http://localhost:8000/promotions';
  
  constructor(private http: HttpClient) {
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

  addSalle(nom: string, nbOrdi: string, nbVideoProj: string, nbTabNum: string){
    let salle = {
      nom: nom,
      nbOrdi: nbOrdi,
      nbVideoProj: nbVideoProj,
      nbTabNum: nbTabNum
    }
    //this.salles.push(salle)
  }

  getSalles(){

    let salles : any[] = [];
    
    this.http.get<any[]>(this.GET_SALLES).subscribe(
      (data: any[]) => {
        for (const item of data) {
          salles.push(item);
        }
      },
      (error) => {
        console.error(error);
        // Gérez l'erreur si nécessaire
      }
    );

    return salles;
  } 

  addProf(nom: string, prenom: string, nbHeurePrevisionnel: string){
    let credentials = {}
  }

  getProfs(){
    let profs : any[] = [];

    this.http.get<any[]>(this.GET_PROFS).subscribe(
      (data: any[]) => {
        for (const item of data) {
          profs.push(item);
        }
      },
      (error) => {
        console.error(error);
        // Gérez l'erreur si nécessaire
      }
    );

    return profs;
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

  addEleve(nom: string, prenom: string, numINE: string){
    let eleve = {
      nom: nom,
      prenom: prenom,
      numINE: numINE
    }
    //this.eleves.push(eleve);
  }

  getEleves(){
    //return this.eleves;
  }

  addCours(title:string, salle: string, professeur: string, groupe:number, debut: string, fin: string, headers: HttpHeaders){
    let coursToAdd = {
      initial_ressource: title,
      name_salle: salle,
      initial_enseignant: professeur,
      id_group: groupe,
      start_time: debut,
      end_time: fin
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
    let cours : CalendarEvent[] = [];

    this.http.get<any[]>(this.GET_COURS).subscribe(
      (data: any[]) => {
        for (const item of data) {
          const newEvent: CalendarEvent = {
            id: item.id,
            start: new Date(item.start_time),
            end: new Date(item.end_time),
            title: item.initial_ressource,
            salle: item.name_salle,
            professeur: String(item.id_enseignant),
            groupe: item.id_group,
            is_published: item.is_published,
            color: {
              primary: '#FFFFFF',
              secondary: '#000000',
            },
            draggable: true,
            resizable: {
              beforeStart: true,
              afterEnd: true,
            }
          }
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
