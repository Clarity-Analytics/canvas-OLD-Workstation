// Schema for Data Source

export class DataSource {
	datasourceID: string;                   // Data Source ID
	datasourceName: string;                 // DS Name
	datasourceDescription: string;          // DS full description
	datasourceDBname: string;               // DB Name
	datasourceSource: string;               // Only Overlay for now, future = undefined
	datasourceDBType: string;               // DB Type, ie Postgress
	datasourceDBconnectionProd: string;     // DB Prod Connection string
	datasourceDBconnectionTest: string;     // DB Test Connection string
	datasourceEnvironment: string;          // Environment - not sure what we last decided on this !?
	datasourceDataQuality: string;          // Good (no issues), Warning (qualified), Bad (definate issues)
	datasourceDataIssues: [                 // Array of logged data issues
        {
            dataIssueCreatedDate: string;   // UserID who created / logged issue
            dataIssueCreatedUserID;         // Date logged
            dataIssueDescription;           // Detailed description
            dataIssueStatus;                // Open, Resolved / Closed
        }
    ];
    datasourceMaxRowsReturned: number;      // Max number of row returned, 0 = all
    datasourceDefaultReturnFormat: string;  // Data returned in JSON, csv, etc by default
    datasourceAccessUserID: [               // Array of UserIDs with access
        {
            accessUserID: string;           // UserID with access
            accessType: string;             // Type = Readonly, Update, Add, Delete, Full
            accessScope: string;            // Applies to: All (records), context specific .. ?
        }
    ];
    datasourceAccessGroups: [               // Array of groups with access
        {
            accessGroup: string;            // Group with access
            accessType: string;             // Type = Readonly, Update, Add, Delete, Full
        }
    ];
    datasourceUserEditable: boolean;        // True if users may edit this DS    
    packagePk: number;                      // Django pk
	packageName: string;                    // Django name of package
	packageRepository: string;              // Django repo name
	packageCompiled: boolean;               // Django field, True = compiled
	datasourceParameters: [                 // Array of Django parameters
        {
            name: string;                   // Django parameter name
            value: string;                  // Django paramter value
            parser: string;                 // Django parameter parser
        }
    ];
	datasourceFields: [                     // Array of Django fields
        {
            name: string;                   // Django field name
            dtype: string;                  // Django field type
        }
    ];
	datasourceQueries: [                    // Array Django Queries
        {
            name: string;                   // Django query name
            parameters: string;             // Django query parameter
        }
    ];
	datasourceDateLastSynced: string;       // Django date when datasource was last synced
	datasourceLastSyncSuccessful: boolean;  // Django True = sync okay
	datasourceLastSyncError: string;        // Django last sync error
	datasourceLastRuntimeError: string;     // Django last runtime error
	datasourceExecuteURL: string;           // Django datasource execute url
	datasourceUrl: string;                  // Django datasource url ??
    datasourceSQL: string;                  // Django datasource SQL ?
	datasourceCreatedDateTime: string;      // Created on
	datasourceCreatedUserID: string;        // Created by
	datasourceUpdatedDateTime: string;      // Updated on
	datasourceUpdatedUserID: string;        // Updated by
    
}












