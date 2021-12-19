import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import { first } from 'rxjs/operators';

import {AuthService} from '@app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: any = {
    userName: null,
    password: null
  };
  isSuccessful = false;
  isSignInFailed = false;
  errorMessage = '';
  returnUrl = '/';

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  navigateTo(url: string): void {
    this.router.navigate([url], { queryParams: { returnUrl: this.returnUrl } });
  }

  onSubmit(): void {
    const { userName, password } = this.form;

    this.authService.login(userName, password).subscribe(
      data => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignInFailed = false;

        this.router.navigate([this.returnUrl]);
        console.log(this.returnUrl);
      },
      error => {
        console.log("error")
        console.log(error);
        if(error == "Unauthorized"){
          this.router.navigate(["auth/confirm-email"], { queryParams: { returnUrl: "auth/login" } });
        }
        this.errorMessage = error.error;
        this.isSignInFailed = true;
      }
    );
  }
}

//TODO logout/login nie resetuje stanu strony