import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Article } from '@app/models';
import { AuthService, DataService } from '@app/services';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss']
})
export class ArticleListComponent implements OnInit {
  articleList = [] as any;
  isLoadingData: boolean;
  userId: number;

  constructor(private authService: AuthService, private dataService: DataService, private router: Router) { }

  ngOnInit(): void {
    this.authService.user.subscribe(x => {if(x!=null){this.userId= x.id}}).unsubscribe();
    this.isLoadingData = true;
    this.dataService.fetchArticlesByUserId(this.userId).subscribe((data: any) => {
      for (let e in data.body){
        let tempArticle = new Article(data.body[e]);
        this.articleList.push(tempArticle);
        // console.log(data.body[e]);
      }
      this.isLoadingData = false;
    });
  }

  print(text: string){
    console.log(text);
  }


  openArticleEditingPage(article_id: any){
    this.router.navigate(['dashboard/article/'+article_id],{
      state: {
        article_id: article_id,
        return_url: '../',
        return_name: "dashboard"
      }
    });
  }

  toggleArticle(article: Article){
    if(article.active){
      this.dataService.deactivateArticle(article.id).subscribe(
        _ => {
          this.articleList.filter((x:any) =>{if( article.id == x.id){x.active = false;}});
        },
      );
    }
    else{
      this.dataService.activateArticle(article.id).subscribe(
        _ => {
          this.articleList.filter((x:any) =>{if( article.id == x.id){x.active = true;}});
        },
      );
    }
  }


  deleteArticle(id: number){
    this.dataService.deleteArticle(id).subscribe(
      data => {
        // console.log(data);
        this.articleList = this.articleList.filter((x:any) => id != x.id);
      },
      err => {
        // console.log(err);
      }
    );
  }

  createTestArticle(){
    let timestamp = Date.now();
    let article = new Article({"id":0, "title":"test-article-"+timestamp, "abstract":"TestArticle-"+timestamp, "sections":[{"title":"test-title", "content":"test-content"}], "wikiID": 3});
    this.authService.user.subscribe(x=> article.creator = x!);

    this.dataService.createArticle(article).subscribe(
      data => {
        // console.log(data);
        this.articleList.push(new Article(data.body));
      },
      err => {
        // console.log(err);
      }
    );
  }
}
