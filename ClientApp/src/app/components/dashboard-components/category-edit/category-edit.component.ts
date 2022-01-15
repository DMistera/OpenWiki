import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router} from '@angular/router';
import { Article, Category } from '@app/models';
import { AuthService, DataService } from '@app/services';
import { CategoryService } from '@app/services/category.service';

@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.scss']
})
export class CategoryEditComponent implements OnInit {
  category_id: number;
  category_url: string;
  return_url: string;
  return_name: string;

  form: FormGroup;

  category: Category;
  categoryUpdated: Category;
  isLoadingData: boolean;

  // ======================
  isCategoryDataUpdated = false;

  isSuccessful = false;
  isFailed = false;
  errorMessage = '';
  isResetDone = false;
  // ======================

  public isMainPartCollapsed = false;
  

  articleList = [] as any;

  constructor(private categoryService: CategoryService, private dataService: DataService, private router: Router, private actRoute: ActivatedRoute, private formBuilder: FormBuilder){
    this.category_id = this.router.getCurrentNavigation()?.extras?.state?.category_id;
    this.return_url = this.router.getCurrentNavigation()?.extras?.state?.return_url || "../";
    this.return_name = this.router.getCurrentNavigation()?.extras?.state?.return_name || "dashboard";

    // this.categoryService.categoryObservable.subscribe(data => {
    //   this.category = data;
    //   this.categoryUpdated = data;
    //   console.log("c" +JSON.stringify(this.categoryUpdated));
    // });

    console.log(this.category_url);
  }
  
  ngOnInit(): void {
    if(this.category_id==null){ this.category_id = this.actRoute.snapshot.params.categoryID;}

    this.form = this.formBuilder.group({
      name: '',
      url: '',
      description: ''
    });
    this.isLoadingData = true;
    this.dataService.fetchCategory(this.category_id).subscribe((data: any) => {
      this.category = new Category(data.body);
      this.categoryUpdated = new Category(data.body);
      this.form = this.formBuilder.group({
        name: this.category.name,
        description: this.category.description
      });
      this.onChanges();
    });
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
      console.log(this.isCategoryDataUpdated);
    });
  }

  updateCategoryData(): void{
    if(this.isCategoryDataUpdated){
      this.dataService.editCategory(this.categoryUpdated).subscribe(
        data => {
          // console.log(data);
          this.category = new Category(this.categoryUpdated);
          this.isCategoryDataUpdated= false;

          this.isSuccessful = true;
          this.isFailed = false;
          this.category_id = this.category.id;//check
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

  resetAfterTimeout(){
    setTimeout( ()=>{
      if(this.isResetDone){
        this.isResetDone = false;
      }
      else{
        this.isCategoryDataUpdated= false;
        this.isSuccessful = false;
        this.isFailed = false;
      }
    }, 5000)
  }

  resetForm(){
    this.isCategoryDataUpdated= false;
    this.isSuccessful = false;
    this.isFailed = false;
    this.isResetDone = true;
  }
}
