import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatOption } from '@angular/material/core';

import { EdtUserComponent } from './edt-user.component';

describe('EdtUserComponent', () => {
  let component: EdtUserComponent;
  let fixture: ComponentFixture<EdtUserComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EdtUserComponent]
    });
    fixture = TestBed.createComponent(EdtUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
