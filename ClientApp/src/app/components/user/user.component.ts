import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/services';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  username: string = "";

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.userInfo()
    .subscribe(
      data => {
        console.log(data.body.userName);
        this.username = data.body.userName;
      },
      err => {
        console.log(err);
        console.log(err.status);
        console.log(err.errors);
      }
    );
  }


}
