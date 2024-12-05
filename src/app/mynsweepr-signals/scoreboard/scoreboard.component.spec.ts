import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MynsweeprSignalsScoreboardComponent } from './scoreboard.component';

describe('ScoreboardComponent', () => {
  let component: MynsweeprSignalsScoreboardComponent;
  let fixture: ComponentFixture<MynsweeprSignalsScoreboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MynsweeprSignalsScoreboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MynsweeprSignalsScoreboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
