import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { UserInterface } from '../../models/user';
declare function init_plugins();
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  @ViewChild('imageUser') inputImageUser: ElementRef;
  email = '';
  password = '';
  isError = false;
  user: UserInterface = {
    name: '',
    lastname: '',
    email: '',
    password: '',
    roles: {
      patient: true
    }
  };
  uploadPercent: Observable<number>;
  urlImage: Observable<string>;
  msgError = '';
  constructor(
    private router: Router,
    private authService: AuthService,
    private storage: AngularFireStorage
  ) { }

  ngOnInit(): void {
    init_plugins();
  }

  onUpload(e) {
    const id = Math.random().toString(36).substring(2);
    const file = e.target.files[0];
    const filePath = `uploads/profile_${id}`;
    const ref = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);
    // indica el porcentaje de subida del archivo
    this.uploadPercent = task.percentageChanges();
    debugger
    task.snapshotChanges()
      .pipe(finalize(() => this.urlImage = ref.getDownloadURL())).subscribe();
  }
  onAddUser() {
    this.authService.registerUser(this.user)
      .then(res => {
        this.authService.isAuth().subscribe(user => {
          if (user) {
            debugger
            user.updateProfile({
              displayName: this.user.name,
              photoURL: this.inputImageUser.nativeElement.value
            }).then(() => {
              this.router.navigate(['/user/login']);
            }).catch((error) => console.log('error', error));
          }
        });
      }).catch(err => console.log('err', err.message));
  }

  onLoginFacebook() { }
  onLoginGoogle() { }
}
