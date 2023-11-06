import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolutionsWorkspaceLayoutComponent } from './solutions-workspace-layout.component';

describe('SolutionsWorkspaceLayoutComponent', () => {
  let component: SolutionsWorkspaceLayoutComponent;
  let fixture: ComponentFixture<SolutionsWorkspaceLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolutionsWorkspaceLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolutionsWorkspaceLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
