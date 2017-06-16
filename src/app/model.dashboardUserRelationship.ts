// Schema for Dashboard User Relationship

// Eazl
export class EazlDashboardUserRelationship {
    id: number;                                             // Unique ID
    dashboard_id: number;                                   // Dashboard who has relationship
    username: string;                                       // User who has relationship
    type: string;                                           // Type of relationship: 
    rating: number;                                         // Rating
    created_on: string;                                     // Created on
    created_by: string;                                     // Created by
    updated_on: string;                                     // Updated on
    updated_by: string;                                     // Updated by
}

// Canvas
export class DashboardUserRelationship {
    dashboardUserRelationshipID: number;                    // Unique ID
    dashboardID: number;                                    // Dashboard who has relationship
    username: string;                                       // User who has relationship
    dashboardUserRelationshipType: string;                  // Type of relationship: 
                                                            // - SharedWith, Likes, Rates, Owns
    dashboardUserRelationshipRating: number;                // Rating
    dashboardUserRelationshipCreatedDateTime: string;       // Created on
    dashboardUserRelationshipCreatedUserID: string;         // Created by
    dashboardUserRelationshipUpdatedDateTime: string;       // Updated on
    dashboardUserRelationshipUpdatedUserID: string;         // Updated by
}