import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Article } from '@app/models';
import { Section } from '@app/models/Section';
import { AuthService, DataService } from '@app/services';

@Component({
  selector: 'app-article-edit',
  templateUrl: './article-edit.component.html',
  styleUrls: ['./article-edit.component.scss']
})
export class ArticleEditComponent implements OnInit {
  wiki_url: string;
  article_id: number;
  article: Article;

  form: FormGroup;
  articleUpdated: Article;
  isLoadingData: boolean;

  // ======================
  isArticleDataUpdated = false;
  isArticleUpdateFailed = false;
  

  isSuccessful = false;
  isFailed = false;
  errorMessage = '';
  isResetDone = false;
  // ======================
  submitted = false;
  

  constructor(private authService: AuthService, private dataService: DataService, private router: Router, private actRoute: ActivatedRoute, private formBuilder: FormBuilder) {
    this.wiki_url =  this.router.getCurrentNavigation()?.extras?.state?.wiki_url;
    this.article_id = this.router.getCurrentNavigation()?.extras?.state?.article_id;
  }

  ngOnInit(): void {
    if(this.article_id == null){
      this.wiki_url = this.actRoute.snapshot.params.wikiURL;
      this.article_id = this.actRoute.snapshot.params.articleId;
    }

    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      abstract: ['', Validators.required],
      sections: this.formBuilder.array(
        [
        this.formBuilder.group({
          title: this.formBuilder.control('', Validators.required),
          content: this.formBuilder.control('', Validators.required)
        })
        ]
      )
    });

    this.dataService.fetchArticleById(this.article_id).subscribe((data: any) => {
      this.article = new Article(data.body);
      this.articleUpdated = new Article({});

      this.articleUpdated.id = this.article.id;
      this.articleUpdated.title = this.article.title;
      this.articleUpdated.abstract = this.article.abstract;
      this.articleUpdated.sections = []
      this.article.sections.map((element:any) => {
        element.id = null;
        this.articleUpdated.sections.push(new Section(element));
      });
      this.article = new Article(this.articleUpdated);

      this.form = this.formBuilder.group({
        title: [this.article.title, Validators.required],
        abstract: [this.article.abstract, Validators.required],
        sections: this.formBuilder.array(
          Array.from(
            this.article.sections,
            section =>
            this.formBuilder.group({
              title: this.formBuilder.control(section.title, Validators.required),
              content: this.formBuilder.control(section.content, Validators.required)
            })
          )
        )
      });
      this.onChanges();
    });
  }

  onChanges(): void {
    this.form.valueChanges.subscribe(val => {
      // this.article = new Article(this.articleUpdated);
      this.article.title = val.title;
      this.article.abstract = val.abstract;
      this.article.sections = [];
      val.sections.map((element:any) => {
        this.article.sections.push(new Section(element));
      });

      if(!(JSON.stringify(this.article) === JSON.stringify(this.articleUpdated))){
        this.isArticleDataUpdated = true;
      }
      else{
        this.isArticleDataUpdated = false;
      }
    });
  }


  get sections() {
    return this.form.get('sections') as FormArray;
  }

  addSection() {
    this.sections.push(this.formBuilder.group({
      title: this.formBuilder.control('', Validators.required),
      content: this.formBuilder.control('', Validators.required)
    }));
  }

  removeSection(index: number){
    this.sections.removeAt(index);
  }

  updateArticle(){
    this.submitted = true;
    if(!this.form.valid) {
      alert('Please fill all the required fields to create an article!')
      return false;
    } else {
      // console.log(this.article);
      this.dataService.editArticle(this.article).subscribe(
        data => {
          // console.log(data);
          this.isSuccessful = true;
          this.isArticleUpdateFailed = false;
          this.resetAfterTimeout();
        },
        err => {
          // console.log(err);
          this.errorMessage = err.error;
          this.isArticleUpdateFailed = true;
          this.resetAfterTimeout();
        }
      );
      return true;
    }
  }

  getSectionValidity(i: number) {
    return (<FormGroup>(<FormArray>this.form.get('sections')).controls[i]).controls;
  }

  resetAfterTimeout(){
    setTimeout( ()=>{
      if(this.isResetDone){
        this.isResetDone = false;
      }
      else{
        this.isArticleDataUpdated= false;
        this.isSuccessful = false;
        this.isFailed = false;
        this.articleUpdated = new Article(this.article);
      }
    }, 5000)
  }

  resetForm(){
    this.isArticleDataUpdated= false;
    this.isSuccessful = false;
    this.isFailed = false;
    this.isResetDone = true;
    this.articleUpdated = new Article(this.article);
  }
}
