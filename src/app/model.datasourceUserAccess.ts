// Schema for User Access to Data Sources

export class DataSourceUserAccess {
	datasourceID: number;                   // Data Source ID
	username: string;						// User who has acces
	dataSourceUserAccessType: string;       // Type = Readonly, Update, Add, Delete, Full
	dataSourceUserAccessScope: string;      // Applies to: All (records), context specific .. ?
}