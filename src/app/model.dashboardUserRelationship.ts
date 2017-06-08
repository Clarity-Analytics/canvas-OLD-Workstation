// Schema for Dashboard User Relationship

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