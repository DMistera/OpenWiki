import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryAssignmentComponent } from './category-assignment.component';

describe('CategoryAssignmentComponent', () => {
  let component: CategoryAssignmentComponent;
  let fixture: ComponentFixture<CategoryAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryAssignmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
