// Schema for Datasource per User, both via User & via Group membership

// Eazl
export class EazlDatasourcesPerUser {
    id: number;                                 // Datasource ID
    name: string;                               // Datasource Name
    username: string;                           // User who has access
    access_via: string;                         // Username or Group
    access_type: string;                        // Readonly, etc
	created_on: string;       					// Created on
	created_by: string;         				// Created by
	updated_on: string;       					// Updated on
	updated_by: string;         				// Updated by
}

// Canvas
export class DatasourcesPerUser {
    datasourceID: number;                       // Datasource ID
    datasourceName: string;                     // Datasource Name
    userName: string;                           // User who has access
    datasourcesPerUserAccessVia: string;        // Username or Group
    datasourcesPerUserAccessType: string;       // Readonly, etc
	datasourcesPerUserCreatedDateTime: string; 	// Created on
	datasourcesPerUserCreatedUserName: string; 	// Created by
	datasourcesPerUserUpdatedDateTime: string; 	// Updated on
	datasourcesPerUserUpdatedUserName: string; 	// Updated by}
}