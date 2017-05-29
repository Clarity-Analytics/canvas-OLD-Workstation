// Schema for the Dashboard-GroupMembership classes (many - many)

// Dashboard per Group 
export class DashboardGroupMembership {
    dashboardGroupID: number;
    dashboardID: number;
    dashboardGroupMembershipCreatedDateTime: string;          // Created on
    dashboardGroupMembershipCreatedUserID: string;            // Created by
    dashboardGroupMembershipUpdatedDateTime: string;          // Updated on
    dashboardGroupMembershipUpdatedUserID: string;            // Updated by
}