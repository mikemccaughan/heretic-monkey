import { TestBed } from '@angular/core/testing';

import { MynsweeprSignalsMineboardService } from './mineboard.service';

describe('MineboardService', () => {
  let service: MynsweeprSignalsMineboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MynsweeprSignalsMineboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
