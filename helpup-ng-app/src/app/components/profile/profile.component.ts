import {Component, OnInit} from '@angular/core';
import {UserDetails} from '../../user_details';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userDetails: UserDetails;

  constructor() {
    this.userDetails = this.initDetails();
  }

  ngOnInit(): void {

  }

  initDetails(): UserDetails {
    return {
      username: 'malinabenegui',
      first_name: 'Malina',
      last_name: 'Benegui',
      city: 'Bucharest',
      education: 'Faculty of Mathematics and Computer Science',
      job: 'Developer at HelpUp',
      gender: 'female',
      description: 'Enthusiast person willing to help others',
      date_of_birth: '24/08/1998',
    };
  }

}
