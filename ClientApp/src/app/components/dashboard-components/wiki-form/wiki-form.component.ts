import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Wiki } from '@app/models';
import { AuthService, DataService } from '@app/services';

@Component({
  selector: 'app-wiki-form',
  templateUrl: './wiki-form.component.html',
  styleUrls: ['./wiki-form.component.scss']
})
export class WikiFormComponent implements OnInit {
  form: FormGroup;

  wiki: Wiki;
  wikiUpdated: Wiki;

  submitted:boolean = false;

  isSuccessful:boolean = false;
  isFailed:boolean = false;

  errorMessage = '';
  isResetDone:boolean = false;


  returnUrl = '/';

  isMainPartCollapsed:boolean = false;

  isWikiDataUpdated: boolean = false;

  constructor(private authService: AuthService, private dataService: DataService, private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';//FIXME:
    this.resetData();
    // this.wiki = new Wiki({});
    // this.wikiUpdated = new Wiki({});
    // this.form = this.formBuilder.group({
    //   name: ['', Validators.required],
    //   url: ['', Validators.required],
    //   description: ['', Validators.required]
    // });
    // this.onChanges();
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
      console.log("lolx"+this.isWikiDataUpdated);
    });
  }


  navigateTo(url: string): void {
    this.router.navigate([url], { queryParams: { returnUrl: this.returnUrl } });
  }

  onSubmit(){
    this.submitted = true;
    if(!this.form.valid) {
      // alert('Please fill all the required fields to create an article!')
      return false;
    } else {
      var wiki  = this.wikiUpdated;
      console.log(this.wiki);
      this.dataService.createWiki(wiki).subscribe(
        data => {
          // console.log(data);

          this.isSuccessful = true;
          this.isFailed = false;
          this.resetAfterTimeout();
          // this.router.navigate(['../']);
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
        this.isWikiDataUpdated= false;
        this.isSuccessful = false;
        this.isFailed = false;
      }
    }, 5000)
  }

  resetForm(wipeData:boolean=true){
    if(wipeData){this.resetData();}
    this.submitted = false;
    this.isWikiDataUpdated= false;
    this.isSuccessful = false;
    this.isFailed = false;
    this.isResetDone = true;
  }

  resetData(){
    this.wiki= new Wiki({});
    this.wikiUpdated = new Wiki({});
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      url: ['', Validators.required],
      description: ['', Validators.required]
    });
    this.onChanges();
  }
}
