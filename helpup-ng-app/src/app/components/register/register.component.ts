import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {FormControl, FormGroup} from '@angular/forms';
import {Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';

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
  emailOrUsernameExists: boolean;
  emailOrUsernameExistsMessage: string;

  constructor(private http: HttpClient, private router: Router, private cookie: CookieService) {
    this.regForm = new FormGroup({
      username: new FormControl(),
      mail: new FormControl(),
      pass: new FormControl()
    });
    this.emailOrUsernameExists = false;
    this.emailOrUsernameExistsMessage = '';
  }

  ngOnInit(): void {
  }

  postUser(usernameParam: string, emailParam: string, passwordParam: string): void {
    const user = new User(usernameParam, emailParam, passwordParam);
    const options = new HttpParams()
      .set('username', usernameParam)
      .set('email', emailParam)
      .set('password', passwordParam);

    let postResponse = '';
    this.http.post('http://localhost:8080/add', user, {params: options}).subscribe(
        data => {

        },
        (error: ErrorEvent) => {
          postResponse = error.error.text;
          if (postResponse.includes('mail')) {
            this.emailOrUsernameExists = true;
            this.emailOrUsernameExistsMessage = 'mail already exists';
          }
          if (postResponse.includes('username')) {
            this.emailOrUsernameExists = true;
            this.emailOrUsernameExistsMessage = 'username already exists';
          }
          if (postResponse.includes('accepted')) {
            this.emailOrUsernameExists = false;
          }
          if (!this.emailOrUsernameExists) {
            this.http.post('http://localhost:8080/auth', {
              username: usernameParam,
              password: passwordParam
            }).subscribe((token: {
                jwt: string
              }) => {
                this.cookie.set('jwt', token.jwt);
                this.router.navigateByUrl('');
              },
              error1 => {
                console.log(error1);
              }
            );
          }
        }
      );
  }

  onSubmit(): void {
    const username = this.regForm.get('username').value;
    const mail = this.regForm.get('mail').value;
    const pass = this.regForm.get('pass').value;
    this.postUser(username, mail, pass);
  }
}
