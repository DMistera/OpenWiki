import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Article } from '@app/models';
import { DataService } from '@app/services';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {
  article: Article;
  wiki_id: number;
  article_id: number;
  url: string;

  constructor(private dataService: DataService, private router: Router, private actRoute: ActivatedRoute) { 
    this.wiki_id = this.router.getCurrentNavigation()?.extras?.state?.wiki_id;
    this.article_id = this.router.getCurrentNavigation()?.extras?.state?.article_id;
    // console.log(this.wiki_id+"  "+ this.article_id)
    if(this.wiki_id == undefined || this.article_id == undefined){
      this.article_id = this.actRoute.snapshot.params.articleId;
      this.wiki_id = this.actRoute.snapshot.params.wikiId;
    }
    this.url = "wiki/"+this.wiki_id+"/article/"+this.article_id
  }

  ngOnInit(): void {
    this.dataService.fetchArticle(this.article_id)?.subscribe((data: any) => {
      this.article = new Article(data.body);
      // console.log(data.body);
    });
  }
}
