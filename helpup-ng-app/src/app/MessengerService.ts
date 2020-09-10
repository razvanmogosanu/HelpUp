import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MessengerService{
  private BASE_URL = 'http://localhost:8080';
  private GET_CONVERSATION_HISTORY = `${this.BASE_URL}/messenger/getConversationHistory`;
  private ADD_NEW_MESSAGE = `${this.BASE_URL}/messenger/addMessage`;

  constructor(private http: HttpClient, private cookies: CookieService) {

  }

  getConversationHistory(): Observable<any> {
    const body = {};
    return this.http.post(this.GET_CONVERSATION_HISTORY, body, {headers: this.generateAuthorizeBearerJWT()});
  }

  addMessage(chat):void {
    console.log(chat);
    this.http.post(this.ADD_NEW_MESSAGE, chat, {headers: this.generateAuthorizeBearerJWT()}).subscribe();
  }

  /*** this function appends to 'Bearer', the jwt, resulting an authorize header**/
  generateAuthorizeBearerJWT(): { Authorization: string } {
    return {
      Authorization: 'Bearer ' + this.cookies.get('jwt')
    };
  }




}
