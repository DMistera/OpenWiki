import { BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event} from '@angular/router';
import { Wiki } from '@app/models';
import { AuthService, DataService } from '@app/services';
import { ScreenService } from '@app/services/screen.service';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  pages: any = {
    "/dashboard/summary": 1,
    "/dashboard": 2,
    "/dashboard/wiki":2,
    "/dashboard/article":3,
    "/dashboard/wiki?group=owned": 4,
    "/dashboard/wiki?group=maintained": 5,
    "/dashboard/category": 6
  };
  currentPage = 2;
  currentRoute: string;

  isSideMenu = false;
  isWikiMenuCollapsed=true;

  public isBelowXl: boolean;
  public isBelowLg: boolean;
  

  constructor(private router: Router, private screenService: ScreenService) {
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

  ngAfterViewInit(): void {
    this.screenService.isBelowXl().subscribe((isBelowXl: BreakpointState) => {
      this.isBelowXl = isBelowXl.matches;
      if(!this.isBelowXl){
        // console.log("false");
        setTimeout(() => {
          if(this.currentPage == 1){
            this.router.navigate(["/dashboard"]);
          }
          this.isSideMenu = false;
        }, 0.1);
      }
      else{
        // console.log("true");
        setTimeout(() => {
          this.isSideMenu = true;
        }, 0.1);
      }
    });
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
