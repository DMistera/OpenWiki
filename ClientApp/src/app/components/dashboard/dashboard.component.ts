import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event} from '@angular/router';
import { Wiki } from '@app/models';
import { AuthService, DataService } from '@app/services';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  pages: any = {"/dashboard/summary": 1, "/dashboard": 1,"/dashboard/wiki":2,"/dashboard/article":3};
  currentPage = 1;
  currentRoute: string;

  constructor(private router: Router ) {
    this.currentRoute = "";
    this.router.events.subscribe((event: Event) =>{
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.url;
        this.currentPage = this.pages[this.currentRoute];
      }
    })
  }

  ngOnInit(): void {
  }

  isDashboardHome(){
    if(this.pages[this.router.url] == null){
      return false;
    }
    else{
      return true;
    }
  }
}
