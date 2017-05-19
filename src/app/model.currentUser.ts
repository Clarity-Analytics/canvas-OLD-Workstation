// Schema for the current User class
// The currentUser is null at startup, and only set once logged in.
// It is used to check is a user is logged in, isAdmin, etc

export class CurrentUser {
    userName: string;      
    password: string;
    firstName: string;
    lastName: string;
    isAdmin: boolean;
    isStaff: boolean;
}