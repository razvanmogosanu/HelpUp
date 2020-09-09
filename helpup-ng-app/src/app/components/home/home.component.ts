import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormControl, FormGroup} from '@angular/forms';
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';
import {ApiService} from '../../ApiService';

interface Post {
  id: number;
  description: string;
  username: string;
  image: any;
  date: Date;
  editMode: boolean;
  toggle: any;
  profilepic: any;
  type: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  postForm: FormGroup;
  selectedFile: File;
  retrievedPosts: Post[];
  username: string;
  @ViewChild('fileInput', {static: false})
  myFileInput: ElementRef;
  errorMessage: string;
  selectedType = '';

  constructor(private httpClient: HttpClient, private cookies: CookieService, private router: Router, private apiService: ApiService) {
    this.postForm = new FormGroup({
      description: new FormControl(),
    });
    this.retrievedPosts = new Array<Post>();
    this.errorMessage = '';
  }

  public onFileChanged(event): void {
    this.selectedFile = event.target.files[0];
  }

  onUpload(): void {
    const description = this.postForm.get('description').value;
    const type = this.selectedType;

    if (!description) {
      this.errorMessage = 'Description must be completed.';
    } else if (!this.selectedFile) {
      this.errorMessage = 'Image must be uploaded.';
    } else {
      const uploadData = new FormData();
      uploadData.append('imageFile', this.selectedFile);
      uploadData.append('description', description);
      uploadData.append('type', type);
      this.apiService.addNewPost(uploadData).subscribe(() => {
        this.getPosts();
      });
      this.myFileInput.nativeElement.value = '';
      this.postForm.reset();
      this.errorMessage = '';
    }
  }

  getPosts(): void {
    this.apiService.getAllPosts()
      .subscribe((data: Post[]) => {
        this.retrievedPosts = data;

        for (const post of this.retrievedPosts) {
          this.getProfilePicture(post);
        }
      });
  }

  getFilteredPosts(): Post[]{
    return this.retrievedPosts;
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

  deletePost(idPost: number): void {
    this.apiService.deletePost(idPost).subscribe(() => {
      this.getPosts();
    });
  }

  edit(userId, description): void {
    this.apiService.editPost(userId, description);
  }

  saveDescriptionAfterEdit(post: Post, newDescription: string): void {
    post.editMode = false;
    if (post.description !== newDescription) {
      post.description = newDescription;
      this.edit(post.id, post.description);
    }

  }

  filterByType(type: string, posts: Post[]): Post[] {
    const filteredPosts: Post[] = [];

    for (const post of this.retrievedPosts) {
      if (post.type.includes(type)) {
        filteredPosts.push(post);
      }
    }
    return filteredPosts;
  }

  ngOnInit(): void {
    if (this.cookies.check('jwt')) {
      this.getPosts();
    } else {
      this.router.navigateByUrl('login');
    }
  }

  isMine(post: Post): boolean {
    return this.cookies.get('username') === post.username;
  }

  selectType(event: any): void {
    this.selectedType = event.target.value;
  }

  translateImage(image: any): any {
    return 'data:image/jpeg;base64,' + image;
  }

  translateTime(date: Date): any {
    const yearsAndMonths = date.toString().substring(0, 8);
    const day = date.toString().substring(8, 10);
    return yearsAndMonths + (Number(day) + 1);
  }
}
