// Schema for the Report class

// Eazl
export class EazlReportOLD {
    id: number;                         // Unique DB ID
    code: string;                       // Code
    name: string;                       // Name
    description: string;                // Description
    parameters: string;                 // Parameters (optional)
    datasource_id: number;              // FK to DataSource
    datasource_parameters: string;      // Data Source Parameters
    report_fields: string[];            // Array of report fields, obtained from DB
    report_data: any[];                 // Array (json) of data rows
    created_on: string;                 // Created on
    created_by: string;                 // Created by
}

export class EazlReport {
    id: number;                         // Unique DB ID
    name: string;                       // Name
    package_id: number;                 // FK to DataSource
    package_permissions: [
        {
            package_permission: string;
        }
    ];
    specification: any;
    fields: 
        [
        {
            name: string;
            alias: string;
            aggfunc: string;
            scalarfunc: string;
        }
        ]
    execute: string;
    permissions: [
        {
            permission: string;
        }
    ];
    url: string;

}

// Canvas
export class Report {
    reportID: number;                   // Unique DB ID
    reportCode: string;                 // Code
    reportName: string;                 // Name
    reportDescription: string;                // Description
    // reportParameters: string;           // Parameters (optional)
    dataSourceID: number;               // FK to DataSource
    // dataSourceParameters: string;       // Data Source Parameters
    // reportFields: string[];             // Array of report fields, obtained from DB
    reportPackagePermissions: [
        {
            package_permission: string;
        }
    ];
    reportSpecification: any;
    reportFields: 
        [
        {
            name: string;
            alias: string;
            aggfunc: string;
            scalarfunc: string;
        }
        ]
    reportFieldsString: string;                 // Stringified list of fields
    reportExecute: string;
    reportPermissions: [
        {
            permission: string;
        }
    ];
    reportUrl: string;
    reportData: any[];                  // Array (json) of data rows
    // reportCreatedDateTime: string;      // Date time of creation
    // reportCreatedUserName: string;      // UserName who created record
}