import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Wiki } from '@app/models';
import { AuthService, DataService } from '@app/services';

@Component({
  selector: 'app-wiki-form',
  templateUrl: './wiki-form.component.html',
  styleUrls: ['./wiki-form.component.scss']
})
export class WikiFormComponent implements OnInit {
  form: any = {
    name: null,
    url: null,
    description: null
  };
  isSuccessful = false;
  isWikiCreateFailed = false;
  errorMessage = '';
  returnUrl = '/';


  constructor(private authService: AuthService, private dataService: DataService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }


  navigateTo(url: string): void {
    this.router.navigate([url], { queryParams: { returnUrl: this.returnUrl } });
  }

  onSubmit(): void {
    var wiki  = new Wiki(this.form);
    this.authService.user.subscribe(x=> wiki.owner = x!)


    this.dataService.createWiki(wiki).subscribe(
      data => {
        // console.log(data);
        this.isSuccessful = true;
        this.isWikiCreateFailed = false;
        this.router.navigate(['/home']);
      },
      err => {
        // console.log(err);
        this.errorMessage = err.error;
        this.isWikiCreateFailed = true;
      }
    );
  }
}
