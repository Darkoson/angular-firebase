import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userLoggedIn: boolean;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore
  ) {
    this.userLoggedIn = false;
    afAuth.onAuthStateChanged((user) => {
      if (user) {
        this.userLoggedIn = true;
      } else {
        this.userLoggedIn = false;
      }
    });
  }

  loginUser(email: string, password: string): Promise<any> {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log("[Auth service] signin success");
        this.router.navigate(['/dashboard']);
      })

      .catch((err) => {
        console.log('[Auth service] signin error');
        console.log('error code :', err.code);
        return (err.code)?  { isValid: false, message: err.message } : {isValid: false, message: "no message"};
      });
  }

  signupUser(user: any): Promise<any> {
    return this.afAuth
      .createUserWithEmailAndPassword(user.email, user.password)
      .then((result) => {
        let email_lower= user.email.toLowerCase();
        this.afs.doc('/users/'+email_lower)
        .set({
          accountType: 'endUser',
          displayName: user.displayName,
          displayName_lower: user.displayName.toLowerCase(),
          email: user.email,
          email_lower: email_lower,
        })
        if(result && result.user){
          result.user.sendEmailVerification()
          console.log("[Auth service] signup success");
        }

        

      })
      .catch((err) =>{
        console.log("[Auth service] sign up error", err);
        return (err.code)?  { isValid: false, message: err.message } : {isValid: false, message: "no message"};
      })
  }

  resetPassword(email:string): Promise<any> {
   
    return this.afAuth.sendPasswordResetEmail(email)
    .then((result) => {
      console.log("[Auth service] pasword reset email sent with success");
    })
    .catch((err) =>{
      console.log("[Auth service] password reset email sent with error..", err);
      return (err.code)?  { isValid: false, message: err.message } : {isValid: false, message: "no message"};

    })
  }

  async resendVerificationEmail(email:string): Promise<any> {
    const currentUser = await this.afAuth.currentUser ;
    if(currentUser){ 
      return currentUser.sendEmailVerification()
      .then((result) => {
        console.log("[Auth service] Email verification RESEND with success");
      })
      .catch((err) =>{
        console.log("[Auth service] Email verification RESEND with error", err);
        return (err.code)?  { isValid: false, message: err.message } : {isValid: false, message: "no message"};
      })
      console.log("[Auth service] signup success");
    }

   
  }


  logoutUser(): Promise<any> {
    return this.afAuth.signOut()
    .then((result) => {
      console.log("[Auth service] logout success");
      this.router.navigate(['/home'])
    })
    .catch((err) =>{
      console.log("[Auth service] logout with error..", err);
      return (err.code)?  { isValid: false, message: err.message } : {isValid: false, message: "no message"};
    })
  }

  setUserInfo(payLoad: object): Promise<any> {
    console.log("[Auth service] saving user details..");

    return this.afs.collection('users').add(payLoad)
    .then((result) => {
      console.log("[Auth service] details saved:"); 
      console.log(result); 
    })
    .catch((err) =>{
      console.log("[Auth service] logout with error..", err);
      return (err.code)?  { isValid: false, message: err.message } : {isValid: false, message: "no message"};
    })
  }


}
