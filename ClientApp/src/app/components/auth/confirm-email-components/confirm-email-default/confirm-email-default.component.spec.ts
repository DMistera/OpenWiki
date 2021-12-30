import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmEmailDefaultComponent } from './confirm-email-default.component';

describe('ConfirmEmailDefaultComponent', () => {
  let component: ConfirmEmailDefaultComponent;
  let fixture: ComponentFixture<ConfirmEmailDefaultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmEmailDefaultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmEmailDefaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
