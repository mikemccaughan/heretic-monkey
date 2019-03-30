import { TestBed } from '@angular/core/testing';

import { MineboardService } from './mineboard.service';

describe('MineboardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MineboardService = TestBed.get(MineboardService);
    expect(service).toBeTruthy();
  });
});
