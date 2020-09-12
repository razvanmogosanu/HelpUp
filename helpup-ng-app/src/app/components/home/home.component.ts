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
  city: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  postForm: FormGroup;
  selectedFile: File;
  filteredPosts: Post[];
  allPosts: Post[];
  username: string;
  @ViewChild('fileInput', {static: false})
  myFileInput: ElementRef;
  errorMessage: string;
  selectedType = '';
  filterAfter: string[];

  constructor(private httpClient: HttpClient, private cookies: CookieService, private router: Router, private apiService: ApiService) {
    this.postForm = new FormGroup({
      description: new FormControl(),
    });

    this.filteredPosts = new Array<Post>();
    this.filterAfter = new Array<string>();
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
        this.allPosts = data;
        for (const post of this.allPosts) {
          this.getProfilePicture(post);
        }
        this.filteredPosts = this.allPosts;
      });
  }


  selectFilter(event): void {
    if (event.target.name === 'ending' || event.target.name === 'starting') {
      this.filterAfter.push(event.target.name + ' ' + event.target.value);

    } else if (event.target.name === 'city') {
      if (!event.target.checked) {
        this.filterAfter.splice(this.filterAfter.indexOf(event.target.name + ' ' + event.target.value));
      } else {
        this.filterAfter.push(event.target.name + ' ' + event.target.value);
      }
    } else if (!event.target.checked) {
      this.filterAfter.splice(this.filterAfter.indexOf(event.target.value));
    } else {
      this.filterAfter.push(event.target.value);
    }

    this.filterByType();
  }


  isStartingDateValid(post: Post, filter): boolean {
    if (filter.includes('starting')) {
      const dateStr = filter.substr(filter.indexOf(' '), filter.length);
      if ((new Date(post.date).getFullYear() > new Date(dateStr).getFullYear())) {
        return true;
      } else if ((new Date(post.date).getFullYear() === new Date(dateStr).getFullYear())) {
        if ((new Date(post.date).getMonth() > new Date(dateStr).getMonth())) {
          return true;
        } else if ((new Date(post.date).getMonth() === new Date(dateStr).getMonth()) &&
          (new Date(post.date).getDate() >= new Date(dateStr).getDate())) {
          return true;
        }
      }
    }
    return false;
  }

  isEndingDateValid(post: Post, filter): boolean {
    if (filter.includes('ending')) {
      const dateStr = filter.substr(filter.indexOf(' '), filter.length);
      if ((new Date(post.date).getFullYear() < new Date(dateStr).getFullYear())) {
        return true;
      } else if ((new Date(post.date).getFullYear() === new Date(dateStr).getFullYear())) {
        if ((new Date(post.date).getMonth() < new Date(dateStr).getMonth())) {
          return true;
        } else if ((new Date(post.date).getMonth() === new Date(dateStr).getMonth()) &&
          (new Date(post.date).getDate() <= new Date(dateStr).getDate())) {
          return true;
        }
      }
    }
    return false;
  }

  filterByType(): void {
    this.filteredPosts = [];
    let iHadAPool = false;
    for (const post of this.allPosts) {
      for (const type of this.filterAfter) {
        if (post.type.includes(type)) {
          iHadAPool = true;
          this.filteredPosts.push(post);
        }
      }
    }
    if (this.filterAfter.length === 0 || !iHadAPool) {
      this.filteredPosts = this.allPosts;
    }


    const secondfilteredPosts = [];

    for (const post of this.filteredPosts) {
      let cont1 = false;
      let cont2 = false;
      let startingFilter;
      let endingFilter;
      for (const filter of this.filterAfter) {
        if (filter.includes('starting')) {
          cont1 = true;
          startingFilter = filter;
        }
        if (filter.includes('ending')) {
          cont2 = true;
          endingFilter = filter;
        }
      }
      if (cont1 && cont2) {
        if (this.isStartingDateValid(post, startingFilter) && this.isEndingDateValid(post, endingFilter)) {
          console.log('yes, sir');
          secondfilteredPosts.push(post);
        }
      } else if (cont1) {
        if (this.isStartingDateValid(post, startingFilter)) {
          secondfilteredPosts.push(post);
        }
      } else if (cont2) {
        if (this.isEndingDateValid(post, endingFilter)) {
          secondfilteredPosts.push(post);
        }
      }
    }
    console.log(secondfilteredPosts);
    if (this.filterAfter.length !== 0) {
      this.filteredPosts = secondfilteredPosts;
    }

    const thirdFilteredPosts = [];
    let iHadASearchingPool = false;

    for (const post of this.allPosts) {
      for (const city of this.filterAfter) {
        if (city.includes('city') && post.city === city.substr(5)) {

          iHadASearchingPool = true;
          let alreadyExists = false;

          for (const filteredPost of this.filteredPosts) {
            if (post === filteredPost) {
              alreadyExists = true;
              break;
            }
          }
          if (this.filteredPosts.length === 0) {
            alreadyExists = true;
          }

          if (alreadyExists) {
            thirdFilteredPosts.push(post);
          }
        }
      }
    }
    if (iHadASearchingPool) {
      this.filteredPosts = thirdFilteredPosts;
    }
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

  isAdmin(): boolean {
    return this.cookies.get('username').includes('admin');
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
