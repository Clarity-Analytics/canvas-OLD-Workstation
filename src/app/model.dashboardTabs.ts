// Schema for Tab object inside a Dashboard

// TODO - replace dashboard with ID of Dashboard
// TODO - make names consistent with Eazl naming conventions
export class EazlDashboardTab {
    id: number;
    dashboard: string;
    name: string;
    description: string;
    createdDateTime: string;
    createdUserID: string;
    updatedDateTime: string;
    updatedUserID
}

export class DashboardTab {
    dashboardID: number;                        // FK to Unique DB ID
    dashboardTabID: number;                     // Unique DB key
    dashboardTabName: string;                   // Tab Name inside
    dashboardTabDescription: string;            // Tab Description
    dashboardTabCreatedDateTime: string;        // Updated on
    dashboardTabCreatedUserID: string;             // Updated by
    dashboardTabUpdatedDateTime: string;        // Created on
    dashboardTabUpdatedUserID: string;          // Created by
} 