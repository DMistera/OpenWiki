import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WikiFormComponent } from './wiki-form.component';

describe('WikiFormComponent', () => {
  let component: WikiFormComponent;
  let fixture: ComponentFixture<WikiFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WikiFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WikiFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
