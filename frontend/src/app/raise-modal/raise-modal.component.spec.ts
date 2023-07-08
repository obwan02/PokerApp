import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaiseModalComponent } from './raise-modal.component';

describe('RaiseModalComponent', () => {
  let component: RaiseModalComponent;
  let fixture: ComponentFixture<RaiseModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RaiseModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RaiseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
