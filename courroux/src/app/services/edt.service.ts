import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EdtService {

  constructor() { }

  getNoms(){
    // à remplacer avec l'appel à l'api
    let noms = ["prog avancée", "dev web", "SAE", "prog mulrimedia"];
    return noms;
  }

  getProfs(){
    // à remplacer avec l'appel à l'api
    let profs = ["abossard", "ggroff", "aricordaux", "msimonot"];
    return profs;
  }

  getSalles(){
    // à remplacer avec l'appel à l'api
    let salles = ["A1-01", "B1-13", "D1-12", "A2-04"];
    return salles;
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
