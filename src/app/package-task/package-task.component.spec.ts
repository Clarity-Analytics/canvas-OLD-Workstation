import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageTaskComponent } from './package-task.component';

describe('PackageTaskComponent', () => {
  let component: PackageTaskComponent;
  let fixture: ComponentFixture<PackageTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
