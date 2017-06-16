// Schema for the User-GroupMembership class (many - many)

// Eazl
export class EazlUserGroupMembership {
    id: number;
    username: string;
    created_on: string;                                 // Created on
    created_by: string;                                 // Created by
    updated_on: string;                                 // Updated on
    updated_by: string;                                 // Updated by
}

// Canvas
export class UserGroupMembership {
    groupID: number;
    username: string;
    userGroupMembershipCreatedDateTime: string;          // Created on
    userGroupMembershipCreatedUserID: string;            // Created by
    userGroupMembershipUpdatedDateTime: string;          // Updated on
    userGroupMembershipUpdatedUserID: string;            // Updated by
}