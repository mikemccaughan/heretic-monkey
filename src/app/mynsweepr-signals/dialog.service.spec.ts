import { TestBed } from '@angular/core/testing';

import { MynsweeprSignalsDialogService } from './dialog.service';

describe('DialogService', () => {
  let service: MynsweeprSignalsDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MynsweeprSignalsDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
