// Schema for the current User class
// The current User is stored in CanvasUser. It is null at startup, and only set once 
// logged in.  It is used to check is a user is logged in, isAdmin, etc

export class CanvasUser {
    userName: string;      
    firstName: string;
    lastName: string;
    isAdmin: boolean;
    isStaff: boolean;
}