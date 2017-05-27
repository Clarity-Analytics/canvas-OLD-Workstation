// Schema for the User-GroupMembership classes (many - many)

// Users per group 
export class UserGroupMembership {
    groupID: number;
    userName: string;
    userGroupMembershipCreatedDateTime: string;          // Created on
    userGroupMembershipCreatedUserID: string;            // Created by
    userGroupMembershipUpdatedDateTime: string;          // Updated on
    userGroupMembershipUpdatedUserID: string;            // Updated by
}