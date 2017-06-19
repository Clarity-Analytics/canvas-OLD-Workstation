// Schema for Tab object inside a Dashboard

// TODO - replace dashboard with ID of Dashboard
// TODO - make names consistent with Eazl naming conventions
// Eazl
export class EazlDashboardTab {
    id: number;
    dashboard: string;
    name: string;
    description: string;
    createdDateTime: string;
    createdUserName: string;
    updatedDateTime: string;
    updatedUserName: string;
}

// Canvas
export class DashboardTab {
    dashboardID: number;                        // FK to Unique DB ID
    dashboardTabID: number;                     // Unique DB key
    dashboardTabName: string;                   // Tab Name inside
    dashboardTabDescription: string;            // Tab Description
    dashboardTabCreatedDateTime: string;        // Updated on
    dashboardTabCreatedUserName: string;        // Updated by
    dashboardTabUpdatedDateTime: string;        // Created on
    dashboardTabUpdatedUserName: string;        // Created by
} 