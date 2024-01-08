import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElevesGroupesComponent } from './eleves-groupes.component';

describe('ElevesGroupesComponent', () => {
  let component: ElevesGroupesComponent;
  let fixture: ComponentFixture<ElevesGroupesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ElevesGroupesComponent]
    });
    fixture = TestBed.createComponent(ElevesGroupesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
