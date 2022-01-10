import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Wiki } from '@app/models';
import { AuthService, DataService } from '@app/services';

@Component({
  selector: 'app-wikis',
  templateUrl: './wikis.component.html',
  styleUrls: ['./wikis.component.scss']
})
export class WikisComponent implements OnInit {
  @Input()count: number;
  @Input()isListOnly: boolean = false;
  @Input()isRandom: boolean = false;
  
  wikis = [] as  any;
  wikisFiltered = [] as  any;
  isLoadingWikis = false;

  form: FormGroup;
  querry: string = "";
  isCleanButtonVisible: boolean = false;

  constructor(private authService: AuthService, private dataService: DataService, private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.querry="";
    this.form = this.formBuilder.group({name: ''});
    this.onChanges();

    this.isLoadingWikis = true;
    this.dataService.fetchWikis().subscribe((data: any) => {
      if(this.isRandom){
        data.body = data.body.sort(() => 0.5 - Math.random());//randomizer
      }
      if(this.count != null && this.count<=data.body.length){
        for (let e in data.body.slice(0,this.count)){ this.wikis.push(new Wiki(data.body[e])); }
      }
      else{
        for (let e in data.body){ this.wikis.push(new Wiki(data.body[e])); }
      }
      this.wikisFiltered = this.wikis;
      this.isLoadingWikis = false;
    });
  }

  onChanges(): void {
    this.form.valueChanges.subscribe(val => {
      this.querry = val.name;
      if(this.querry.length==0){
        this.wikisFiltered = this.wikis;
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
    this.wikisFiltered = this.wikis;
  }

  searchWiki(){
    if(this.querry.length>0){
      this.dataService.searchForWikis(this.querry).subscribe((data: any)=>{
        this.wikisFiltered = [];
        if(this.isRandom){
          data.body = data.body.sort(() => 0.5 - Math.random());//randomizer
        }
        if(this.count != null && this.count<=data.body.length){
          for (let e in data.body.slice(0,this.count)){ this.wikisFiltered.push(new Wiki(data.body[e])); }
        }
        else{
          for (let e in data.body){ this.wikisFiltered.push(new Wiki(data.body[e])); }
        }
      });
    }
  }
}
