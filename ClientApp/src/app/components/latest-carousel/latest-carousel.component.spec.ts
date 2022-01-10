import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestCarouselComponent } from './latest-carousel.component';

describe('LatestCarouselComponent', () => {
  let component: LatestCarouselComponent;
  let fixture: ComponentFixture<LatestCarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LatestCarouselComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LatestCarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
