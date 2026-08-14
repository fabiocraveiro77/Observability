import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartFiltersComponent } from './smart-filters.component';

describe('SmartFiltersComponent', () => {
  let component: SmartFiltersComponent;
  let fixture: ComponentFixture<SmartFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SmartFiltersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SmartFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
