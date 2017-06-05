// Schema for Datasource per User, both via User & via Group membership

export class DatasourcesPerUser {
    datasourceID: number;                       // Datasource ID
    username: string;                           // User who has access
    datasourcesPerUserAccessVia: string;        // Username or Group
    datasourcesPerUserAccessType: string;       // Readonly, etc
}