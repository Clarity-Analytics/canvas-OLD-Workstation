export interface PackageTask {
    celery_task_id: string,
    package: URL,
    user: URL
    date_added: Date
    get_async_result: URL
    url: URL
}