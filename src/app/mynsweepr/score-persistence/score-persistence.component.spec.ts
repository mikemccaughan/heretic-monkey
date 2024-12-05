import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScorePersistenceComponent } from './score-persistence.component';

describe('ScorePersistenceComponent', () => {
  let component: ScorePersistenceComponent;
  let fixture: ComponentFixture<ScorePersistenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScorePersistenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScorePersistenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
