import { BreakpointState } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router, Event} from '@angular/router';
import { User, Wiki } from '@app/models';
import { AuthService, DataService } from '@app/services';
import { ScreenService } from '@app/services/screen.service';

@Component({
  selector: 'app-wiki-list',
  templateUrl: './wiki-list.component.html',
  styleUrls: ['./wiki-list.component.scss']
})
export class WikiListComponent implements OnInit {
  isLoadingData: boolean;
  user: User;
  //==============================
  filteredWikiList: Wiki[];
  wikiList: Wiki[];
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
    if(this.user != null){
      if(this.listType =="owned"){
        this.wikiList = this.user.ownedWikis;
        this.wikiList.forEach(x=>x.owner.id=this.user.id);
      }
      else if(this.listType =="maintained"){
        this.wikiList = this.user.maintainedWikis;
      }else{
        this.wikiList = this.user.ownedWikis;
        this.wikiList.forEach(x=>x.owner.id=this.user.id);
        this.wikiList = this.wikiList.concat(this.user.maintainedWikis);
      }
      this.filteredWikiList = this.wikiList;
    }
  }

  onChanges(): void {
    this.form.valueChanges.subscribe(val => {
      this.querry = val.name;
      if(this.querry.length==0){
        this.filteredWikiList = this.wikiList;
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
    this.filteredWikiList = this.wikiList;
  }

  searchArticle(){
    const range: number = 10;
    if(this.querry.length>0){
      this.filteredWikiList = this.wikiList;
      this.filteredWikiList = this.filteredWikiList.filter((v:Wiki)=>v.name.toLowerCase().indexOf(this.querry.toLowerCase()) > -1).slice(0, range);
    }
    console.log(this.querry);
  }
  print(text: string){
    console.log(text);
  }

  openWikiFormPage(){
    this.router.navigate(['dashboard/wiki-form'],{
      state: {
        return_url: '../',
        return_name: "dashboard"
      }
    });
  }


  openWikiEditingPage(wiki: Wiki){
    this.router.navigate(['dashboard/wiki/'+wiki.url],{
      state: {wiki_url: wiki.url, wiki_id: wiki.id}
    });
  }


  deleteWiki(id: number){
    this.dataService.deleteWiki(id).subscribe(
      _ => {
        this.wikiList = this.wikiList.filter((x:any) => id != x.id);
        this.filteredWikiList = this.wikiList;
      },
    );
  }

  createTestWiki(){
    let timestamp = Date.now();
    let wiki = new Wiki({"id":0, "url":"test-wiki-"+timestamp, "name":"TestWiki-"+timestamp, "description":"Test description 00"});
    this.authService.user.subscribe(x=> wiki.owner = x!);

    this.dataService.createWiki(wiki).subscribe(
      data => {
        // console.log(data);
        this.user.ownedWikis.push(new Wiki(data.body));
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
