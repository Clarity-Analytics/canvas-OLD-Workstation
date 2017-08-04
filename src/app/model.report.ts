// Schema for the Report class

// Eazl
export class EazlReport {
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

export class EazlReportX {
    id: number;                         // Unique DB ID
    name: string;                       // Name
    package_id: number;                 // FK to DataSource
    package_permissions: [
        {
            package_permission: string;
        }
    ];
    specification: {
        fields: any;
        parameters: any;
        version: number;
    };
    fields: 
        {
            name: string;
            alias: string;
            aggfunc: string;
            scalarfunc: string;
        }
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
    // reportCode: string;                 // Code
    reportName: string;                 // Name
    // description: string;                // Description
    reportParameters: string;           // Parameters (optional)
    dataSourceID: number;               // FK to DataSource
    dataSourceParameters: string;       // Data Source Parameters
    reportFields: string[];             // Array of report fields, obtained from DB
    package_permissions: [
        {
            package_permission: string;
        }
    ];
    specification: {
        fields: any;
        parameters: any;
        version: number;
    };
    fields: 
        {
            name: string;
            alias: string;
            aggfunc: string;
            scalarfunc: string;
        }
    execute: string;
    permissions: [
        {
            permission: string;
        }
    ];
    url: string;
    reportData: any[];                  // Array (json) of data rows
    reportCreatedDateTime: string;      // Date time of creation
    reportCreatedUserName: string;      // UserName who created record
}