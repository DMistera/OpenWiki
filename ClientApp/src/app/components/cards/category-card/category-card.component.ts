import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category-card',
  templateUrl: './category-card.component.html',
  styleUrls: ['./category-card.component.scss']
})
export class CategoryCardComponent implements OnInit {
  @Input()name = 'name';
  @Input()id = 1;
  @Input()description = 'description';

  image = (n:any)=>`https://picsum.photos/id/${n}/900/500`;


  constructor(private router: Router) {}

  ngOnInit(): void {
  }

  openCategoryPage(): void{
    this.router.navigate(['/category/'+this.id]);
  }
}
