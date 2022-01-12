import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintainerAssignmentComponent } from './maintainer-assignment.component';

describe('MaintainerAssignmentComponent', () => {
  let component: MaintainerAssignmentComponent;
  let fixture: ComponentFixture<MaintainerAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintainerAssignmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintainerAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
