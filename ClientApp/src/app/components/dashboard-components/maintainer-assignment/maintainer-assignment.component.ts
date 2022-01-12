import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User, Wiki } from '@app/models';
import { DataService } from '@app/services';

@Component({
  selector: 'app-maintainer-assignment',
  templateUrl: './maintainer-assignment.component.html',
  styleUrls: ['./maintainer-assignment.component.scss']
})
export class MaintainerAssignmentComponent implements OnInit {
  return_url: string;
  return_name: string;
  wiki_id: number;
  wiki: Wiki;
  //=======================
  maintainers: User[];
  other_users: User[];
  other_users_copy: User[];
  
  //=======================
  form: FormGroup;
  querry: string = "";
  isCleanButtonVisible: boolean = false;

  notFoundOtherUsers: boolean = false;

  //=======================
  isWikiDataUpdated = false;

  constructor(private router: Router, private dataService: DataService, private actRoute: ActivatedRoute, private formBuilder: FormBuilder) { 
    this.return_url = this.router.getCurrentNavigation()?.extras?.state?.return_url || "../";
    this.return_name = this.router.getCurrentNavigation()?.extras?.state?.return_name || "dashboard";
    this.wiki_id =  this.router.getCurrentNavigation()?.extras?.state?.wiki_id;

    this.maintainers = [];
    this.other_users = [];
    this.other_users_copy = [];
  }

  ngOnInit(): void {
    this.querry="";
    this.form = this.formBuilder.group({title: ''});
    this.onChanges();

    if(this.wiki_id == null){
      let wiki_url = this.actRoute.snapshot.params.wikiURL;

      this.dataService.fetchWikiByUrl(wiki_url).subscribe((data: any) => {
        this.wiki = new Wiki(data.body);
        this.wiki_id=this.wiki.id;
        
        this.maintainers = [];
        this.maintainers = this.wiki.maintainers;
  
        this.dataService.fetchUsers().subscribe((data: any) => {
          this.other_users = [];
          for (let e in data.body){
            let tempUser = new User(data.body[e]);
            this.other_users.push(tempUser);
          }
  
          for(let user of this.maintainers){
            this.other_users = this.other_users.filter((x:any) => user.id != x.id);
          }
          //remove owner
          this.other_users = this.other_users.filter((x:any) => this.wiki.owner.id != x.id);
          this.other_users_copy = this.other_users;
        });
      });
    }
    else{
      this.dataService.fetchWikiById(this.wiki_id).subscribe((data: any) => {
        this.wiki = new Wiki(data.body);
        this.maintainers = [];
        this.maintainers = this.wiki.maintainers;
  
        this.dataService.fetchUsers().subscribe((data: any) => {
          this.other_users = [];
          for (let e in data.body){
            let tempUser = new User(data.body[e]);
            this.other_users.push(tempUser);
          }
  
          for(let user of this.maintainers){
            this.other_users = this.other_users.filter((x:any) => user.id != x.id);
          }
          //remove owner
          this.other_users = this.other_users.filter((x:any) => this.wiki.owner.id != x.id);
          this.other_users_copy = this.other_users;
        });
      });
    }
    //get wiki maintainers
    //get users
    //display list 
    //checkbox maintainer
  }

  addMaintainer(id: any){
    this.dataService.addWikiMaintainer(this.wiki_id, id).subscribe((data: any) => {
      this.other_users.filter((x:any) => {
        if(id == x.id){
          this.maintainers.push(x);
        }
      });
      this.other_users = this.other_users.filter((x:any) => id != x.id);
      this.other_users_copy = this.other_users;
    });
  }

  removeMaintainer(id: any){
    this.dataService.removeWikiMaintainer(this.wiki_id, id).subscribe((data: any) => {
      this.maintainers.filter((x:any) => {
        if(id == x.id){
          this.other_users.push(x);
        }
      });
      this.maintainers = this.maintainers.filter((x:any) => id != x.id);
      this.other_users_copy = this.other_users;
  });
  }

  onChanges(): void {
    const range: number = 10;

    this.form.valueChanges.subscribe(val => {
      this.querry = val.title;
      if(this.querry.length==0){
        this.other_users = this.other_users_copy;
        this.isCleanButtonVisible = false;
        this.notFoundOtherUsers = false;
      }else{
        this.isCleanButtonVisible = true;
        this.other_users = this.other_users.filter((v:User)=>v.userName.toLowerCase().indexOf(this.querry.toLowerCase()) > -1).slice(0, range);
        if(this.other_users.length==0){
          this.notFoundOtherUsers = true
          this.other_users = this.other_users_copy;
        }
      }
    });
  }

  clearSearchInput(){
    this.form = this.formBuilder.group({title: ''});
    this.onChanges();
    this.querry = "";
    this.isCleanButtonVisible = false;
    this.notFoundOtherUsers = false;
    this.other_users = this.other_users_copy;
  }

  searchUser(){
    const range: number = 10;
    if(this.querry.length>0){
      this.other_users = this.other_users.filter((v:User)=>v.userName.toLowerCase().indexOf(this.querry.toLowerCase()) > -1).slice(0, range);
      if(this.other_users.length==0){
        this.notFoundOtherUsers = true
        this.other_users = this.other_users_copy;
      }
    }
    console.log(this.querry);
  }
}
