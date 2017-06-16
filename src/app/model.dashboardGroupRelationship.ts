// Schema for Dashboard Group Relationship

// Eazl



// Canvas
export class DashboardGroupRelationship {
    dashboardGroupRelationshipID: number;                   // Unique ID
    dashboardID: number;                                    // Dashboard which has relationship
    groupID: number;                                        // Group ID
    dashboardGroupRelationshipType: string;                 // Type of relationship: 
                                                            // - SharedWith
    dashboardGroupRelationshipRating: number;               // Rating
    dashboardGroupRelationshipCreatedDateTime: string;      // Created on
    dashboardGroupRelationshipCreatedUserID: string;        // Created by
    dashboardGroupRelationshipUpdatedDateTime: string;      // Updated on
    dashboardGroupRelationshipUpdatedUserID: string;        // Updated by
}