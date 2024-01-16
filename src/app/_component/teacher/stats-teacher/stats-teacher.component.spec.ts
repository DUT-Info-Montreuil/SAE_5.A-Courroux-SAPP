import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsTeacherComponent } from './stats-teacher.component';

describe('StatsTeacherComponent', () => {
  let component: StatsTeacherComponent;
  let fixture: ComponentFixture<StatsTeacherComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatsTeacherComponent]
    });
    fixture = TestBed.createComponent(StatsTeacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
