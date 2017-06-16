// Schema for Datasource per User, both via User & via Group membership

// Eazl

// Canvas
export interface DatasourcesPerUser {
    datasourceID: number;                       // Datasource ID
    datasourceName: string;                     // Datasource Name
    username: string;                           // User who has access
    datasourcesPerUserAccessVia: string;        // Username or Group
    datasourcesPerUserAccessType: string;       // Readonly, etc
}