import { Component, OnInit, Input} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-wiki-card',
  templateUrl: './wiki-card.component.html',
  styleUrls: ['./wiki-card.component.scss']
})
export class WikicardComponent implements OnInit {
  @Input()title = 'title';
  @Input()id = 1;
  @Input()description = 'description';
  @Input()url = 'url';

  image = (n:any)=>`https://picsum.photos/id/${n}/900/500`;


  constructor(private router: Router) {}

  ngOnInit(): void {
  }

  openWikiPage(): void{
    this.router.navigate(['/wiki/'+this.url]);
  }

}
