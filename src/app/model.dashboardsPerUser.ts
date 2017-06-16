// Schema for Datasource per User, both via User & via Group membership

// Eazl
export interface EazlDashboardsPerUser {
    dashboard_id: number;                       // Dashboard ID
    name: string;                               // Dashboard Name
    username: string;                           // User who has access
    accessVia: string;                          // Username or Group
    accessType: string;                         // Readonly, etc
}

// Canvas
export interface DashboardsPerUser {
    dashboardID: number;                        // Dashboard ID
    dashboardName: string;                      // Dashboard Name
    username: string;                           // User who has access
    dashboardsPerUserAccessVia: string;         // Username or Group
    dashboardsPerUserAccessType: string;        // Readonly, etc
}