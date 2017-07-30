// Schema for the Dashboard-DashboardTag Membership classes (many - many)
// - This is to group Dashboards together, like tags, that are related
// - it has NO relationship with the Groups (of users) entitry

// Eazl
export class EazlDashboardTagMembership {
    id: number;
    dashboard_id: number;
    updated_on: string;                                       // Updated on
    updated_by: string;                                       // Updated by
    created_on: string;                                       // Created on
    created_by: string;                                       // Created by
}

// Canvas
export class DashboardTagMembership {
    dashboardGroupID: number;
    dashboardID: number;
    dashboardGroupMembershipCreatedDateTime: string;          // Created on
    dashboardGroupMembershipCreatedUserName: string;          // Created by
    dashboardGroupMembershipUpdatedDateTime: string;          // Updated on
    dashboardGroupMembershipUpdatedUserName: string;          // Updated by
}