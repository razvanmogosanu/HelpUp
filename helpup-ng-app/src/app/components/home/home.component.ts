import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormControl, FormGroup} from '@angular/forms';
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';
import {ApiService} from '../../ApiService';

interface Post {
  description: string;
  userId: number;
  image: any;
  date: Date;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  postForm: FormGroup;

  constructor(private httpClient: HttpClient, private cookies: CookieService, private router: Router, private apiService: ApiService) {
    this.postForm = new FormGroup({
      description: new FormControl(),
    });
    this.retrievedPosts = new Array<Post>();
  }

  selectedFile: File;
  retrievedPosts: Post[];

  public onFileChanged(event): void {
    this.selectedFile = event.target.files[0];
  }

  onUpload(): void {
    const description = this.postForm.get('description').value;

    const uploadData = new FormData();
    uploadData.append('imageFile', this.selectedFile, this.selectedFile.name);
    uploadData.append('description', description);
    this.apiService.addNewPost(uploadData);
    this.postForm.reset();
  }

  getPosts(): void {
    this.apiService.getAllPosts()
      .subscribe((data: Post[]) => {
        this.retrievedPosts = data;
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

  edit(userId, description): void
  {
    this.apiService.editPost(userId, description);
  }

  ngOnInit(): void {
    if (this.cookies.get('jwt').length > 100) {
      this.getPosts();
    } else {
      this.router.navigateByUrl('login');
    }
  }
}
