import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router} from '@angular/router';
import { Article, Wiki } from '@app/models';
import { AuthService, DataService } from '@app/services';
import { faLeaf } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-wiki-edit',
  templateUrl: './wiki-edit.component.html',
  styleUrls: ['./wiki-edit.component.scss']
})
export class WikiEditComponent implements OnInit {
  wiki_id: number;
  wiki_url: string;
  return_url: string;
  return_name: string;

  form: FormGroup;

  wiki: Wiki;
  wikiUpdated: Wiki;
  isLoadingData: boolean;

  // ======================
  isWikiDataUpdated = false;

  isSuccessful = false;
  isFailed = false;
  errorMessage = '';
  isResetDone = false;
  // ======================

  public isMainPartCollapsed = false;
  public isMaintainersPartCollapsed = true;
  public isArticlePartCollapsed = true;
  

  articleList = [] as any;

  constructor(private dataService: DataService, private router: Router, private actRoute: ActivatedRoute, private formBuilder: FormBuilder){
    this.wiki_url = this.router.getCurrentNavigation()?.extras?.state?.wiki_url;
    this.wiki_id = this.router.getCurrentNavigation()?.extras?.state?.wiki_id;
    this.return_url = this.router.getCurrentNavigation()?.extras?.state?.return_url || "../";
    this.return_name = this.router.getCurrentNavigation()?.extras?.state?.return_name || "dashboard";

    console.log(this.wiki_url);
  }
  
  ngOnInit(): void {
    if(this.wiki_url==null){ this.wiki_url = this.actRoute.snapshot.params.wikiURL;}

    this.form = this.formBuilder.group({
      name: '',
      url: '',
      description: ''
    });
    this.isLoadingData = true;
    this.dataService.fetchWikiByUrl(this.wiki_url).subscribe((data: any) => {
      this.wiki = new Wiki(data.body);
      this.wikiUpdated = new Wiki(data.body);
      this.form = this.formBuilder.group({
        name: this.wiki.name,
        url: this.wiki.url,
        description: this.wiki.description
      });
      this.onChanges();
      this.dataService.fetchArticlesByWikiId(this.wiki.id).subscribe((data: any) => {
        for (let e in data.body){
          let tempArticle = new Article(data.body[e]);
          this.articleList.push(tempArticle);
          // console.log(data.body[e]);
        }
        this.isLoadingData = false;
      });
    });
  }

  onChanges(): void {
    this.form.valueChanges.subscribe(val => {
      this.wikiUpdated.name = val.name;
      this.wikiUpdated.url = val.url;
      this.wikiUpdated.description = val.description;
      if(!(JSON.stringify(this.wiki) === JSON.stringify(this.wikiUpdated))){
        this.isWikiDataUpdated = true;
      }
      else{
        this.isWikiDataUpdated = false;
      }
      console.log(this.isWikiDataUpdated);
    });
  }

  updateWikiData(): void{
    if(this.isWikiDataUpdated){
      this.dataService.editWiki(this.wikiUpdated).subscribe(
        data => {
          // console.log(data);
          this.wiki = new Wiki(this.wikiUpdated);
          this.isWikiDataUpdated= false;

          this.isSuccessful = true;
          this.isFailed = false;
          this.wiki_url = this.wiki.url;//check
          this.resetAfterTimeout();
        },
        err => {
          this.isSuccessful = false;
          this.isFailed = true;
          this.resetAfterTimeout();
        }
      );
    }
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

  deleteArticle(id:number){
    //TODO: add confirm alert
    console.log("delete article: "+id)
    this.dataService.deleteArticle(id).subscribe((data: any) => {
      this.articleList = this.articleList.filter((x:any) => id != x.id);
    });
  }

  deleteMaintainer(id:number){
    console.log("delete maintainer: "+id)
    this.dataService.removeWikiMaintainer(this.wiki.id, id).subscribe((data: any) => {
      this.wiki.maintainers = this.wiki.maintainers.filter((x:any) => id != x.id);
    });
  }


  openMaintainerFormPage(){
    this.router.navigate(['dashboard/wiki/'+this.wiki.url+"/maintainer-form"],{
      state: {
        wiki_url: this.wiki.url,
        wiki_id: this.wiki.id,
        return_url: '../',
        return_name: "edit wiki form"//TODO: refactor
      }
    });
  }

  openArticleFormPage(){
    console.log("wiki id "+this.wiki.id);
    this.router.navigate(['dashboard/wiki/'+this.wiki.url+"/article-form"],{
      state: {
        wiki_url: this.wiki.url,
        wiki_id: this.wiki.id,
        return_url: 'dashboard/wiki/'+this.wiki.url,
        return_name: "edit wiki form"
      }
    });
  }

  openArticleEditingPage(article_id: any){
    this.router.navigate(['dashboard/wiki/'+this.wiki.url+"/article/"+article_id],{
      state: {
        wiki_url: this.wiki.url,
        wiki_id: this.wiki.id,
        article_id: article_id,
        return_url: '../../',
        return_name: "edit wiki form"
      }
    });
  }


  resetAfterTimeout(){
    setTimeout( ()=>{
      if(this.isResetDone){
        this.isResetDone = false;
      }
      else{
        this.isWikiDataUpdated= false;
        this.isSuccessful = false;
        this.isFailed = false;
      }
    }, 5000)
  }

  resetForm(){
    this.isWikiDataUpdated= false;
    this.isSuccessful = false;
    this.isFailed = false;
    this.isResetDone = true;
  }
}
