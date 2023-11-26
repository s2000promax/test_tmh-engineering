import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditableProfileComponent } from './editable-profile.component';

describe('EditableProfileComponent', () => {
  let component: EditableProfileComponent;
  let fixture: ComponentFixture<EditableProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditableProfileComponent]
    });
    fixture = TestBed.createComponent(EditableProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
