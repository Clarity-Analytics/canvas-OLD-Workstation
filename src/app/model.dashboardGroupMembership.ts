// Schema for the Dashboard-DashboardGroup Membership classes (many - many)

// Eazl
export class EazlDashboardGroupMembership {
    id: number;
    dashboard_id: number;
    updated_on: string;                                       // Updated on
    updated_by: string;                                       // Updated by
    created_on: string;                                       // Created on
    created_by: string;                                       // Created by
}

// Canvas
export class DashboardGroupMembership {
    dashboardGroupID: number;
    dashboardID: number;
    dashboardGroupMembershipCreatedDateTime: string;          // Created on
    dashboardGroupMembershipCreatedUserName: string;          // Created by
    dashboardGroupMembershipUpdatedDateTime: string;          // Updated on
    dashboardGroupMembershipUpdatedUserName: string;          // Updated by
}