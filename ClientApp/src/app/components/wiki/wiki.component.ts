import { BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Article, Wiki } from '@app/models';
import { AuthService, DataService } from '@app/services';
import { ScreenService } from '@app/services/screen.service';

@Component({
  selector: 'app-wiki',
  templateUrl: './wiki.component.html',
  styleUrls: ['./wiki.component.scss']
})
export class WikiComponent implements OnInit {
  wiki_url: string;
  wiki: Wiki;
  articles = [] as any;
  isLoggedIn: boolean;

  isMobile = false;
  isBelowMd: boolean;

  isLoadingWikiData: boolean;

  imagedesktop = (n:any)=>`https://picsum.photos/id/${n}/1350/200`;
  imagemobile = (n:any)=>`https://picsum.photos/id/${n}/900/300`;

  constructor(private authService: AuthService, private dataService: DataService, private router: Router, private actRoute: ActivatedRoute, private screenService: ScreenService) {
    this.wiki_url = this.router.getCurrentNavigation()?.extras?.state?.wiki_url;
    this.wiki = new Wiki({});
    this.authService.user.subscribe(x => {
      if(x==null){
        this.isLoggedIn = false;
      }else{
        this.isLoggedIn = true;
      }
    });
  }

  ngOnInit(): void {
    this.isLoadingWikiData=true;
    if(this.wiki_url == null){
      console.log(this.actRoute.snapshot.params.wikiURL);
      this.wiki_url = this.actRoute.snapshot.params.wikiURL;
    }

    this.dataService.fetchWikiByUrl(this.wiki_url).subscribe((data: any) => {
      this.wiki = new Wiki(data.body);
      console.log(data.body);
      this.isLoadingWikiData=false;
      this.dataService.fetchArticlesByWikiId(this.wiki.id, true).subscribe((data: any) => {
        console.log(data.body);
        for (let e in data.body){
          let tempArticle = new Article(data.body[e]);
          this.articles.push(tempArticle);
        }
      });
    });
  }

  ngAfterViewInit(): void {
    this.screenService.isBelowMd().subscribe((isBelowMd: BreakpointState) => {
      this.isBelowMd = isBelowMd.matches;
      if(!this.isBelowMd){
        // console.log("false");
        setTimeout(() => {
          this.isMobile = false;
        }, 0.1);
      }
      else{
        // console.log("true");
        setTimeout(() => {
          this.isMobile = true;
        }, 0.1);
      }
    });
  }

  openArticleFormPage(): void{
    this.router.navigate(['wiki/'+this.wiki.url+'/article-form/'],{
      state: {
        wiki_url: this.wiki.url,
        wiki_id: this.wiki.id
      }
    });
  }

  openWikiEditingPage(){
    this.router.navigate(['dashboard/wiki/'+this.wiki.url],{
      state: {
        wiki_url: this.wiki.url,
        wiki_id: this.wiki.id,
        return_url: '../../../wiki/'+this.wiki.url,
        return_name: "wiki"
      }
    });
  }
}
