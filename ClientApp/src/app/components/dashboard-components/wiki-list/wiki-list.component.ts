import { Component, OnInit } from '@angular/core';
import { Wiki } from '@app/models';
import { AuthService, DataService } from '@app/services';

@Component({
  selector: 'app-wiki-list',
  templateUrl: './wiki-list.component.html',
  styleUrls: ['./wiki-list.component.scss']
})
export class WikiListComponent implements OnInit {
  wikiList = [] as  any;
  isLoadingData: boolean;
  userId: number;

  constructor(private authService: AuthService, private dataService: DataService) { }

  ngOnInit(): void {
    this.authService.user.subscribe(x => {if(x!=null){this.userId= x.id}}).unsubscribe();
    this.isLoadingData = true;
    this.dataService.fetchWiki(undefined, undefined, this.userId).subscribe((data: any) => {
      for (let e in data.body){
        let tempWiki = new Wiki(data.body[e]);
        this.wikiList.push(tempWiki);
        // console.log(data.body[e]);
      }
      this.isLoadingData = false;
    });
  }

  print(text: string){
    console.log(text);
  }


  openWikiEditingPage(){

  }


  deleteWiki(id: number){
    this.dataService.deleteWiki(id).subscribe(
      data => {
        // console.log(data);
        this.wikiList = this.wikiList.filter((x:any) => id != x.id);
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
        this.wikiList.push(new Wiki(data.body));
      },
      err => {
        // console.log(err);
      }
    );
  }
}
