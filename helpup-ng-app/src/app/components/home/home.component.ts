import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  strings: string[];

  constructor(private http: HttpClient) {
    // this.getString();
  }

  ngOnInit(): void {
  }

  public getString(): void {
    const url = 'http://localhost:8080/all';
    this.http.get<string[]>(url).subscribe(
      res => {
        this.strings = res;
      },
      error => {
        alert('An error has occured;');
      }
    );
  }
}
