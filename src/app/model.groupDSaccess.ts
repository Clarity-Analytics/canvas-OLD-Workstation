// Schema for the Group Datasource Access class

// Eazl
export class EazlGroupDatasourceAccess {
	id: number;                                     // Group ID
	datasource_id: number;                          // Data Source ID
	access_type: string;            				// Type = Readonly, Update, Add, Delete, Full
	created_on: string;       						// Created on
	created_by: string;         					// Created by
	updated_on: string;       						// Updated on
	updated_by: string;         					// Updated by
}

// Canvas
export class GroupDatasourceAccess {
	groupID: number;                                // Group ID
	datasourceID: number;                           // Data Source ID
    groupDatasourceAccessAccessType: string;        // Type = Readonly, Update, Add, Delete, Full
	groupDatasourceAccessCreatedDateTime: string;   // Created on
	groupDatasourceAccessCreatedUserName: string;   // Created by
	groupDatasourceAccessUpdatedDateTime: string;   // Updated on
	groupDatasourceAccessUpdatedUserName: string;   // Updated by
}