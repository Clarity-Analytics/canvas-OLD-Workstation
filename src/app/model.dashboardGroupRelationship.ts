// Schema for Dashboard Group Relationship
// - this is the relationship between Groups (of users) and Dashboards
// - typical relationship is Sharedwith

// Eazl
export class EazlDashboardGroupRelationship {
    id: number;                                             // Unique ID
    dashboard_id: number;                                   // Dashboard which has relationship
    group_id: number;                                       // Group ID
    type: string;                                           // Type of relationship:
    rating: number;                                         // Rating
    updated_on: string;                                     // Updated on
    updated_by: string;                                     // Updated by
    created_on: string;                                     // Created on
    created_by: string;                                     // Created by
}

// Canvas
export class DashboardGroupRelationship {
    dashboardGroupRelationshipID: number;                   // Unique ID
    dashboardID: number;                                    // Dashboard which has relationship
    groupID: number;                                        // Group ID
    dashboardGroupRelationshipType: string;                 // Type of relationship:
                                                            // - SharedWith
    dashboardGroupRelationshipRating: number;               // Rating
    dashboardGroupRelationshipUpdatedDateTime: string;      // Updated on
    dashboardGroupRelationshipUpdatedUserName: string;      // Updated by
    dashboardGroupRelationshipCreatedDateTime: string;      // Created on
    dashboardGroupRelationshipCreatedUserName: string;      // Created by
}