import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterResultsCardComponent } from './filter-results-card.component';

describe('FilterResultsCardComponent', () => {
  let component: FilterResultsCardComponent;
  let fixture: ComponentFixture<FilterResultsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterResultsCardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FilterResultsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
