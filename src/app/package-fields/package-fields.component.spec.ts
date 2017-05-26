import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageFieldsComponent } from './package-fields.component';

describe('PackageFieldsComponent', () => {
  let component: PackageFieldsComponent;
  let fixture: ComponentFixture<PackageFieldsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageFieldsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageFieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
