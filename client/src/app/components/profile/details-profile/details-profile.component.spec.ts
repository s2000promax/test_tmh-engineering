import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsProfileComponent } from './details-profile.component';

describe('DetailsProfileComponent', () => {
  let component: DetailsProfileComponent;
  let fixture: ComponentFixture<DetailsProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailsProfileComponent]
    });
    fixture = TestBed.createComponent(DetailsProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
