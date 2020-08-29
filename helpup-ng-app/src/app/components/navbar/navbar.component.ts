import { Component, OnInit } from '@angular/core';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(public cookies: CookieService) { }

  ngOnInit(): void {
  }

  logout(): void {
    this.cookies.delete('jwt');
  }
}
