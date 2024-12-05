import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MynsweeprSignalsMineboardComponent } from './mineboard.component';

describe('MineboardComponent', () => {
  let component: MynsweeprSignalsMineboardComponent;
  let fixture: ComponentFixture<MynsweeprSignalsMineboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MynsweeprSignalsMineboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MynsweeprSignalsMineboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
