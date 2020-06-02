import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
declare function init_plugins();
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  isError = false;
  constructor(
    public _authService: AuthService,
    public afAuth: AngularFireAuth,
    private router: Router,
  ) { }

  ngOnInit(): void {
    init_plugins();
  }
  onLogin() {
    this._authService.loginEmailUser(this.email, this.password).then((res) => {
      this.onLoginRedirect();
    });
  }
  onLoginFacebook() {}
  onLoginGoogle() {}

  private onLoginRedirect() {
    this.router.navigate(['/dashboard']);
  }
}
