// Schema for the Group (for Users) class

// Users registered to use the system
export class Group {
    groupID: number;
    groupName: string;
    groupDescription: string;
    groupCreatedDateTime: string;          // Created on
    groupCreatedUserID: string;            // Created by
    groupUpdatedDateTime: string;          // Updated on
    groupUpdatedUserID: string;            // Updated by
}

// Group returned by REST, determined by Django
export interface EazlGroup {
    // Defines data model for User Entity
    id: number;
    name: string;
}