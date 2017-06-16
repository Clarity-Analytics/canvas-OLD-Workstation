// Schema for the Group Datasource Access class

// Eazl


// Canvas
export class GroupDatasourceAccess {
	groupID: number;                                    // Group ID
	datasourceID: number;                               // Data Source ID
    groupDatasourceAccessAccessType: string;            // Type = Readonly, Update, Add, Delete, Full
	groupDatasourceAccessCreatedDateTime: string;       // Created on
	groupDatasourceAccessCreatedUserID: string;         // Created by
	groupDatasourceAccessUpdatedDateTime: string;       // Updated on
	groupDatasourceAccessUpdatedUserID: string;         // Updated by
}