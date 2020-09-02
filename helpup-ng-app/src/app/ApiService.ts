import {HttpClient} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';
import {Injectable, OnInit} from '@angular/core';
import {Observable} from 'rxjs';

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
  private USER_POSTING_URL = `${this.BASE_URL}/post/upload`;
  private GET_ALL_POSTS_URL = `${this.BASE_URL}/post/all`;
  private EDIT_POST_URL = `${this.BASE_URL}/post/edit`;
  private DELETE_POST_URL = `${this.BASE_URL}/post/delete`;
  private GET_USERNAME_FROM_JWT = `${this.BASE_URL}/jwt/username`;
  private USERNAME: string;

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
          this.whoAmI().subscribe(username => {
            this.cookies.set('username', username.registerResponseMessage);
          });
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

  /*** adding a new post**/
  addNewPost(uploadData: FormData): void {
    this.whoAmI().subscribe(username => {
      uploadData.append('user_username', this.cookies.get('username'));
      this.http.post(this.USER_POSTING_URL, uploadData, {
        observe: 'response', headers: this.generateAuthorizeBearerJWT()
      })
        .subscribe((data) => {
          },
          (error => {
            console.log(error);
          })
        );
    });
  }

  /*** this function returns an observable where on subscribe will come the list of all posts**/
  getAllPosts(): Observable<any> {
    const username = this.http.get('http://localhost:8080/jwt/username', {
      headers: this.generateAuthorizeBearerJWT()
    });
    return this.http.get(this.GET_ALL_POSTS_URL, {
      headers: this.generateAuthorizeBearerJWT()
    });
  }

  /*** this function appends to 'Bearer', the jwt, resulting an authorize header**/
  generateAuthorizeBearerJWT(): { Authorization: string } {
    return {
      Authorization: 'Bearer ' + this.cookies.get('jwt')
    };
  }

  editPost(idNr: number, desc: string): void {
    const body = {
      id: idNr,
      description: desc
    };
    this.http.post(this.EDIT_POST_URL, body, {headers: this.generateAuthorizeBearerJWT()}).subscribe();
  }
  deletePost(idNr: number): void {
    const body = {
      id: idNr
    };
    this.http.post(this.DELETE_POST_URL, body, {headers: this.generateAuthorizeBearerJWT()}).subscribe();
  }

  whoAmI(): Observable<any> {
    return this.http.get(this.GET_USERNAME_FROM_JWT, {headers: this.generateAuthorizeBearerJWT()});
  }
}
