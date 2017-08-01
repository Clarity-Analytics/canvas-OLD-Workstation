// Schema for the Package Tasks (message layout) class

// Eazl
export class EazlPackageTask {
    id: number;
    celery_task_id: number;
    query: string;  //FK
    executor: string;  //FK
    date_created: Date;
    checksum: string;
    run_time: number;
    cache_result: boolean;
}

// Canvas
export class PackageTask {
    packageTaskID: number;
    packageTaskCeleryTaskID: number;
    packageTaskPackage: any;
    packageTaskUser: any;
    packageTaskCreatedDateTime: string;
}
