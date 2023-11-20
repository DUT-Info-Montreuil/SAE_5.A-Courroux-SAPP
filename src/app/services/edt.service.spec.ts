import { TestBed } from '@angular/core/testing';

import { EdtService } from './edt.service';

describe('EdtService', () => {
  let service: EdtService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EdtService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
