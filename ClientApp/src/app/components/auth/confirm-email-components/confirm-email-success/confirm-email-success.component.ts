import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm-email-success',
  templateUrl: './confirm-email-success.component.html',
  styleUrls: ['./confirm-email-success.component.scss']
})
export class ConfirmEmailSuccessComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  navigateTo(url: string): void {
    this.router.navigate([url], { queryParams: { returnUrl: "/home" } });
  }
}
