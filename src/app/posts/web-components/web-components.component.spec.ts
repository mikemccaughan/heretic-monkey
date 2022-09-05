import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WebComponentsComponent } from './web-components.component';

describe('WebComponentsComponent', () => {
  let component: WebComponentsComponent;
  let fixture: ComponentFixture<WebComponentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WebComponentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WebComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
