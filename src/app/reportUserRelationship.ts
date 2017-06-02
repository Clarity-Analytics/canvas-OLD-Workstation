// Schema for Report User Relationship
export class ReportUserRelationship {
    reportUserRelationshipID: number;                   // Unique ID
    userName: string;                                   // User who has relationship
    reportID: number;                                   // Report ID
    reportUserRelationshipType: string;                 // Type of relationship: Like, Rated, Owns
    reportUserRelationshipRating: number;               // Rating
    reportUserRelationshipCreatedDateTime: string;      // Created on
    reportUserRelationshipCreatedUserID: string;        // Created by
    reportUserRelationshipUpdatedDateTime: string;      // Updated on
    reportUserRelationshipUpdatedUserID: string;        // Updated by
}
