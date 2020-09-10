import {Component, OnInit} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {ApiService} from '../../ApiService';
import {FormControl, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  searchedUsers: any[];
  showDropdown: boolean;
  searchForm: FormGroup;

  constructor(public cookies: CookieService, private api: ApiService, private router: Router) {
    this.searchForm = new FormGroup({
      searchField: new FormControl()
    });
  }

  ngOnInit(): void {
  }

  logout(): void {
    this.cookies.delete('jwt');
    this.cookies.delete('username');
    this.router.navigateByUrl('login');
  }

  onSubmit(): void {
    const searchFilter = this.searchForm.get('searchField').value;
    this.api.searchAfterUsers(searchFilter).subscribe(
      (data) => {
        this.searchedUsers = data;
      }
    );
  }

  translateImage(image: any): any {
    return 'data:image/jpeg;base64,' + image;
  }

  isAdmin(): boolean {
    return this.cookies.get('username').includes('admin');
  }
}
