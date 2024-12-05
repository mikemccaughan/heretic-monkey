import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MynsweeprSignalsDialogComponent } from './dialog.component';

describe('DialogComponent', () => {
  let component: MynsweeprSignalsDialogComponent;
  let fixture: ComponentFixture<MynsweeprSignalsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MynsweeprSignalsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MynsweeprSignalsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
