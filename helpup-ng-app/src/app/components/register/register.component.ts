import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {FormControl, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {ApiService} from '../../ApiService';

class User {
  private id: number;
  private username: string;
  private password: string;
  private email: string;

  constructor(username: string, password: string, email: string) {
    this.username = username;
    this.password = password;
    this.email = email;
  }

}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  regForm: FormGroup;
  emailOrUsernameExistsMessage: string;

  constructor(private http: HttpClient, private router: Router, private cookie: CookieService, private apiservice: ApiService) {
    this.regForm = new FormGroup({
      username: new FormControl(),
      mail: new FormControl(),
      pass: new FormControl()
    });
    this.emailOrUsernameExistsMessage = '';
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    const username = this.regForm.get('username').value;
    const mail = this.regForm.get('mail').value;
    const pass = this.regForm.get('pass').value;
    this.emailOrUsernameExistsMessage = this.apiservice.postUser(username, mail, pass);
  }
}
