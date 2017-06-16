// Schema for the User Access to Data Sources class

// Eazl
export class EazlDataSourceUserAccess {
	id: number;                   					// Data Source ID
	username: string;								// User who has acces
	type: string;       							// Type = Readonly, Update, Add, Delete, Full
	scope: string;      							// Applies to: All (records), context specific .. ?
	created_on: string;       						// Created on
	created_by: string;         					// Created by
	updated_on: string;       						// Updated on
	updated_by: string;         					// Updated by
}

// Canvas
export class DataSourceUserAccess {
	datasourceID: number;                   		// Data Source ID
	username: string;								// User who has acces
	dataSourceUserAccessType: string;       		// Type = Readonly, Update, Add, Delete, Full
	dataSourceUserAccessScope: string;      		// Applies to: All (records), context specific .. ?
	datasourceUserAccessCreatedDateTime: string; 	// Created on
	datasourceUserAccessCreatedUserID: string;   	// Created by
	datasourceUserAccessUpdatedDateTime: string; 	// Updated on
	datasourceUserAccessUpdatedUserID: string;   	// Updated by}
}
