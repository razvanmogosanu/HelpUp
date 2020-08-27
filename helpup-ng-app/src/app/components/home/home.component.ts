import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormControl, FormGroup} from '@angular/forms';
import {CookieService} from 'ngx-cookie-service';
import {Router} from '@angular/router';

class Post {
  public description: string;
  public image: any;
  public date: Date;

  constructor(description: string, image: any) {
    this.description = description;
    this.image = image;
  }
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  postForm: FormGroup;

  constructor(private httpClient: HttpClient, private cookies: CookieService, private router: Router) {
    this.postForm = new FormGroup({
      description: new FormControl(),
    });
    this.retrievedPosts = new Array<Post>();
  }

  selectedFile: File;
  message: string;
  retrievedPosts: Post[];

  public onFileChanged(event): void {
    this.selectedFile = event.target.files[0];
  }

  onUpload(): void {
    const description = this.postForm.get('description').value;

    const uploadImageData = new FormData();
    uploadImageData.append('imageFile', this.selectedFile, this.selectedFile.name);
    uploadImageData.append('description', description);

    this.httpClient.post('http://localhost:8080/post/upload', uploadImageData, {observe: 'response'})
      .subscribe((response) => {
        this.message = (response.status === 200) ? 'Image uploaded successfully' : 'Image not uploaded successfully';
      });
    this.postForm.reset();
  }

  getPosts(): void {
    const auth = 'Bearer ' + this.cookies.get('jwt');
    this.httpClient.get('http://localhost:8080/post/all', {
      headers: {
        Authorization: auth
      }
    })
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

  ngOnInit(): void {
    if (this.cookies.get('jwt').length > 100) {
      this.getPosts();
    } else {
      this.router.navigateByUrl('login');
    }
  }
}
