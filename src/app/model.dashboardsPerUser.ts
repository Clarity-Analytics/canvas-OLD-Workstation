// Schema for Datasource per User, both via User & via Group membership

export interface DashboardsPerUser {
    dashboardID: number;                        // Dashboard ID
    dashboardName: string;                      // Dashboard Name
    username: string;                           // User who has access
    dashboardsPerUserAccessVia: string;         // Username or Group
    dashboardsPerUserAccessType: string;        // Readonly, etc
}