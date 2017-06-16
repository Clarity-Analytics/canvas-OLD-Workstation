// Schema for the User Access to Data Sources class

// Eazl
export class EazlDataSourceUserAccess {
	id: number;                   			// Data Source ID
	username: string;						// User who has acces
	type: string;       					// Type = Readonly, Update, Add, Delete, Full
	scope: string;      					// Applies to: All (records), context specific .. ?
}

// Canvas
export class DataSourceUserAccess {
	datasourceID: number;                   // Data Source ID
	username: string;						// User who has acces
	dataSourceUserAccessType: string;       // Type = Readonly, Update, Add, Delete, Full
	dataSourceUserAccessScope: string;      // Applies to: All (records), context specific .. ?
}