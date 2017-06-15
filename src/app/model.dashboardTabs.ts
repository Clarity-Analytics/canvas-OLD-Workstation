// Schema for Tab object inside a Dashboard

export class EazlDashboardTab {
    id: number;
    dashboard: string;
}

export class DashboardTab {
    dashboardID: number;                        // FK to Unique DB ID
    dashboardTabID: number;                     // Unique DB key
    dashboardTabName: string;                      // Tab Name inside
    dashboardTabDescription: string;               // Tab Description
    dashboardCreatedDateTime: string;           // Updated on
    dashboardCreatedUserID: string;             // Updated by
    dashboardTabUpdatedDateTime: string;        // Created on
    dashboardTabUpdatedUserID: string;          // Created by
} 