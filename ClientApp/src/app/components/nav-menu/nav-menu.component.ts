import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { User, Role } from '../../models';
import { faUser, faHome, faSignOutAlt, faSlidersH} from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent {
  faUser = faUser;
  faHome = faHome;
  faLogout = faSignOutAlt;
  faSliders = faSlidersH;

  isMenuExpanded = false;
  isUserMenuExpanded=false;
  isLoggedIn: boolean;
  user: User|null;

  collapseMenu() {
    this.isMenuExpanded = false;
  }

  toggleMenu() {
    this.isMenuExpanded = !this.isMenuExpanded;
  }

  collapseUserMenu() {
    this.isUserMenuExpanded = false;
  }

  toggleUserMenu() {
    this.isUserMenuExpanded = !this.isUserMenuExpanded;
  }

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {
    // this.isLoggedIn = false;// TODO zmiana sprawdzić
    this.authService.user.subscribe(x => {
      this.user = x;
      if(x==null){
        this.isLoggedIn = false;
      }else{
        this.isLoggedIn = true;
      }
    });
    // this.isLoggedIn = this.authService.isUserLoggedIn;
    this.collapseUserMenu();
  }

  isDashboard(){
    if(this.router.url.includes("dashboard")){
      return true;
    }
    else return false;
  }

  // get isAdmin() {
  //   return this.user && this.user.role === Role.Admin;
  // }


  logout() {
    console.log("logout");
    this.authService.logout().subscribe(
      data => {
        // console.log(data);
        // console.log("logout success");
        this.collapseUserMenu();
        var returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigate([returnUrl]);
        // console.log(returnUrl);
      },
      err => {
        // console.log(err);
        // console.log("logout error");
      }
    );
  }

  
}
