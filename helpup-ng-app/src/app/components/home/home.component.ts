import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {FormControl, FormGroup} from '@angular/forms';

class Post {
  public description: string;
  public image: any;
  public date: any;

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

  constructor(private httpClient: HttpClient) {
    this.postForm = new FormGroup({
      description: new FormControl(),
    });
    this.retrievedPosts = new Array<Post>();
    this.retrieveResponse = new Array<Post>();
  }

  selectedFile: File;
  retrievedImage: any;
  base64Data: any;
  retrieveResponse: any[];
  message: string;
  imageName: any;
  retrievedPosts: Post[];
  response:any;

  // Gets called when the user selects an image
  public onFileChanged(event): void {
    // Select File
    this.selectedFile = event.target.files[0];
  }

  // Gets called when the user clicks on submit to upload the image
  onUpload(): void {
    console.log(this.selectedFile);
    const description = this.postForm.get('description').value;

    // FormData API provides methods and properties to allow us easily prepare form data to be sent with POST HTTP requests.
    const uploadImageData = new FormData();
    uploadImageData.append('imageFile', this.selectedFile, this.selectedFile.name);
    uploadImageData.append('description', description);

    // Make a call to the Spring Boot Application to save the image
    this.httpClient.post('http://localhost:8080/post/upload', uploadImageData, {observe: 'response'})
      .subscribe((response) => {
          if (response.status === 200) {
            this.message = 'Image uploaded successfully';
          } else {
            this.message = 'Image not uploaded successfully';
          }
        }
      );
    this.postForm.reset();
  }

  getPosts(): void {
    // Make a call to Spring Boot to get the Image Bytes.
    this.httpClient.get('http://localhost:8080/post/all')
      .subscribe((data: Post[]) => {
        this.retrievedPosts = data;
      });
  }

  // Gets called when the user clicks on retrieve image button to get the image from back end
  getImage(): void {
    // Make a call to Spring Boot to get the Image Bytes.
    this.httpClient.get('http://localhost:8080/post/get/' + 4)
      .subscribe(
        res => {
          this.response = res;
          this.base64Data = this.response.image;
          this.retrievedImage = 'data:image/jpeg;base64,' + this.base64Data;
        }
      );
  }

  translateImage(image: any): any {
    return 'data:image/jpeg;base64,' + image;
  }

  ngOnInit(): void {
    this.getPosts();
  }
}
