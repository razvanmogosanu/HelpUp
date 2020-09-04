import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {FormControl, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';
import {ApiService} from '../../ApiService';
import {map} from "rxjs/operators";
import {throwError} from "rxjs";


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

    this.apiservice.postUser(username, mail, pass)
      .pipe(map(data => {
        if (data == null) throwError("nulldata");
      }))
      .subscribe(
      () => {
        this.apiservice.authUser(username, pass);
      },
      (error) => {
        this.emailOrUsernameExistsMessage = error.error.string;
      }
    );

  }
}
