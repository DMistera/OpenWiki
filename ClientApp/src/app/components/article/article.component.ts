import { BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Article } from '@app/models';
import { AuthService, DataService } from '@app/services';
import { ScreenService } from '@app/services/screen.service';
@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {
  article: Article;
  wiki_url: string;
  article_id: number;
  url: string;

  isLoggedIn:boolean;

  currentSection = 'section0';

  isBelowSm: boolean;
  isSideMenu: boolean;

  isMobile = false;
  isBelowMd: boolean;

  isLoadingArticleData: boolean;

  imagedesktop = (n:any)=>`https://picsum.photos/id/${n}/1350/200`;
  imagemobile = (n:any)=>`https://picsum.photos/id/${n}/900/300`;


  constructor(private authService: AuthService, private dataService: DataService, private router: Router, private actRoute: ActivatedRoute, private screenService: ScreenService) { 
    this.wiki_url = this.router.getCurrentNavigation()?.extras?.state?.wiki_url;
    this.article_id = this.router.getCurrentNavigation()?.extras?.state?.article_id;
    // console.log(this.wiki_id+"  "+ this.article_id)
    if(this.wiki_url == undefined || this.article_id == undefined){
      this.article_id = this.actRoute.snapshot.params.articleId;
      this.wiki_url = this.actRoute.snapshot.params.wikiURL;
    }
    this.url = "wiki/"+this.wiki_url+"/article/"+this.article_id
    this.authService.user.subscribe(x => {
      if(x==null){
        this.isLoggedIn = false;
      }else{
        this.isLoggedIn = true;
      }
    });
  }

  ngOnInit(): void {
    this.dataService.fetchArticleById(this.article_id)?.subscribe((data: any) => {
      this.article = new Article(data.body);
      // console.log(data.body);
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
    this.screenService.isBelowSm().subscribe((isBelowSm: BreakpointState) => {
      this.isBelowSm = isBelowSm.matches;
      if(this.isBelowSm){
        // console.log("false");
        setTimeout(() => {
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

  openArticleEditingPage(){
    this.router.navigate(['dashboard/article/'+this.article.id],{
      state: {
        wiki_url: this.wiki_url,
        article_id: this.article.id,
        return_url: '../../../wiki/'+this.wiki_url+'/article/'+this.article.id,
        return_name: "article"
      }
    });
  }

  openCategoryPage(category_id: number){
    this.router.navigate(['category/'+category_id],{
      state: {
        wiki_url: this.wiki_url,
        article_id: this.article.id,
        return_url: '../../../wiki/'+this.wiki_url+'/article/'+this.article.id,
        return_name: "article"
      }
    });
  }

  onSectionChange(sectionId: any) {
    this.currentSection = sectionId;
    console.log(sectionId);
  }

  scrollTo(section: any) {
    this.onSectionChange(section);
    document?.querySelector('#' + section)?.scrollIntoView({block: 'center', behavior:"smooth"});
  }
}
