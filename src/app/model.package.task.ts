// Schema for the Package Tasks (message layout) class

// Eazl
export class EazlPackageTask {
    id: number;
    celery_task_id: number;
    package: any;  //FK
    user: any;  //FK
    date_added: Date;
}

// Canvas
export class PackageTask {
    packageTaskID: number;
    packageTaskCeleryTaskID: number;
    packageTaskPackage: any;
    packageTaskUser: any;
    packageTaskCreatedDateTime: string;
}
