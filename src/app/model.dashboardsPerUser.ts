// Schema for Dashboards per User, both via User & via Group membership


// Canvas
export class DashboardsPerUser {
    dashboardID: number;                        // Dashboard ID
    dashboardName: string;                      // Dashboard Name
    username: string;                           // User who has access
    dashboardsPerUserAccessVia: string;         // Username or Group
    dashboardsPermission: string;               // Permission in DB: remove_permission_dashboard, etc
}