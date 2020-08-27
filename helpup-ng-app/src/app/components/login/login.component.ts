import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';
import {ApiService} from '../../ApiService';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {
  regForm: FormGroup;

  constructor(private http: HttpClient, private cookies: CookieService, private router: Router, private apiService: ApiService) {
    this.regForm = new FormGroup({
      username: new FormControl(),
      password: new FormControl()
    });
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    const username = this.regForm.get('username').value;
    const password = this.regForm.get('password').value;
    this.apiService.authUser(username, password);
  }
}
