import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmEmailFailureComponent } from './confirm-email-failure.component';

describe('ConfirmEmailFailureComponent', () => {
  let component: ConfirmEmailFailureComponent;
  let fixture: ComponentFixture<ConfirmEmailFailureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmEmailFailureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmEmailFailureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
