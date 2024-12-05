import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MynsweeprSignalsComponent } from './mynsweepr-signals.component';

describe('MynsweeprSignalsComponent', () => {
  let component: MynsweeprSignalsComponent;
  let fixture: ComponentFixture<MynsweeprSignalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MynsweeprSignalsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MynsweeprSignalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
