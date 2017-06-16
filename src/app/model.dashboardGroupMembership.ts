// Schema for the Dashboard-DashboardGroup Membership classes (many - many)

// Eazl


// Canvas
export class DashboardGroupMembership {
    dashboardGroupID: number;
    dashboardID: number;
    dashboardGroupMembershipCreatedDateTime: string;          // Created on
    dashboardGroupMembershipCreatedUserID: string;            // Created by
    dashboardGroupMembershipUpdatedDateTime: string;          // Updated on
    dashboardGroupMembershipUpdatedUserID: string;            // Updated by
}