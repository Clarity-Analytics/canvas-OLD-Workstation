// Schema for User Access to Data Sources

export class DataSourceUserAccess {
	datasourceID: number;                   // Data Source ID
	userName: string;						// User who has acces
	accessType: string;             		// Type = Readonly, Update, Add, Delete, Full
	accessScope: string;            		// Applies to: All (records), context specific .. ?
}