// Schema for Tab object inside a Dashboard

// Eazl
export class EazlDashboardTab {
    id: number;
    dashboard_id: number;
    name: string;
    description: string;
    createdDateTime: string;
    createdUserName: string;
    updatedDateTime: string;
    updatedUserName: string;
}

// Canvas
export class DashboardTab {
    dashboardTabID: number;                     // Unique DB key
    dashboardID: number;                        // FK to Unique DB ID
    dashboardTabName: string;                   // Tab Name inside
    dashboardTabDescription: string;            // Tab Description
    dashboardTabCreatedDateTime: string;        // Updated on
    dashboardTabCreatedUserName: string;        // Updated by
    dashboardTabUpdatedDateTime: string;        // Created on
    dashboardTabUpdatedUserName: string;        // Created by
}