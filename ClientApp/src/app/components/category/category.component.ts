import { BreakpointState } from '@angular/cdk/layout';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Article, Category } from '@app/models';
import { AuthService, DataService } from '@app/services';
import { ScreenService } from '@app/services/screen.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {
  @Input()active: boolean;
  @Input()count: number;
  @Input()isListOnly: boolean = false;
  @Input()isRandom: boolean = false;

  category_id: number;
  category: Category;

  isLoggedIn: boolean;

  articles = [] as  any
  articles_copy = [] as  any
  notFoundOtherArticles: boolean;

  return_url: string;
  return_name: string;

  // articles = [] as  any;
  isLoadingArticles = false;

  form: FormGroup;
  querry: string = "";
  isCleanButtonVisible: boolean = false;

  isMobile = false;
  isBelowMd: boolean;

  imagedesktop = (n:any)=>`https://picsum.photos/id/${n}/1350/200`;
  imagemobile = (n:any)=>`https://picsum.photos/id/${n}/900/300`;

  constructor(private authService: AuthService, private dataService: DataService, private router: Router, private formBuilder: FormBuilder, private actRoute: ActivatedRoute, private screenService: ScreenService) { 
    this.category_id = this.router.getCurrentNavigation()?.extras?.state?.category_id;
    this.return_url = this.router.getCurrentNavigation()?.extras?.state?.return_url || "../";
    this.return_name = this.router.getCurrentNavigation()?.extras?.state?.return_name || "home";

    if(this.category_id == undefined){
      this.category_id = this.actRoute.snapshot.params.categoryId;
    }
    this.authService.user.subscribe(x => {
      if(x==null){
        this.isLoggedIn = false;
      }else{
        this.isLoggedIn = true;
      }
    });
  }

  ngOnInit(): void {
    this.querry="";
    this.form = this.formBuilder.group({title: ''});
    this.onChanges();

    this.isLoadingArticles = true;
    this.dataService.fetchCategory(this.category_id).subscribe((data: any) => {
      this.category = new Category(data.body);

      let articles = this.category.articles;
      console.log(articles);

      if(this.isRandom){
        articles = articles.sort(() => 0.5 - Math.random());//randomizer
      }
      if(this.count != null && this.count<=articles.length){
        for (let e in articles.slice(0,this.count)){ this.articles.push(new Article(articles[e])); }
      }
      else{
        for (let e in articles){ this.articles.push(new Article(articles[e])); }
      }
      this.articles_copy = this.articles;
      this.isLoadingArticles = false;
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

  onChanges(): void {
    this.form.valueChanges.subscribe(val => {
      this.querry = val.title;
      console.log(this.querry);
      if(this.querry.length==0){
        this.articles= this.articles_copy;
        this.isCleanButtonVisible = false;
        this.notFoundOtherArticles = false;
      }else{
        this.isCleanButtonVisible = true;
        this.articles= this.articles.filter((v:Article)=>v.title.toLowerCase().indexOf(this.querry.toLowerCase()) > -1);
        if(this.articles.length==0){
          this.notFoundOtherArticles = true
          this.articles = this.articles_copy;
        }
      }
    });
  }

  clearSearchInput(){
    this.form = this.formBuilder.group({title: ''});
    this.onChanges();
    this.querry = "";
    this.isCleanButtonVisible = false;
    this.notFoundOtherArticles = false;
    this.articles= this.articles_copy;
  }

  searchArticle(){
    const range: number = 10;
    if(this.querry.length>0){
      this.articles= this.articles.filter((v:Article)=>v.title.toLowerCase().indexOf(this.querry.toLowerCase()) > -1).slice(0, range);
      if(this.articles.length==0){
        this.notFoundOtherArticles = true
        this.articles= this.articles_copy;
      }
    }
  }

  openCategoryEditingPage(){
    this.router.navigate(['dashboard/category/'+this.category.id],{
      state: {
        category_id: this.category.id,
        return_url: '../../../category/'+this.category.id,
        return_name: "category"
      }
    });
  }
}
