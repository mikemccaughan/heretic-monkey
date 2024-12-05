import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MynsweeprSignalsBoardPersistenceComponent } from './board-persistence.component';

describe('BoardPersistenceComponent', () => {
  let component: MynsweeprSignalsBoardPersistenceComponent;
  let fixture: ComponentFixture<MynsweeprSignalsBoardPersistenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MynsweeprSignalsBoardPersistenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MynsweeprSignalsBoardPersistenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
