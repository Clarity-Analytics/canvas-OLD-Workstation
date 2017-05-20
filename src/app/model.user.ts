// Schema for the User classes

// Users registered to use the system
export class User {
    userName: string;
    firstName: string;
    lastName: string;
    nickName: string;
    photoPath: string;
    lastDatetimeLoggedIn: string;
    lastDatetimeReportWasRun: string;
    emailAddress: string;
    cellNumber: string;
    workTelephoneNumber: string;
    activeFromDate: string;
    inactiveDate: string;
    dateCreated: string;
    userIDLastUpdated: string;
    isStaff: boolean;
}
 
// User returned by REST, determined by Django
export interface EazlUser {
    // Defines data model for User Entity
    pk: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    is_superuser: boolean;
    is_staff: boolean;
    is_active: boolean;
    date_joined: Date;
    last_login: Date;
}
 
// Current user info in Canvas
export class CanvasUser implements EazlUser {
    pk: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    is_superuser: boolean;
    is_staff: boolean;
    is_active: boolean;
    date_joined: Date;
    last_login: Date;

    constructor() { }
} 