// Schema for the Report User Relationship class

// Eazl


// Canvas
export class ReportUserRelationship {
    reportUserRelationshipID: number;                   // Unique ID
    username: string;                                   // User who has relationship
    reportID: number;                                   // Report ID
    reportUserRelationshipType: string;                 // Type of relationship: Likes, Rates, Owns
    reportUserRelationshipRating: number;               // Rating
    reportUserRelationshipCreatedDateTime: string;      // Created on
    reportUserRelationshipCreatedUserID: string;        // Created by
    reportUserRelationshipUpdatedDateTime: string;      // Updated on
    reportUserRelationshipUpdatedUserID: string;        // Updated by
}
