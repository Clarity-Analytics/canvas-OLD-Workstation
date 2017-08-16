// Schema for Dashboards per User, both via User & via Group membership

// Eazl
export class EazlDashboardsPerUser {
    dashboard_id: number;                       // Dashboard ID
    name: string;                               // Dashboard Name
    username: string;                           // User who has access
    accessVia: string;                          // Username or Group
    accessType: string;                         // Readonly, etc
}

// Canvas
export class DashboardsPerUser {
    dashboardID: number;                        // Dashboard ID
    dashboardName: string;                      // Dashboard Name
    username: string;                           // User who has access
    dashboardsPerUserAccessVia: string;         // Username or Group
    dashboardsPerUserAccessType: string;        // Readonly, etc
}