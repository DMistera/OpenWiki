import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User, Wiki } from '@app/models';
import { DataService } from '@app/services';

@Component({
  selector: 'app-maintainer-form',
  templateUrl: './maintainer-form.component.html',
  styleUrls: ['./maintainer-form.component.scss']
})
export class MaintainerFormComponent implements OnInit {
  return_url: string;
  return_name: string;
  wiki_id: number;
  wiki: Wiki;
  //=======================
  maintainers: User[];
  other_users: User[];

  //=======================
  isWikiDataUpdated = false;

  constructor(private router: Router, private dataService: DataService, private actRoute: ActivatedRoute) { 
    this.return_url = this.router.getCurrentNavigation()?.extras?.state?.return_url || "../";
    this.return_name = this.router.getCurrentNavigation()?.extras?.state?.return_name || "dashboard";
    this.wiki_id =  this.router.getCurrentNavigation()?.extras?.state?.wiki_id;

    this.maintainers = [];
    this.other_users = [];
  }

  ngOnInit(): void {
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
  });
  }
}
