import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {UserDetails} from '../../user_details';
import {ApiService} from '../../ApiService';
import {FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';

interface Post {
  id: number;
  description: string;
  username: string;
  image: any;
  date: Date;
  editMode: boolean;
  profilepic: any;
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

  constructor(private apiService: ApiService, private activatedRoute: ActivatedRoute, private cookies: CookieService) {
    this.profileForm = new FormGroup({
      description: new FormControl(),
      city: new FormControl(),
      education: new FormControl(),
      job: new FormControl()
    });
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(
      () => {
        this.initDetails();
      });
  }



  public onFileChanged(event): void {
    this.selectedFile = event.target.files[0];
    this.userDetails.profilepic = event.target.files[0];
    const uploadData = new FormData();
    uploadData.append('imageFile', this.selectedFile);
    uploadData.append('username', this.userDetails.username);
    this.apiService.editProfilePicture(uploadData).subscribe(data => {
      this.userDetails.profilepic = this.translateImage(this.userDetails.profilepic);
      this.initDetails();
    });
  }

  initDetails(): void {
    this.userDetails = new UserDetails('', '', '',
      '', '', '', '', '', '', '', '');

    this.apiService.getUserDetails(this.activatedRoute.snapshot.params.username)
      .subscribe(
        (data: UserDetails) => {
          this.userDetails = data;
          this.userDetails.profilepic = this.translateImage(this.userDetails.profilepic);
          this.getPosts();
        });
  }

  editDetails(): void {
    this.editMode = true;
  }

  saveEdit(): void {
    this.editMode = false;
    const editedUser = new UserDetails(this.userDetails.username, this.userDetails.firstname, this.userDetails.lastname,
      null, this.userDetails.city, this.userDetails.education, this.userDetails.job, this.userDetails.gender, this.userDetails.description,
      this.userDetails.birthday, this.userDetails.phonenumber);
    this.apiService.editUserDetails(editedUser).subscribe();
  }

  getPosts(): void {
    this.apiService.getPostsOfUser(this.userDetails.username)
      .subscribe((data: Post[]) => {
        this.retrievedPosts = data;

        for (const post of this.retrievedPosts) {
          this.getProfilePicture(post);
        }
      });
  }

  getProfilePicture(post: Post): boolean {
    this.apiService.getProfilePicture(post.username).subscribe(data => {
        post.profilepic = this.translateImage(data.image);
      },
      () => {
      }
    );
    return true;
  }

  editPost(userId, description): void {
    this.apiService.editPost(userId, description);
  }

  saveDescriptionAfterEdit(post: Post, newDescription: string): void {
    post.editMode = false;
    if (post.description !== newDescription) {
      post.description = newDescription;
      this.editPost(post.id, post.description);
    }
  }

  deletePost(idPost: number): void {
    this.apiService.deletePost(idPost).subscribe(() => {
      this.getPosts();
    });
  }


  translateImage(image: any): any {
    return 'data:image/jpeg;base64,' + image;
  }

  translateTime(date: Date): any {
    const yearsAndMonths = date.toString().substring(0, 8);
    const day = date.toString().substring(8, 10);
    return yearsAndMonths + (Number(day) + 1);
  }

  isMine(): boolean {
    return this.cookies.get('username') === this.userDetails.username;
  }

  isAdmin(): boolean {
    return this.cookies.get('username').includes('admin');
  }

}
