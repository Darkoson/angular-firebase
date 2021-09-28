import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, DocumentData,} from '@angular/fire/compat/firestore';
import { collection, Firestore } from '@angular/fire/firestore';
import { collectionData } from 'rxfire/firestore';
import { Observable } from 'rxjs';

interface Item {
  name: string,
  age: number
};


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
 

  constructor(
    public afAuth: AngularFireAuth, 
    public firestore: AngularFirestore
    ) { 
  }


  logout(){
     this.afAuth.signOut()
  }


  ngOnInit(){

  }

}
