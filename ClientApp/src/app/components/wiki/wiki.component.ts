import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Article, Wiki } from '@app/models';
import { AuthService, DataService } from '@app/services';

@Component({
  selector: 'app-wiki',
  templateUrl: './wiki.component.html',
  styleUrls: ['./wiki.component.scss']
})
export class WikiComponent implements OnInit {
  wiki_id: number;
  wiki: Wiki;
  articles = [] as any;
  isLoggedIn: boolean;

  constructor(private authService: AuthService, private dataService: DataService, private router: Router, private actRoute: ActivatedRoute) {
    this.wiki_id = this.actRoute.snapshot.params.wikiId;
    console.log(this.actRoute.snapshot.params.wikiId);
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
    this.dataService.fetchWiki(this.wiki_id).subscribe((data: any) => {
      this.wiki = new Wiki(data.body);
      console.log(data.body);
    });
    this.dataService.fetchArticles(this.wiki_id).subscribe((data: any) => {
      console.log(data.body);
      for (let e in data.body){
        let tempArticle = new Article(data.body[e]);
        console.log(tempArticle);
        this.articles.push(tempArticle);
      }
    });
  }

  openArticleFormPage(): void{
    this.router.navigate(['wiki/'+this.wiki_id+'/article-form/'],{
      state: {wiki_id: this.wiki_id}
    });
  }
}
