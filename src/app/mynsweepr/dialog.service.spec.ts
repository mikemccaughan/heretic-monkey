import { TestBed } from '@angular/core/testing';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import jasmine from 'jasmine';
import { DialogService } from './dialog.service';


describe('DialogService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DialogService = TestBed.inject(DialogService);
    expect(service).toBeTruthy();
  });
});

function expect<T>(actual: T) {
  return {
    toBeTruthy(): void {
      if (!actual) {
        throw new Error(`Expected value to be truthy but received ${actual}`);
      }
    }
  };
}

