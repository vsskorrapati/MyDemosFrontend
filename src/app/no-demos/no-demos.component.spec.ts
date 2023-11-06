import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoDemosComponent } from './no-demos.component';

describe('NoDemosComponent', () => {
  let component: NoDemosComponent;
  let fixture: ComponentFixture<NoDemosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoDemosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoDemosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
