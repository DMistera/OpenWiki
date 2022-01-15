import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Article, Category, Wiki} from '@app/models';
import { DataService } from '@app/services';
import { CategoryService } from '@app/services/category.service';


@Component({
  selector: 'app-category-assignment',
  templateUrl: './category-assignment.component.html',
  styleUrls: ['./category-assignment.component.scss']
})
export class CategoryAssignmentComponent implements OnInit {
  return_url: string;
  return_name: string;
  article_id: number;
  article: Article;

  wiki: Wiki;
  //=======================
  assigned_categories: Category[];
  other_categories: Category[];
  other_categories_copy: Category[];
  
  //=======================
  form: FormGroup;
  querry: string = "";
  isCleanButtonVisible: boolean = false;

  notFoundOtherCategories: boolean = false;

  //=======================
  isWikiDataUpdated = false;

  constructor(private router: Router, private dataService: DataService, private categoryService: CategoryService, private actRoute: ActivatedRoute, private formBuilder: FormBuilder) { 
    this.return_url = this.router.getCurrentNavigation()?.extras?.state?.return_url || "../";
    this.return_name = this.router.getCurrentNavigation()?.extras?.state?.return_name || "dashboard";
    this.article_id =  this.router.getCurrentNavigation()?.extras?.state?.article_id;

    this.assigned_categories = [];
    this.other_categories = [];
    this.other_categories_copy = [];
  }

  ngOnInit(): void {
    this.querry="";
    this.form = this.formBuilder.group({title: ''});
    this.onChanges();

    if(this.article_id == null){
      let temp_article_id = this.actRoute.snapshot.params.articleId;

      this.dataService.fetchArticleById(temp_article_id).subscribe((data: any) => {
        this.article = new Article(data.body);
        this.article_id = this.article.id;
        
        this.assigned_categories = [];
        this.assigned_categories = this.article.categories;

        this.dataService.fetchWikiById(this.article.wiki.id).subscribe(
          (data:any)=>{
            this.wiki = new Wiki(data.body);
            this.dataService.fetchCategories().subscribe((data: any) => {
              this.other_categories = [];
              for (let e in data.body){
                let tempCategory = new Category(data.body[e]);
                this.other_categories.push(tempCategory);
              }
      
              for(let category of this.assigned_categories){
                this.other_categories = this.other_categories.filter((x:any) => category.id != x.id);
              }
              this.other_categories_copy = this.other_categories;
            });
        });
      });
    }
    else{
      this.dataService.fetchArticleById(this.article_id).subscribe((data: any) => {
        this.article = new Article(data.body);

        this.assigned_categories = [];
        this.assigned_categories = this.article.categories;

        this.dataService.fetchWikiById(this.article.wiki.id).subscribe(
          (data:any)=>{
            this.wiki = new Wiki(data.body);

            this.dataService.fetchCategories().subscribe((data: any) => {
              this.other_categories = [];
              for (let e in data.body){
                let tempCategory = new Category(data.body[e]);
                this.other_categories.push(tempCategory);
              }
      
              for(let category of this.assigned_categories){
                this.other_categories = this.other_categories.filter((x:any) => category.id != x.id);
              }
              this.other_categories_copy = this.other_categories;
            });
        })
      });
    }
    //get wiki assigned_categories
    //get categories
    //display list 
    //checkbox maintainer
  }

  addCategory(id: any){
    this.dataService.addArticleCategory(this.article_id, id).subscribe((data: any) => {
      this.other_categories.filter((x:any) => {
        if(id == x.id){
          this.assigned_categories.push(x);
        }
      });
      this.other_categories = this.other_categories.filter((x:any) => id != x.id);
      this.other_categories_copy = this.other_categories;
    });
  }

  removeCategory(id: any){
    this.dataService.removeArticleCategory(this.article_id, id).subscribe((data: any) => {
      this.assigned_categories.filter((x:any) => {
        if(id == x.id){
          this.other_categories.push(x);
        }
      });
      this.assigned_categories = this.assigned_categories.filter((x:any) => id != x.id);
      this.other_categories_copy = this.other_categories;
  });
  }

  onChanges(): void {
    const range: number = 10;

    this.form.valueChanges.subscribe(val => {
      this.querry = val.title;
      if(this.querry.length==0){
        this.other_categories = this.other_categories_copy;
        this.isCleanButtonVisible = false;
        this.notFoundOtherCategories = false;
      }else{
        this.isCleanButtonVisible = true;
        this.other_categories = this.other_categories.filter((v:Category)=>v.name.toLowerCase().indexOf(this.querry.toLowerCase()) > -1).slice(0, range);
        if(this.other_categories.length==0){
          this.notFoundOtherCategories = true
          this.other_categories = this.other_categories_copy;
        }
      }
    });
  }

  clearSearchInput(){
    this.form = this.formBuilder.group({title: ''});
    this.onChanges();
    this.querry = "";
    this.isCleanButtonVisible = false;
    this.notFoundOtherCategories = false;
    this.other_categories = this.other_categories_copy;
  }

  searchCategory(){
    const range: number = 10;
    if(this.querry.length>0){
      this.other_categories = this.other_categories.filter((v:Category)=>v.name.toLowerCase().indexOf(this.querry.toLowerCase()) > -1).slice(0, range);
      if(this.other_categories.length==0){
        this.notFoundOtherCategories = true
        this.other_categories = this.other_categories_copy;
      }
    }
    console.log(this.querry);
  }
}
