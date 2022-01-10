import { BreakpointState } from '@angular/cdk/layout';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Wiki } from '@app/models';
import { ScreenService } from '@app/services/screen.service';

@Component({
  selector: 'app-latest-carousel',
  templateUrl: './latest-carousel.component.html',
  styleUrls: ['./latest-carousel.component.scss']
})
export class LatestCarouselComponent implements OnInit {
  @Input()count: number;
  @Input()elements: Wiki[] = [];
  data: any[] = [];

  isMobile = false;
  isDesktopHorizontal = false;
  isBelowMd: boolean;
  isBelowLg: boolean;
  
  imagedesktoph = (n:any)=>`https://picsum.photos/id/${n}/1920/500`;
  imagedesktopv = (n:any)=>`https://picsum.photos/id/${n}/1000/500`;
  imagemobile = (n:any)=>`https://picsum.photos/id/${n}/700/500`;

  constructor(private screenService: ScreenService, private router: Router) { }

  ngOnInit(): void {
    console.log(this.elements);
    if(this.count<=this.elements.length){
      this.data = this.elements.slice(this.elements.length-this.count,this.elements.length);
    }
    else{
      this.data = this.elements;
    }
    console.log(this.data);
  }

  ngAfterViewInit(): void {
    this.screenService.isBelowMd().subscribe((isBelowMd: BreakpointState) => {
      this.isBelowMd = isBelowMd.matches;
      if(!this.isBelowMd){ setTimeout(() => {this.isMobile = false;}, 0.1); }
      else{ setTimeout(() => {this.isMobile = true;}, 0.1); }
    });
    this.screenService.isBelowLg().subscribe((isBelowLg: BreakpointState) => {
      this.isBelowLg = isBelowLg.matches;
      if(this.isBelowLg){ setTimeout(() => {this.isDesktopHorizontal = false;}, 0.1); }
      else{ setTimeout(() => {this.isDesktopHorizontal = true;}, 0.1); }
    });
  }

  openDetailsPage(element: any){
    if(element.url != null){
      this.router.navigate(['wiki/'+element.url],{
        state: {
          wiki_url: element.url,
          wiki_id: element.id,
          return_url: '../',
          return_name: "Home"//TODO: refactor
        }
      });
    }
    else
    {
      this.router.navigate(['wiki/'+element.wiki.url+"/article/"+element.id],{
        state: {
          wiki_url: element.wiki.url,
          wiki_id: element.wiki.id,
          return_url: '../../',
          return_name: "Home"//TODO: refactor
        }
      });
    }
    
  }
}
