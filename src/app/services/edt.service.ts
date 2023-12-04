import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject} from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class EdtService{

  //Décommentez si vous utilisez python pour lancer le back-end
  // ADD_PROF = 'http://localhost:5000/teacher';
  // GET_PROFS = 'http://localhost:5000/teachers';
  // GET_SALLES = 'http://localhost:5000/salles'
  // GET_RESSOURCES = 'http://localhost:5000/ressources';

  ADD_PROF = 'http://localhost:8000/teacher';
  GET_PROFS = 'http://localhost:8000/teachers';
  GET_SALLES = 'http://localhost:8000/salles'
  GET_RESSOURCES = 'http://localhost:8000/ressources';

  ressources : any[] = [];
  profs : any[] = [];
  salles : any[] = [];
  eleves : any[] = []; 
  
  constructor(private http: HttpClient) {
  }

  addRessource(nom: string, couleur: string){
      let res = {
        nom: nom,
        couleur: couleur
      }
    this.ressources.push(res);
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
    this.salles.push(salle)
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

  addEleve(nom: string, prenom: string, numINE: string){
    let eleve = {
      nom: nom,
      prenom: prenom,
      numINE: numINE
    }
    this.eleves.push(eleve);
  }

  getEleves(){
    return this.eleves;
  }

  getCours(){
    // à remplacer avec l'appel à l'api
    const event1 = {
      title: "Prog avancée",
      salle: "A1-01",
      professeur: "abossard",
      color: {
        primary: '#ad2121',
        secondary: '#FAE3E3',
      },
      start: new Date("2023-11-07T10:30"),
      end: new Date("2023-11-07T12:30"),
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      }
    }
    let cours = [event1];
    return cours;
  }
}
