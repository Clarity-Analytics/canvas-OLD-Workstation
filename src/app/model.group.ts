// Schema for the Group (for Users) class

// Eazl
export class EazlGroup {
    id: number;
    name: string;
    profile: {                              // Separate model in Django
        description: string;
        date_created: Date;
    };
    users: string[];
    url: string;
}

// Canvas
export class Group {
    groupID: number;                        // RESTi unique id
    groupName: string;                      // Name
    groupDescription: string;               // Description
    users: string[];                        // Array of Users in this group
    url: string;                            // DRF url
    groupCreatedDateTime: string;           // Created on
    groupCreatedUserName: string;           // Created by
    groupUpdatedDateTime: string;           // Updated on
    groupUpdatedUserName: string;           // Updated by
}
