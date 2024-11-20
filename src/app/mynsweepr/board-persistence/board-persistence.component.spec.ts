import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardPersistenceComponent } from './board-persistence.component';

describe('BoardPersistenceComponent', () => {
  let component: BoardPersistenceComponent;
  let fixture: ComponentFixture<BoardPersistenceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
        imports: [BoardPersistenceComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardPersistenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
