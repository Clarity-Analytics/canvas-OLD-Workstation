// Schema for the User classes

// Users registered to use the system
export class User {
    userID: string;
    firstName: string;
    lastName: string;
    nickName: string;
    photoPath: string;
    lastDatetimeLoggedIn: string;
    lastDatetimeReportWasRun: string;
    emailAddress: string;
    cellNumber: string;
    workTelephoneNumber: string;
    workExtension: string;
    activeFromDate: string;
    inactiveDate: string;
    dateCreated: string;
    userIDLastUpdated: string;
    isStaff: boolean;
    extraString1: string;
    extraString10: string;
    extraDate1: string;
    extraDate10: string;
    extraBoolean1: boolean;
    extraBoolean10: boolean;
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