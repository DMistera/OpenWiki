import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainerFormComponent } from './maintainer-form.component';

describe('MaintainerFormComponent', () => {
  let component: MaintainerFormComponent;
  let fixture: ComponentFixture<MaintainerFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintainerFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
