import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class EdtService{

  //Décommentez si vous utilisez python pour lancer le back-end
  // ADD_PROF = 'http://localhost:5000/teacher';
  // GET_PROFS = 'http://localhost:5000/teachers';
  // GET_SALLES = 'http://localhost:5000/salles'
  // GET_RESSOURCES = 'http://localhost:5000/ressources';

  // profs
  ADD_PROF = 'http://localhost:8000/teacher';
  GET_PROFS = 'http://localhost:8000/teachers';
  // salles
  GET_SALLES = 'http://localhost:8000/salles';
  ADD_SALLE = 'http://localhost:8000/salle';
  DELETE_SALLE = 'http://localhost:8000/salle/'; // + nom de la salle
  //ressources
  GET_RESSOURCES = 'http://localhost:8000/ressources';
  
  constructor(private http: HttpClient, private toastr: ToastrService) {
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
    this.http.post(this.ADD_SALLE, salle).subscribe(
      (response) => {
        return this.toastr.success("la salle " + nom + " à bien été ajouté");
      },
      (error) => {
        return this.toastr.error("erreur");
      }
    );
  }

  supprimerSalle(nom: string){
    this.http.delete(this.DELETE_SALLE + nom).subscribe(
      (response) => {
        this.toastr.success("la salle " + nom + " à bien été supprimée");
      },
      (error) => {
        this.toastr.error("erreur");
      }
    );
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
      }
    );

    return salles;
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
    //this.eleves.push(eleve);
  }

  getEleves(){
    //return this.eleves;
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
