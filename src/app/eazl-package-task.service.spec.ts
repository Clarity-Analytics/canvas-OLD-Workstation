import { TestBed, inject } from '@angular/core/testing';

import { EazlPackageTaskService } from './eazl-package-task.service';

describe('EazlPackageTaskService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EazlPackageTaskService]
    });
  });

  it('should be created', inject([EazlPackageTaskService], (service: EazlPackageTaskService) => {
    expect(service).toBeTruthy();
  }));
});
