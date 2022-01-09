import { BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Article } from '@app/models';
import { AuthService, DataService } from '@app/services';
import { ScreenService } from '@app/services/screen.service';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss']
})
export class ArticleListComponent implements OnInit {
  articleList = [] as any;
  filteredArticleList = [] as any;
  isLoadingData: boolean;
  userId: number;

  //==============================
  form: FormGroup;
  querry: string = "";
  isCleanButtonVisible: boolean = false;

  //==============================
  public isBelowXl: boolean;
  isTableVersion: boolean = false;

  constructor(private authService: AuthService, private dataService: DataService, private router: Router, private screenService: ScreenService, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.querry="";
    this.form = this.formBuilder.group({title: ''});
    this.onChanges();
    this.authService.user.subscribe(x => {if(x!=null){this.userId= x.id}}).unsubscribe();
    this.isLoadingData = true;
    this.dataService.fetchArticlesByUserId(this.userId).subscribe((data: any) => {
      for (let e in data.body){
        let tempArticle = new Article(data.body[e]);
        this.articleList.push(tempArticle);
      }
      this.filteredArticleList = this.articleList;
      this.isLoadingData = false;
    });
  }

  ngAfterViewInit(): void {
    this.screenService.isBelowXl().subscribe((isBelowXl: BreakpointState) => {
      this.isBelowXl = isBelowXl.matches;
      if(!this.isBelowXl){
        // console.log("false");
        setTimeout(() => {
          this.isTableVersion = true;
        }, 0.1);
      }
      else{
        // console.log("true");
        setTimeout(() => {
          this.isTableVersion = false;
        }, 0.1);
      }
    });
  }

  onChanges(): void {
    this.form.valueChanges.subscribe(val => {
      this.querry = val.title;
      if(this.querry.length==0){
        this.filteredArticleList = this.articleList;
        this.isCleanButtonVisible = false;
      }else{
        this.isCleanButtonVisible = true;
      }
    });
  }

  clearSearchInput(){
    this.form = this.formBuilder.group({title: ''});
    this.onChanges();
    this.querry = "";
    this.isCleanButtonVisible = false;
    this.filteredArticleList = this.articleList;
  }

  searchArticle(){
    const range: number = 10;
    if(this.querry.length>0){
      this.filteredArticleList = this.articleList;
      this.filteredArticleList = this.filteredArticleList.filter((v:Article)=>v.title.toLowerCase().indexOf(this.querry.toLowerCase()) > -1).slice(0, range);
    }
    console.log(this.querry);
  }

  print(text: string){
    console.log(text);
  }

  openArticleFormPage(){
    this.router.navigate(['dashboard/article-form'],{
      state: {
        return_url: '../',
        return_name: "dashboard"
      }
    });
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

  formatDate(date:string){
    if(date === "0001-01-01T00:00:00"){
      return "-";
    }else{
      const dividedDate = date.split("T");
      return dividedDate[0]+"\n"+dividedDate[1].split(".")[0];
    }
  }
}
