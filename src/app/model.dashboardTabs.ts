// Schema for Tab object inside a Dashboard

export class DashboardTab {
    dashboardID: number;                        // FK to Unique DB ID
    dashboardTabID: number;                        // Unique DB key
    widgetTabName: string;                      // Tab Name inside
    widgetTabDescription: string;               // Tab Description
} 