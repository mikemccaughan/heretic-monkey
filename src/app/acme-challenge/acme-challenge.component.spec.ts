import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcmeChallengeComponent } from './acme-challenge.component';

describe('AcmeChallengeComponent', () => {
  let component: AcmeChallengeComponent;
  let fixture: ComponentFixture<AcmeChallengeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcmeChallengeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcmeChallengeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
