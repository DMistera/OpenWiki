import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Category } from '@app/models';
import { DataService } from '@app/services';
import { CategoryService } from '@app/services/category.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  @Input()count: number;
  @Input()isListOnly: boolean = false;
  @Input()isRandom: boolean = false;

  categories = [] as  any;
  categoriesFiltered = [] as  any;
  isLoadingCategories = false;

  form: FormGroup;
  querry: string = "";
  isCleanButtonVisible: boolean = false;
  
  constructor(private dataService: DataService, private categoryService: CategoryService, private router: Router, private formBuilder: FormBuilder) { 
    // this.categoryService.categoryListObservable.subscribe(data => {
    //   this.categories = data;
    //   this.categoriesFiltered = data;
    //   console.log("xdddd"+JSON.stringify(this.categoriesFiltered));
    // });
  }

  ngOnInit(): void {
    this.querry="";
    this.form = this.formBuilder.group({name: ''});
    this.onChanges();

    this.isLoadingCategories = true;
    this.dataService.fetchCategories().subscribe((data: any) => {
      if(this.isRandom){
        data.body = data.body.sort(() => 0.5 - Math.random());//randomizer
      }
      if(this.count != null && this.count<=data.body.length){
        for (let e in data.body.slice(0,this.count)){ this.categories.push(new Category(data.body[e])); }
      }
      else{
        for (let e in data.body){ this.categories.push(new Category(data.body[e])); }
      }
      this.categoriesFiltered = this.categories;
      this.isLoadingCategories = false;
    });
  }

  onChanges(): void {
    this.form.valueChanges.subscribe(val => {
      this.querry = val.name;
      if(this.querry.length==0){
        this.categoriesFiltered = this.categories;
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
    this.categoriesFiltered = this.categories;
  }

  searchCategory(){
    if(this.querry.length>0){
      this.dataService.searchForCategories(this.querry).subscribe((data: any)=>{
        this.categoriesFiltered = [];
        if(this.isRandom){
          data.body = data.body.sort(() => 0.5 - Math.random());//randomizer
        }
        if(this.count != null && this.count<=data.body.length){
          for (let e in data.body.slice(0,this.count)){ this.categoriesFiltered.push(new Category(data.body[e])); }
        }
        else{
          for (let e in data.body){ this.categoriesFiltered.push(new Category(data.body[e])); }
        }
      });
    }
  }

}
