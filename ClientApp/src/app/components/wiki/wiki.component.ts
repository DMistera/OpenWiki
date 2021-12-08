import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Wiki } from '@app/models';
import { DataService } from '@app/services';

@Component({
  selector: 'app-wiki',
  templateUrl: './wiki.component.html',
  styleUrls: ['./wiki.component.scss']
})
export class WikiComponent implements OnInit {
  wiki_id: number;
  wiki: Wiki;

  constructor(private dataService: DataService, private actRoute: ActivatedRoute) {
    this.wiki_id = this.actRoute.snapshot.params.id;
    this.wiki = new Wiki({});
  }

  ngOnInit(): void {
    this.dataService.fetchWiki(this.wiki_id).subscribe((data: any) => {
      this.wiki = new Wiki(data.body);
      console.log(data.body);
    });
  }
}
