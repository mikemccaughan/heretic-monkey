import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MynsweeprSignalsDifficultySelectorComponent } from './difficulty-selector.component';

describe('DifficultySelectorComponent', () => {
  let component: MynsweeprSignalsDifficultySelectorComponent;
  let fixture: ComponentFixture<MynsweeprSignalsDifficultySelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MynsweeprSignalsDifficultySelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MynsweeprSignalsDifficultySelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
