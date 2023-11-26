import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchingComponent } from './searching.component';

describe('SearchingComponent', () => {
  let component: SearchingComponent;
  let fixture: ComponentFixture<SearchingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SearchingComponent]
    });
    fixture = TestBed.createComponent(SearchingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
