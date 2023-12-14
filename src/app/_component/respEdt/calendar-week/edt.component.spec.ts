import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekCalendarComponent } from './week-calendar.component';

describe('EdtComponent', () => {
  let component: WeekCalendarComponent;
  let fixture: ComponentFixture<WeekCalendarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WeekCalendarComponent]
    });
    fixture = TestBed.createComponent(WeekCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
