import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MynsweeprSignalsScorePersistenceComponent } from './score-persistence.component';

describe('ScorePersistenceComponent', () => {
  let component: MynsweeprSignalsScorePersistenceComponent;
  let fixture: ComponentFixture<MynsweeprSignalsScorePersistenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MynsweeprSignalsScorePersistenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MynsweeprSignalsScorePersistenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
