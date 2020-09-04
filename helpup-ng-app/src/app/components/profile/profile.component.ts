import {Component, OnInit} from '@angular/core';
import {UserDetails} from '../../user_details';
import {ApiService} from '../../ApiService';
import {FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute} from "@angular/router";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userDetails: UserDetails;
  editMode: boolean;
  onPhotoMode: boolean;
  postForm: FormGroup;

  constructor(private api: ApiService, private route: ActivatedRoute, private cookies: CookieService) {
    this.postForm = new FormGroup({
      description: new FormControl(),
      city: new FormControl(),
      education: new FormControl(),
      job: new FormControl()
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(
      () => {
        this.initDetails();
      }
    )
  }

  initDetails(): void {
    this.userDetails = new UserDetails('', '', '',
      '', '', '', '', '', '', '');

    this.api.getUserDetails(this.route.snapshot.params.username)
      .subscribe(
        (data: UserDetails) => {
          this.userDetails = data;
        });
  }


  editDetails(): void {
    this.editMode = true;
  }

  saveEdit(): void {
    this.editMode = false;

    
  }

  isMine(): boolean {
    return this.cookies.get('username') === this.userDetails.username;
  }

}
