import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {Observable} from "rxjs";

interface TokenFormat {
  jwt: any;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private BASE_URL = 'http://localhost:8080';
  private AUTH_USER_URL = `${this.BASE_URL}/auth`;
  private POST_USER_URL = `${this.BASE_URL}/register`;

  constructor(private http: HttpClient, private cookies: CookieService, private router: Router) {
  }

  /**
   * this function is used to validate the credentials and get the authentication token, in case the credentials are correct.
   * if the credentials are ok and the log in process comes to success, then attach the token into cookies and navigate to home
   * otherwise, console.log the error
   */
  authUser(usernameParam: string, passwordParam: string): void {
    this.http.post(this.AUTH_USER_URL, this.generateAuthUserBody(usernameParam, passwordParam))
      .subscribe((token: TokenFormat) => {
          this.cookies.set('jwt', token.jwt);
          this.router.navigateByUrl('');
        },
        error1 => {
          console.log(error1);
        }
      );
  }

  /** Used to parse the needed json */
  generateAuthUserBody(usernameParam: string, passwordParam: string): any {
    return {
      username: usernameParam,
      password: passwordParam
    };
  }

  /**
   * this function should add a new user in the database(method="POST")
   */
  postUser(usernameParam: string, emailParam: string, passwordParam: string): Observable<any> {
    const user = {
      username: usernameParam,
      email: emailParam,
      password: passwordParam
    };

    return this.http.post(this.POST_USER_URL, user);
  }
}
