import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Article } from '@app/models';
import { Section } from '@app/models/Section';
import { AuthService, DataService } from '@app/services';

@Component({
  selector: 'app-article-form',
  templateUrl: './article-form.component.html',
  styleUrls: ['./article-form.component.scss']
})
export class ArticleFormComponent implements OnInit {
  wiki_id: number;
  article: Article;

  form: FormGroup;
  articleUpdated: Article;
  isLoadingData: boolean;

  // ======================
  isArticleDataUpdated = false;
  isArticleCreateFailed = false;

  isSuccessful = false;
  isFailed = false;
  errorMessage = '';
  isResetDone = false;
  // ======================
  submitted = false;
  

  constructor(private authService: AuthService, private dataService: DataService, private router: Router, private formBuilder: FormBuilder) {
    this.wiki_id =  Number(this.router.getCurrentNavigation()?.extras?.state?.wiki_id);
    this.article = new Article({"wikiID":Number(this.wiki_id)});
    console.log(this.wiki_id);
  }

  ngOnInit(): void {
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
    this.onChanges();
  }

  onChanges(): void {
    this.form.valueChanges.subscribe(val => {
      this.article.title = val.title;
      this.article.abstract = val.abstract;
      this.article.sections = [];
      val.sections.map((element:any) => {
        // element.id = this.article.sections.length;
        this.article.sections.push(new Section(element));
      });
      if(!(JSON.stringify(this.article) === JSON.stringify(new Article({})))){
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

  createArticle(){
    this.submitted = true;
    if(!this.form.valid) {
      // alert('Please fill all the required fields to create an article!')
      return false;
    } else {
      console.log(this.article);
      this.dataService.createArticle(this.article).subscribe(
        data => {
          console.log(data);
          this.isSuccessful = true;
          this.isArticleCreateFailed = false;
          this.router.navigate(['wiki/'+this.wiki_id]);
        },
        err => {
          console.log(err);
          this.errorMessage = err.error;
          this.isArticleCreateFailed = true;
        }
      );
      // console.log(this.article);
      return true;
    }
  }

  getSectionValidity(i: number) {
    return (<FormGroup>(<FormArray>this.form.get('sections')).controls[i]).controls;
  }

  resetForm(){}
}