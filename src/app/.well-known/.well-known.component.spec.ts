import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WellKnownComponent } from './.well-known.component';

describe('.WellKnownComponent', () => {
  let component: WellKnownComponent;
  let fixture: ComponentFixture<WellKnownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WellKnownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WellKnownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
