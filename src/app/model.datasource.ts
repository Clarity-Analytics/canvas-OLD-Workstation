// Schema for the Data Source class

// Eazl
export class EazlDataSource {
    id: number;
    name: string;
    repository_id: number;
    compiled: boolean;
    parameters: string[];
    fields: string[];
    date_last_synced: string;
    last_sync_successful: boolean;
    last_sync_error: string;
    last_runtime_error: string;
    execute: string;
    permissions: string[];
    url: string;
}

export class EazlDataSourceUserPermissions {
    username: string;
    permissions: string[];                      // Permissions at model level per dashboard: 
            // add_package, assign_permission_package, change_package, delete_package, 
            // execute_package, package_owned_access, package_shared_access, 
            // remove_permission_package, view_package
}

export class EazlDataSourceGroupPermissions {
    username: string;
    permissions: string[];                      // Permissions at model level per dashboard: 
            // add_package, assign_permission_package, change_package, delete_package, 
            // execute_package, package_owned_access, package_shared_access, 
            // remove_permission_package, view_package
        }

// Canvas
// TODO: fields marked with * does NOT live in the packages
export class DataSource {
	datasourceID: number;                   // Data Source ID
	datasourceName: string;                 // DS Name
	datasourceDescription: string;          // DS full description
	datasourceDBname: string;               // *DB Name
	datasourceSource: string;               // *Only Overlay for now, future = undefined
	datasourceDBType: string;               // *DB Type, ie Postgress
	datasourceDBconnectionProd: string;     // *DB Prod Connection string
	datasourceDBconnectionTest: string;     // *DB Test Connection string
	datasourceEnvironment: string;          // *Environment - not sure what we last decided on this !?
	datasourceDataQuality: string;          // *Good (no issues), Warning (qualified), Bad (definate issues)
	datasourceDataIssues: [                 // *Array of logged data issues
        {
            dataIssueCreatedDate: string;   // *UserName who created / logged issue
            dataIssueCreatedUserName: string; // *Date logged
            dataIssueDescription: string;   // *Detailed description
            dataIssueStatus: string;        // *Open, Resolved / Closed
        }
    ];
    datasourceMaxRowsReturned: number;      // *Max number of row returned, 0 = all
    datasourceDefaultReturnFormat: string;  // *Data returned in JSON, csv, etc by default
    datasourceUserEditable: boolean;        // *True if users may edit this DS
	packageRepositoryID: number;            // Django repo 
	packageCompiled: boolean;               // Django field, True = compiled
	datasourceParameters: string[];         // Array of Django parameters
	datasourceFields: string[];             // Array of Django fields
	datasourceDateLastSynced: string;       // Django date when datasource was last synced
	datasourceLastSyncSuccessful: boolean;  // Django True = sync okay
	datasourceLastSyncError: string;        // Django last sync error
	datasourceLastRuntimeError: string;     // Django last runtime error
    datasourceExecuteURL: string;           // Django datasource execute url
    datasourcePermissions: string[];        // Array of Django permissions
	datasourceUrl: string;                  // Django datasource url 
    datasourceSQL: string;                  // *Django datasource SQL ?
	datasourceCreatedDateTime: string;      // *Created on
	datasourceCreatedUserName: string;      // *Created by
	datasourceUpdatedDateTime: string;      // *Updated on
    datasourceUpdatedUserName: string;      // *Updated by
}

export class DataSourceUserPermissions {
    username: string;
    canAddPackage: boolean;
    canAssignPermissionPackage: boolean;
    canChangePackage: boolean;
    canDeletePackage: boolean;
    canExecutePackage: boolean;
    canPackageOwnedAccess: boolean;
    canPackageSharedAccess: boolean;
    canRemovePermissionPackage: boolean;
    canViewPackage: boolean;
}
    
export class DataSourceGroupPermissions {
    groupName: string;
    canAddPackage: boolean;
    canAssignPermissionPackage: boolean;
    canChangePackage: boolean;
    canDeletePackage: boolean;
    canExecutePackage: boolean;
    canPackageOwnedAccess: boolean;
    canPackageSharedAccess: boolean;
    canRemovePermissionPackage: boolean;
    canViewPackage: boolean;
}
