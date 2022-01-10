import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Wiki } from '@app/models';
import { AuthService, DataService} from '@app/services/';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{
  data = [] as any;

  isLoggedIn: boolean;
  message = '';
  isLoadingResults = false;


  constructor(private authService: AuthService, private dataService: DataService, private router: Router, private formBuilder: FormBuilder) {
    this.authService.user.subscribe(x => {
      if(x==null){
        this.isLoggedIn = false;
      }else{
        this.isLoggedIn = true;
      }
    });
  }

  ngOnInit(): void {
    this.isLoadingResults = true;
    this.dataService.fetchWikis().subscribe((data: any) => {
      for (let e in data.body){
        let tempWiki = new Wiki(data.body[e]);
        this.data.push(tempWiki);
        // console.log(data.body[e]);
      }
      this.isLoadingResults = false;
    });
  }

  openWikisPage(){
    this.router.navigate(['wiki'],{
      state: {
        return_url: '../',
        return_name: "Home"
      }
    });
  }

  openArticlesPage(){
    this.router.navigate(['article'],{
      state: {
        return_url: '../',
        return_name: "Home"
      }
    });
  }
}
