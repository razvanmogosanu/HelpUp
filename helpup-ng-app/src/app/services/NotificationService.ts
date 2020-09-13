import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class NotificationService {
  private BASE_URL = 'http://localhost:8080';
  private GET_NO_OF_NOTIFICATIONS = `${this.BASE_URL}/messenger/getNotifications`;

  constructor(private http: HttpClient, private cookies: CookieService) {
  }

  getNrOfNotifications(): Observable<any> {
    return this.http.get(this.GET_NO_OF_NOTIFICATIONS, {headers: this.generateAuthorizeBearerJWT()});
  }

  generateAuthorizeBearerJWT(): { Authorization: string } {
    return {
      Authorization: 'Bearer ' + this.cookies.get('jwt')
    };
  }
}
