import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from '@app/models';
import { AuthService, DataService } from '@app/services';
import { CategoryService } from '@app/services/category.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit {
  form: FormGroup;

  category: Category;
  categoryUpdated: Category;

  submitted:boolean = false;

  isSuccessful:boolean = false;
  isFailed:boolean = false;

  errorMessage = '';
  isResetDone:boolean = false;


  return_url: string;
  return_name: string;

  isMainPartCollapsed:boolean = false;

  isCategoryDataUpdated: boolean = false;

  constructor(
    private authService: AuthService, 
    private dataService: DataService,
    private categoryService: CategoryService,
    private router: Router, 
    private route: ActivatedRoute, 
    private formBuilder: FormBuilder) { 
    this.return_url = this.router.getCurrentNavigation()?.extras?.state?.return_url || "../";
    this.return_name = this.router.getCurrentNavigation()?.extras?.state?.return_name || "dashboard";
  }

  ngOnInit(): void {
    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';//FIXME:
    this.resetData();
    // this.category = new Category({});
    // this.categoryUpdated = new Category({});
    // this.form = this.formBuilder.group({
    //   name: ['', Validators.required],
    //   url: ['', Validators.required],
    //   description: ['', Validators.required]
    // });
    // this.onChanges();
  }

  onChanges(): void {
    this.form.valueChanges.subscribe(val => {
      this.categoryUpdated.name = val.name;
      this.categoryUpdated.description = val.description;
      if(!(JSON.stringify(this.category) === JSON.stringify(this.categoryUpdated))){
        this.isCategoryDataUpdated = true;
      }
      else{
        this.isCategoryDataUpdated = false;
      }
    });
  }

  onSubmit(){
    this.submitted = true;
    if(!this.form.valid) {
      // alert('Please fill all the required fields to create an article!')
      return false;
    } else {
      var category  = this.categoryUpdated;
      // console.log(category);

      this.categoryService.createCategory(category).subscribe(
        data => {
          this.isSuccessful = true;
          this.isFailed = false;
          this.resetAfterTimeout();
        },
        err => {
          // console.log(err);
          this.errorMessage = err.error;
          this.isFailed = true;
          this.resetAfterTimeout(false);
        }
      );
      return true;
    }
  }

  resetAfterTimeout(wipeData:boolean=true){
    setTimeout( ()=>{
      if(this.isResetDone){
        this.isResetDone = false;
      }
      else{
        if(wipeData){this.resetData();}
        this.submitted = false;
        this.isCategoryDataUpdated= false;
        this.isSuccessful = false;
        this.isFailed = false;
      }
    }, 5000)
  }

  resetForm(wipeData:boolean=true){
    if(wipeData){this.resetData();}
    this.submitted = false;
    this.isCategoryDataUpdated= false;
    this.isSuccessful = false;
    this.isFailed = false;
    this.isResetDone = true;
  }

  resetData(){
    this.category= new Category({});
    this.categoryUpdated = new Category({});
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });
    this.onChanges();
  }
}
