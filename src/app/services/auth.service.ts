import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { UserInterface, Roles } from '../models/user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: UserInterface;
  constructor(
    private router: Router,
    private afsAuth: AngularFireAuth,
    private afs: AngularFirestore
  ) { }

  registerUser(user: UserInterface) {
    return new Promise((resolve, reject) => {
      this.afsAuth.createUserWithEmailAndPassword(user.email, user.password)
        .then(userData => {
          resolve(userData);
          user.id = userData.user.uid;
          userData.user.sendEmailVerification().then(res => {
            alert('notificacion enviada');
          })
          this.updateUserData(user);
        }).catch(err => reject(err));
    });
  }
  loginEmailUser(email: string, password: string) {
    return new Promise((resolve, reject) => {
      this.afsAuth.signInWithEmailAndPassword(email, password)
      .then(
        userData => {
          if (userData.user.emailVerified) {
            const user = userData.user;
            const roles: Roles = {
              patient: true
            };
            this.saveStorage(
              {
                id: user.uid,
                name: user.displayName,
                lastname: '',
                email: user.email,
                photoUrl: user.photoURL,
                roles
              }
            )
            resolve(userData);
          } else {
            throw new Error('Email no verificado, no puede loguearse');
          }
        },
        err => reject(err)
      );
    });
   }

  loginFacebookUser() { }

  loginGoogleUser() { }

  logoutUser() {
    this.user = null;
    this.afsAuth.signOut();
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
  isAuth() {
    return this.afsAuth.authState.pipe(
      map(auth => auth)
    );
  }
  private updateUserData(user: UserInterface) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.id}`);
    // const data: UserInterface = {
    //   id: user.uid,
    //   email: user.email,
    //   roles: {
    //     patient: true
    //   }
    // };
    return userRef.set(user, { merge: true });
  }
  private saveStorage(user: UserInterface) {
    localStorage.setItem('user', JSON.stringify(user));
    this.user = user;
  }
  private loadStorage() {
    this.user = JSON.parse(localStorage.getItem('user'));
  }
}
