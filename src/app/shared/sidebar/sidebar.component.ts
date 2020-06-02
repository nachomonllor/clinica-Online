import { Component, OnInit } from '@angular/core';
import { UserInterface } from '../../models/user';
import { AuthService } from '../../services/auth.service';
import { SidebarService } from './sidebar.service';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {
  user: UserInterface;
  constructor(
    public _sidebar: SidebarService,
    public _authService: AuthService) { }

  ngOnInit() {
    this.user = this._authService.user;
    this._sidebar.loadMenu();
  }

}
