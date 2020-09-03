import {Component, OnInit} from '@angular/core';
import {UserDetails} from '../../user_details';
import {ApiService} from '../../ApiService';
import {FormControl, FormGroup} from '@angular/forms';

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

  constructor(private api: ApiService) {
    this.postForm = new FormGroup({
      description: new FormControl(),
      city: new FormControl()
    });
  }

  ngOnInit(): void {
    this.initDetails();
  }

  initDetails(): void {
    this.userDetails = new UserDetails('', '', '',
      '', '', '', '', '', '', '');
    this.api.getUserDetails()
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

}
