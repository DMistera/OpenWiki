import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-article-card',
  templateUrl: './article-card.component.html',
  styleUrls: ['./article-card.component.scss']
})
export class ArticleCardComponent implements OnInit {
  @Input()title = 'title';
  @Input()id = 1;
  @Input()description = 'description';
  @Input()wiki_id = 0;
  @Input()url = 'url';

  image = (n:any)=>`https://picsum.photos/id/${n}/900/500`;


  constructor(private router: Router) {}

  ngOnInit(): void {
  }

  openWikiPage(): void{
    this.router.navigate(['wiki/'+this.wiki_id+'/article/'+this.id],{
      state: {
        wiki_id: this.wiki_id,
        article_id: this.id,
        return_url: "wiki/"+this.wiki_id
      }
    });
  }
}
