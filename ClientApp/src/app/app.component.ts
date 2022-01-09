import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './models';
import { AuthService } from './services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'app';
  isLoggedIn = false;
  user: User | null;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    // this.isLoggedIn = this.authService.isUserLoggedIn;
    // this.authService.user.subscribe(x => {
    //   this.user = x;
    //   if(x==null){
    //     this.isLoggedIn = false;
    //   }else{
    //     this.isLoggedIn = true;
    //   }
    // });
  }
}
