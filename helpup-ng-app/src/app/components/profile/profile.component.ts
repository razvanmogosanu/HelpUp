import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UserDetails} from '../../user_details';
import {ApiService} from '../../ApiService';
import {FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';

interface Post {
  id: number;
  description: string;
  username: string;
  image: any;
  date: Date;
  editMode: boolean;
  toggle: any;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userDetails: UserDetails;
  editMode: boolean;
  onPhotoMode: boolean;
  profileForm: FormGroup;
  selectedFile: File;
  retrievedPosts: Post[];

  constructor(private apiService: ApiService, private route: ActivatedRoute, private cookies: CookieService) {
    this.profileForm = new FormGroup({
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
      });
    console.log(this.userDetails);
  }

  public onFileChanged(event): void {
    this.selectedFile = event.target.files[0];
    this.userDetails.profilepic = event.target.files[0];
  }

  initDetails(): void {
    this.userDetails = new UserDetails('', '', '',
      '', '', '', '', '', '', '', '');

    this.apiService.getUserDetails(this.route.snapshot.params.username)
      .subscribe(
        (data: UserDetails) => {
          this.userDetails = data;
          this.getPosts();
        });
  }

  editDetails(): void {
    this.editMode = true;
  }

  saveEdit(): void {
    this.editMode = false;
    this.apiService.editUserDetails(this.userDetails).subscribe();
  }


  getPosts(): void {
    this.apiService.getPostsOfUser(this.userDetails.username)
      .subscribe((data: Post[]) => {
        this.retrievedPosts = data;
        console.log(data);
      });
  }

  translateImage(image: any): any {
    // return 'data:image/jpeg;base64,' + image;
    console.log(image);
    return image;
  }

  translateTime(date: Date): any {
    const yearsAndMonths = date.toString().substring(0, 8);
    const day = date.toString().substring(8, 10);
    return yearsAndMonths + (Number(day) + 1);
  }

  isMine(): boolean {
    return this.cookies.get('username') === this.userDetails.username;
  }

}
