import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User, Wiki } from '@app/models';
import { AuthService, DataService } from '@app/services';

@Component({
  selector: 'app-wiki-list',
  templateUrl: './wiki-list.component.html',
  styleUrls: ['./wiki-list.component.scss']
})
export class WikiListComponent implements OnInit {
  isLoadingData: boolean;
  user: User;
  userId: number;

  constructor(private authService: AuthService, private dataService: DataService, private router: Router) { }

  ngOnInit(): void {
    this.isLoadingData = true;
    this.authService.userInfo().subscribe(data => {
        this.user = new User(data.body);
        this.isLoadingData = false;
    });
    // this.dataService.fetchWikis(this.userId).subscribe((data: any) => {
    //   for (let e in data.body){
    //     let tempWiki = new Wiki(data.body[e]);
    //     this.wikiList.push(tempWiki);
    //     // console.log(data.body[e]);
    //   }
    //   this.isLoadingData = false;
    // });
  }

  print(text: string){
    console.log(text);
  }


  openWikiEditingPage(wiki: Wiki){
    this.router.navigate(['dashboard/wiki/'+wiki.url],{
      state: {wiki_url: wiki.url, wiki_id: wiki.id}
    });
  }


  deleteWiki(id: number){
    this.dataService.deleteWiki(id).subscribe(
      data => {
        // console.log(data);
        this.user.ownedWikis = this.user.ownedWikis.filter((x:any) => id != x.id);
        this.user.maintainedWikis = this.user.maintainedWikis.filter((x:any) => id != x.id);
      },
      err => {
        // console.log(err);
      }
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
}
