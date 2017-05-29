// Schema for the Dashboard Group class

// Users registered to use the system
export class DashboardGroup {
    dashboardGroupID: number;
    dashboardGroupName: string;
    dashboardGroupDescription: string;
    dashboardGroupCreatedDateTime: string;          // Created on
    dashboardGroupCreatedUserID: string;            // Created by
    dashboardGroupUpdatedDateTime: string;          // Updated on
    dashboardGroupUpdatedUserID: string;            // Updated by
}