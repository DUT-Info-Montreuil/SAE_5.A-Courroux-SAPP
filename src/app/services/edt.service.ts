import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EdtService{

  ADD_PROF = 'http://localhost:5000/teacher';
  GET_PROFS = 'http://localhost:5000/teacher/getAll';

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
    // à remplacer avec l'appel à l'api
    return this.ressources;
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
    return this.http.get(this.GET_PROFS)
  }

  addProf(nom: string, prenom: string, nbHeurePrevisionnel: string){
    let credentials = {}
  }

  getProfs(){
    
    return this.profs;
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
