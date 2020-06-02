import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserInterface } from '../../models/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {
  user: UserInterface;
  constructor(
    public _authService: AuthService,
    public router: Router
  ) { }

  ngOnInit() {
    this.user = this._authService.user;
  }
  search( term: string) {
    this.router.navigate(['/search', term]);
  }
}
