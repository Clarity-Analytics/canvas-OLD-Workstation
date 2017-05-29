// Schema for the User-GroupMembership class (many - many)

// Users per Group 
export class UserGroupMembership {
    groupID: number;
    userName: string;
    userGroupMembershipCreatedDateTime: string;          // Created on
    userGroupMembershipCreatedUserID: string;            // Created by
    userGroupMembershipUpdatedDateTime: string;          // Updated on
    userGroupMembershipUpdatedUserID: string;            // Updated by
}