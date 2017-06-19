// Schema for the Report User Relationship class

// Eazl
export class EazlReportUserRelationship {
    id: number;                                         // Unique ID
    username: string;                                   // User who has relationship
    report_id: number;                                  // Report ID
    type: string;                                       // Type of relationship: Likes, Rates, Owns
    rating: number;                                     // Rating
    created_on: string;                                 // Created on
    created_by: string;                                 // Created by
    updated_on: string;                                 // Updated on
    updated_by: string;                                 // Updated by
}

// Canvas
export class ReportUserRelationship {
    reportUserRelationshipID: number;                   // Unique ID
    userName: string;                                   // User who has relationship
    reportID: number;                                   // Report ID
    reportUserRelationshipType: string;                 // Type of relationship: Likes, Rates, Owns
    reportUserRelationshipRating: number;               // Rating
    reportUserRelationshipCreatedDateTime: string;      // Created on
    reportUserRelationshipCreatedUserName: string;      // Created by
    reportUserRelationshipUpdatedDateTime: string;      // Updated on
    reportUserRelationshipUpdatedUserName: string;      // Updated by
}
