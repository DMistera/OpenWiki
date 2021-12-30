import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm-email-failure',
  templateUrl: './confirm-email-failure.component.html',
  styleUrls: ['./confirm-email-failure.component.scss']
})
export class ConfirmEmailFailureComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  navigateTo(url: string): void {
    this.router.navigate([url], { queryParams: { returnUrl: "/home" } });
  }
}
