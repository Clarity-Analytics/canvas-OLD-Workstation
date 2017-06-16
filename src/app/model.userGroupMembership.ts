// Schema for the User-GroupMembership class (many - many)

// Eazl


// Canvas
export class UserGroupMembership {
    groupID: number;
    username: string;
    userGroupMembershipCreatedDateTime: string;          // Created on
    userGroupMembershipCreatedUserID: string;            // Created by
    userGroupMembershipUpdatedDateTime: string;          // Updated on
    userGroupMembershipUpdatedUserID: string;            // Updated by
}