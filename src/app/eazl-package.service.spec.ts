import { TestBed, inject } from '@angular/core/testing';

import { EazlPackageService } from './eazl-package.service';

describe('EazlPackageService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EazlPackageService]
    });
  });

  it('should be created', inject([EazlPackageService], (service: EazlPackageService) => {
    expect(service).toBeTruthy();
  }));
});
