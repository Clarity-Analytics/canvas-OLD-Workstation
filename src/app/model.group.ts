// Schema for the Group (for Users) class

// TODO - we need more fields in DB - sort out somehow
// Eazl
export interface EazlGroup {
    // Defines data model for User Entity
    id: number;
    name: string;
    profile: {
        description: string;
        date_created: Date;
    };
    users: string[];
    url: string;
}

// Users registered to use the system
export class Group {
    groupID: number;
    groupName: string;
    groupDescription: string;
    groupCreatedDateTime: string;          // Created on
    groupCreatedUserName: string;          // Created by
    groupUpdatedDateTime: string;          // Updated on
    groupUpdatedUserName: string;          // Updated by
}
