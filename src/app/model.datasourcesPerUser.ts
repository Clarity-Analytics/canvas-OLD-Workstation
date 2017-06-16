// Schema for Datasource per User, both via User & via Group membership

// Eazl
export interface EazlDatasourcesPerUser {
    id: number;                                 // Datasource ID
    name: string;                               // Datasource Name
    username: string;                           // User who has access
    access_via: string;                         // Username or Group
    access_type: string;                        // Readonly, etc
}

// Canvas
export interface DatasourcesPerUser {
    datasourceID: number;                       // Datasource ID
    datasourceName: string;                     // Datasource Name
    username: string;                           // User who has access
    datasourcesPerUserAccessVia: string;        // Username or Group
    datasourcesPerUserAccessType: string;       // Readonly, etc
}