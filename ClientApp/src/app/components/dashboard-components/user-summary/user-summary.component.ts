import { Component, OnInit } from '@angular/core';
import { User } from '@app/models';
import { AuthService, DataService } from '@app/services';

@Component({
  selector: 'app-user-summary',
  templateUrl: './user-summary.component.html',
  styleUrls: ['./user-summary.component.scss']
})
export class UserSummaryComponent implements OnInit {
  user: User;


  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.userInfo().subscribe((data: any) => {
      console.log("UserData: ");
      console.log(JSON.stringify(data.body));
      this.user = new User(data.body);
      console.log(this.user);
    });
  }

}
