import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageTasksComponent } from './package-tasks.component';

describe('PackageTasksComponent', () => {
  let component: PackageTasksComponent;
  let fixture: ComponentFixture<PackageTasksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageTasksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
