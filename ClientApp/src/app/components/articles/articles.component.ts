import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Article } from '@app/models';
import { DataService } from '@app/services';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.scss']
})
export class ArticlesComponent implements OnInit {
  @Input()active: boolean;
  @Input()count: number;
  @Input()isListOnly: boolean = false;
  @Input()isRandom: boolean = false;

  articles = [] as  any;
  articlesFiltered = [] as  any;
  isLoadingArticles = false;

  form: FormGroup;
  querry: string = "";
  isCleanButtonVisible: boolean = false;

  constructor(private dataService: DataService, private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.querry="";
    this.form = this.formBuilder.group({name: ''});
    this.onChanges();

    this.isLoadingArticles = true;
    this.dataService.fetchArticles(this?.active).subscribe((data: any) => {
      if(this.isRandom){
        data.body = data.body.sort(() => 0.5 - Math.random());//randomizer
      }
      if(this.count != null && this.count<=data.body.length){
        for (let e in data.body.slice(0,this.count)){ this.articles.push(new Article(data.body[e])); }
      }
      else{
        for (let e in data.body){ this.articles.push(new Article(data.body[e])); }
      }
      this.articlesFiltered = this.articles;
      this.isLoadingArticles = false;
    });
  }

  onChanges(): void {
    this.form.valueChanges.subscribe(val => {
      this.querry = val.name;
      if(this.querry.length==0){
        this.articlesFiltered = this.articles;
        this.isCleanButtonVisible = false;
      }else{
        this.isCleanButtonVisible = true;
      }
    });
  }

  clearSearchInput(){
    this.form = this.formBuilder.group({name: ''});
    this.onChanges();
    this.querry = "";
    this.isCleanButtonVisible = false;
    this.articlesFiltered = this.articles;
  }

  searchArticle(){
    if(this.querry.length>0){
      this.dataService.searchForArticles(this.querry, true).subscribe((data: any)=>{
        this.articlesFiltered = [];
        if(this.isRandom){
          data.body = data.body.sort(() => 0.5 - Math.random());//randomizer
        }
        if(this.count != null && this.count<=data.body.length){
          for (let e in data.body.slice(0,this.count)){ this.articlesFiltered.push(new Article(data.body[e])); }
        }
        else{
          for (let e in data.body){ this.articlesFiltered.push(new Article(data.body[e])); }
        }
      });
    }
  }
}
