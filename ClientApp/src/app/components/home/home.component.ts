import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Wiki } from '@app/models';
import { AuthService, DataService} from '@app/services/';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{
  tabs = [
    { id: 11, name: 'Dr Nice' },
    { id: 12, name: 'Narco' },
    { id: 13, name: 'Bombasto' },
    { id: 14, name: 'Celeritas' },
    { id: 15, name: 'Magneta' },
    { id: 16, name: 'RubberMan' },
    { id: 17, name: 'Dynama' },
    { id: 18, name: 'Dr IQ' },
    { id: 19, name: 'Magma' },
    { id: 20, name: 'Tornado' }
  ];
  data = [] as  any;

  isLoggedIn: boolean;
  message = '';
  isLoadingResults = false;


  constructor(private authService: AuthService, private dataService: DataService, private router: Router, private formBuilder: FormBuilder) {
    this.authService.user.subscribe(x => {
      if(x==null){
        this.isLoggedIn = false;
      }else{
        this.isLoggedIn = true;
      }
    });
  }

  ngOnInit(): void {
    this.isLoadingResults = true;
    this.dataService.fetchWiki().subscribe((data: any) => {
      for (let e in data.body){
        let tempWiki = new Wiki(data.body[e]);
        this.data.push(tempWiki);
        // console.log(data.body[e]);
      }
      // this.data = data.body;
      // console.log("wikis:");
      // console.log(data.body);
      this.isLoadingResults = false;
    });
  }

  openWikiFormPage(): void{
    this.router.navigate(['/wiki-form']);
  }
}
