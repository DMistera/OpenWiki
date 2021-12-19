import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@app/services';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  form: any = {
    userName: null,
    email: null,
    password: null
  };
  isSuccessful = false;
  isSignUpFailed = false;
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
    const { userName, email, password } = this.form;

    this.authService.register(userName, email, password).subscribe(
      data => {
        // console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
        this.router.navigate(['auth/login'], { queryParams: { returnUrl: this.returnUrl } });
      },
      err => {
        // console.log(err);
        this.errorMessage = err.error;
        this.isSignUpFailed = true;
      }
    );
  }
}
