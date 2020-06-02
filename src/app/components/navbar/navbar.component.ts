import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  app_name = 'ClinicaOnline';
  isLogged = false;
  constructor(
    public _authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  onLogout() {
    this._authService.logoutUser();
  }
}
