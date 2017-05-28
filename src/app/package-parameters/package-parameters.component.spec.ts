import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageParametersComponent } from './package-parameters.component';

describe('PackageParametersComponent', () => {
  let component: PackageParametersComponent;
  let fixture: ComponentFixture<PackageParametersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageParametersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageParametersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
