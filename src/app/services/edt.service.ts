import { EventEmitter, Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EdtService{

  ressources : any[] = [];
  profs : any[] = [];
  salles : any[] = [];
  eleves : any[] = []; 
  
  constructor() {
    let res1 = {
      nom: "prog avancée",
      couleur: "#8789ff"
    }
    let res2 = {
      nom: "dev web",
      couleur: "#cb78f5"
    }
    let res3 = {
      nom: "SAE",
      couleur: "#af9dbd"
    }
    let res4 = {
      nom: "prog mulrimedia",
      couleur: "#b02e2e"
    }
    this.ressources.push(res1, res2, res3, res4);
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
    // à remplacer avec l'appel à l'api
    return this.salles;
  }

  addProf(nom: string, prenom: string, nbHeurePrevisionnel: string){
    let prof = {
      nom: nom,
      prenom: prenom,
      nbHeurePrevisionnel: nbHeurePrevisionnel
    }
    this.profs.push(prof);
  }

  getProfs(){
    // à remplacer avec l'appel à l'api
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
