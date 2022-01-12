import { BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Category, User } from '@app/models';
import { AuthService, DataService } from '@app/services';
import { ScreenService } from '@app/services/screen.service';

type NewType = User;

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
  isLoadingData: boolean;
  user: NewType;
  //==============================
  filteredCategoryList: Category[];
  categoryList: Category[];
  //==============================
  form: FormGroup;
  querry: string = "";
  isCleanButtonVisible: boolean = false;
  //==============================
  public isBelowXl: boolean;
  isTableVersion: boolean = false;
  listType: string = 'undefined';

  constructor(
    private authService: AuthService, 
    private dataService: DataService, 
    private router: Router, 
    private route: ActivatedRoute, 
    private screenService: ScreenService, 
    private formBuilder: FormBuilder
  ){}

  ngOnInit(): void {
    this.querry="";
    this.form = this.formBuilder.group({name: ''});
    this.onChanges();

    this.route.queryParams.subscribe(queryParams => {
      this.listType = queryParams['group']||'undefined';
      console.log(this.listType);
      this.pickList();
    });

    this.isLoadingData = true;
    this.authService.userInfo().subscribe(data => {
        this.user = new User(data.body);
        this.pickList();
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

  pickList(){
    this.filteredCategoryList = this.categoryList;
  }

  onChanges(): void {
    this.form.valueChanges.subscribe(val => {
      this.querry = val.name;
      if(this.querry.length==0){
        this.filteredCategoryList = this.categoryList;
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
    this.filteredCategoryList = this.categoryList;
  }

  searchCategory(){
    const range: number = 10;
    if(this.querry.length>0){
      this.filteredCategoryList = this.categoryList;
      this.filteredCategoryList = this.filteredCategoryList.filter((v:Category)=>v.name.toLowerCase().indexOf(this.querry.toLowerCase()) > -1).slice(0, range);
    }
    console.log(this.querry);
  }
  print(text: string){
    console.log(text);
  }

  openCategoryFormPage(){
    this.router.navigate(['dashboard/category-form'],{
      state: {
        return_url: '../',
        return_name: "dashboard"
      }
    });
  }


  openCategoryEditingPage(category: Category){
    this.router.navigate(['dashboard/category/'+category.id],{
      state: {category_id: category.id}
    });
  }


  deleteCategory(id: number){
    this.dataService.deleteCategory(id).subscribe(
      _ => {
        this.categoryList = this.categoryList.filter((x:any) => id != x.id);
        this.filteredCategoryList = this.categoryList;
      },
    );
  }

  createTestCategory(){
    let timestamp = Date.now();
    let category = new Category({"id":0, "url":"test-category-"+timestamp, "name":"TestCategory-"+timestamp, "description":"Test description 00"});

    this.dataService.createCategory(category).subscribe(
      data => {
        // console.log(data);
        this.categoryList.push(new Category(data.body));
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

  toString(object: any){
    return JSON.stringify(object);
  }
}
