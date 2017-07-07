// Service that manages all Canvas data (to and from the DB)

// There are two types of data:
// a. system related data (users, groups, etc).  These are read async at login.
// b. application / user data, stored in a DB.  These are only read on request, where
//    small sets are read and stored as local Arrays, and large sets can point to a url
//    that keeps the json file.  Application data is reuested async, and notification
//    about the completion (fail or pass) is done via the WebSocket.

// Process for reading system data:
// 1. At start (before login) all system resources are marked as dirty.
// 2. At login, Canvas issues async requests for all system data.
// 3. This component will issue an http-get request, and transform the result
//    (Eazl -> Canvas format).  This method currently lives in CDAL, but will probably move.
// 4. The Canvas formatted data is stored in local Arrays.
// 5. All DSs are now marked as clean.
// 6. When a Canvas module needs data, it issues a get-DS (DS = DataSource) request to
//    this module.
// 7. It simply returns the local Array (with filtering and additional calculated
//    data where necessary).
// Note:  it does not check if there is data in the Array, or if the data is clean.
//        It knows when a DS is dirty, so in time we may issue a warning to the user.

// Keeping system data in sync (up to date):
// 1. At login, a single WebSocket is opened to the API that listens permanently.
// 2. When system data is changed on the server, the API sends a message to all active
//    users (logged in at that point in time).
// 3. On receipt of a message, Canvas marks that data-source as dirty.
// 4. This component will issue an http-get request to get the latest copy of the data,
//    and transform the result (Eazl -> Canvas format).  This method currently lives
//    in CDAL, but will probably move.
// 5. The Canvas formatted data is stored in a local Array.
// 6. It will mark the DS as clean.
// 7. These updates happens in the background, and no feedback is given to users about it.

// Process for changes to system data:
// 1. This component is the only place where data is read or updated.
// 2. The Canvas component issues data-related requests to this component as
//    add-, delete-, update-DS requests.
// 3. This component will transform the data (Canvas -> Eazl or API format).
// 4. It will issue a http-put or -post request.
// 5. It will update the local Array to make sure it is in sync.
// 6. It will inform the calling component if the request was sucessful.

import { Injectable }                 from '@angular/core';
import { Headers }                    from '@angular/http';
import { Http }                       from '@angular/http';
import { isDevMode }                  from '@angular/core';
import { Observable }                 from 'rxjs/Observable';
import { OnInit }                     from '@angular/core';
import { Response }                   from '@angular/http';
import { RequestOptions }             from '@angular/http';

//  PrimeNG stuffies
import { SelectItem }                 from 'primeng/primeng';

// Our Services
import { CanvasDate }                 from './date.services';
import { CDAL }                       from './cdal.service';
import { GlobalFunctionService }      from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';
import { ReconnectingWebSocket }      from './websocket.service';

// Our models
import { CanvasMessage }              from './model.canvasMessage';
import { CanvasMessageRecipient }     from './model.canvasMessageRecipient';
import { CanvasUser }                 from './model.user';
import { Dashboard }                  from './model.dashboards';
import { DashboardsPerUser }          from './model.dashboardsPerUser';
import { DashboardGroup }             from './model.dashboardGroup';
import { DashboardGroupMembership }   from './model.dashboardGroupMembership';
import { DashboardGroupRelationship } from './model.dashboardGroupRelationship';
import { DashboardTab }               from './model.dashboardTabs';
import { DashboardUserRelationship }  from './model.dashboardUserRelationship';
import { DataSource }                 from './model.datasource';
import { DataSourceUserAccess }       from './model.datasourceUserAccess';
import { DatasourcesPerUser }         from './model.datasourcesPerUser';
import { EazlAppData }                from './model.appdata';
import { EazlDataSourceUserAccess }   from './model.datasourceUserAccess';
import { EazlDatasourcesPerUser }     from './model.datasourcesPerUser';
import { EazlDashboard }              from './model.dashboards';
import { EazlCanvasMessage }          from './model.canvasMessage';
import { EazlCanvasMessageRecipient } from './model.canvasMessageRecipient';
import { EazlDashboardGroup }         from './model.dashboardGroup';
import { EazlDashboardGroupMembership }     from './model.dashboardGroupMembership';
import { EazlDashboardGroupRelationship }   from './model.dashboardGroupRelationship';
import { EazlDashboardTab }           from './model.dashboardTabs';
import { EazlDashboardsPerUser }      from './model.dashboardsPerUser';
import { EazlDashboardUserRelationship }    from './model.dashboardUserRelationship';
import { EazlFilter }                 from './model.filter';
import { EazlGroup }                  from './model.group';
import { EazlNotification }           from './model.notification';
import { EazlPackageTask }            from './model.package.task';
import { EazlPersonalisation }        from  './model.personalisation';
import { EazlReport }                 from './model.report';
import { EazlReportHistory }          from './model.reportHistory';
import { EazlReportUserRelationship } from './model.reportUserRelationship';
import { EazlReportWidgetSet }        from './model.report.widgetSets';
import { EazlSystemConfiguration }    from './model.systemconfiguration';
import { EazlUser }                   from './model.user';
import { EazlUserGroupMembership }    from './model.userGroupMembership';
import { EazlWidget }                 from './model.widget';
import { EazlWidgetComment }          from './model.widget.comment';
import { EazlWidgetTemplate }         from './model.widgetTemplates';
import { Filter }                     from './model.filter';
import { GraphType }                  from './model.graph.type';
import { Group }                      from './model.group';
import { GroupDatasourceAccess }      from './model.groupDSaccess';
import { EazlGroupDatasourceAccess }  from './model.groupDSaccess';
import { Notification }               from './model.notification';
import { PackageTask }                from './model.package.task';
import { Personalisation }            from  './model.personalisation';
import { Report }                     from './model.report';
import { ReportHistory }              from './model.reportHistory';
import { ReportUserRelationship }     from './model.reportUserRelationship';
import { ReportWidgetSet }            from './model.report.widgetSets';
import { SelectedItem }               from './model.selectedItem';
import { SystemConfiguration }        from './model.systemconfiguration';
import { User }                       from './model.user';
import { UserGroupMembership }        from './model.userGroupMembership';
import { Widget }                     from './model.widget';
import { WidgetComment }              from './model.widget.comment';
import { WidgetTemplate }             from './model.widgetTemplates';
import { WidgetType }                 from './model.widget.type';


// Token for RESTi
export interface Token {
	token: string;
}

var req = new XMLHttpRequest();

// TODO - use RESTi
export const SYSTEMCONFIGURATION: SystemConfiguration =
    {
        systemConfigurationID: 0,
        backendUrl: 'localhost:8000',
        companyLogo: '',
        companyName: 'Clarity',
        defaultDaysToKeepResultSet: 3,
        maxRowsDataReturned: 1000000,
        maxRowsPerWidgetGraph: 15,
    }

export const ISSTAFFDROPDOWN: SelectItem[] =
    [
        {
            label: 'Select option',
            value: ''
        },
        {
            label: 'Is Staff Member',
            value: 'True'
        },
        {
            label: 'Non-staff',
            value: 'False'
        },
    ]

export const ISSUPERUSERDROPDOWN: SelectItem[] =
    [
        {
            label: 'Select option',
            value: ''
        },
        {
            label: 'Is Superuser',
            value: 'True'
        },
        {
            label: 'Normal staff',
            value: 'False'
        }
    ]

// const BORDERDROPDOWNS replaced with API data
    // export const BORDERDROPDOWNS: SelectItem[] =
    //     [
    //         {
    //             label: 'None',
    //             value:
    //                 {
    //                     id: 0,
    //                     name: 'transparent'
    //                 }
    //         },
    //         {
    //             label: 'Thick Black',
    //             value:
    //                 {
    //                     id: 1,
    //                     name: '3px solid black'
    //                 }
    //         },
    //         {
    //             label: 'Thin Black',
    //             value:
    //                 {
    //                     id: 2,
    //                     name: '1px solid black'
    //                 }
    //         },
    //         {
    //             label: 'Thin White',
    //             value:
    //                 {
    //                     id: 3,
    //                     name: '1px solid white'
    //                 }
    //         },
    //         {
    //             label: 'Thin Red',
    //             value:
    //                 {
    //                     id: 4,
    //                     name: '1px solid red'
    //                 }
    //         },
    //         {
    //             label: 'Thin Gray',
    //             value:
    //                 {
    //                     id: 5,
    //                     name: '1px solid gray'
    //                 }
    //         }
    //     ];

// const BOXSHADOWDROPDOWNS replaced with API data
    // export const BOXSHADOWDROPDOWNS: SelectItem[] =
    //     [
    //         {
    //             label: 'None',
    //             value:
    //                 {
    //                     id: 0,
    //                     name: ''
    //                 }
    //         },
    //         {
    //             label: 'Black',
    //             value:
    //                 {
    //                     id: 1,
    //                     name: '2px 2px 12px black'
    //                 }
    //         },
    //         {
    //             label: 'Gray',
    //             value:
    //                 {
    //                     id: 2,
    //                     name: '2px 2px 12px gray'
    //                 }
    //         },
    //         {
    //             label: 'White',
    //             value:
    //                 {
    //                     id: 3,
    //                     name: '2px 2px 12px white'
    //                 }
    //         },
    //     ];

// const FONTSIZEDROPDOWNS replaced with API data
    // export const FONTSIZEDROPDOWNS: SelectItem[] =
    //     [
    //         {
    //             label: '0.5em',
    //             value:
    //                 {
    //                     id: 0,
    //                     name: '0.5'
    //                 }
    //         },
    //         {
    //             label: '0.75em',
    //             value:
    //                 {
    //                     id: 1,
    //                     name: '0.75'
    //                 }
    //         },
    //         {
    //             label: '1em',
    //             value:
    //                 {
    //                     id: 2,
    //                     name: '1'
    //                 }
    //         },
    //         {
    //             label: '1.25em',
    //             value:
    //                 {
    //                     id: 3,
    //                     name: '1.25'
    //                 }
    //         },
    //         {
    //             label: '1.5em',
    //             value:
    //                 {
    //                     id: 4,
    //                     name: '1.5'
    //                 }
    //         },
    //         {
    //             label: '2em',
    //             value:
    //                 {
    //                     id: 5,
    //                     name: '2'
    //                 }
    //         },
    //     ];


// const FONTWEIGHTDROPDOWNS replaced with API data
    export const FONTWEIGHTDROPDOWNS: SelectItem[] =
        [
            {
                label: 'Normal',
                value:
                    {
                        id: 0,
                        name: 'normal'
                    }
            },
            {
                label: 'Bold',
                value:
                    {
                        id: 1,
                        name: 'bold'
                    }
            }
        ]

// const TEXTMARGINDROPDOWNS replaced with API data
    // export const TEXTMARGINDROPDOWNS: SelectItem[] =
    //     [
    //         {
    //             label: 'None',
    //             value:
    //                 {
    //                     id: 0,
    //                     name: '0'
    //                 }
    //         },
    //         {
    //             label: 'Small',
    //             value:
    //                 {
    //                     id: 1,
    //                     name: '5px 5px 5px 5px'
    //                 }
    //         },
    //         {
    //             label: 'Medium',
    //             value:
    //                 {
    //                     id: 2,
    //                     name: '20px 20px 20px 20px'
    //                 }
    //         },
    //         {
    //             label: 'Large',
    //             value:
    //                 {
    //                     id: 3,
    //                     name: '50px 50px 50px 50px'
    //                 }
    //         }
    //     ]

// const TEXTPADDINGDROPDOWNS replaced with API data
    export const TEXTPADDINGDROPDOWNS: SelectItem[] =
        [
            {
                label: 'None',
                value:
                    {
                        id: 0,
                        name: '0'
                    }
            },
            {
                label: 'Small',
                value:
                    {
                        id: 1,
                        name: '5px 5px 5px 5px'
                    }
            },
            {
                label: 'Medium',
                value:
                    {
                        id: 2,
                        name: '20px 20px 20px 20px'
                    }
            },
            {
                label: 'Large',
                value:
                    {
                        id: 3,
                        name: '50px 50px 50px 50px'
                    }
            }
        ]

// const TEXTPOSITIONDROPDOWNS replaced with API data
    export const TEXTPOSITIONDROPDOWNS: SelectItem[] =
        [
            {
                label: 'Relative',
                value:
                    {
                        id: 0,
                        name: 'relative'
                    }
            },
            {
                label: 'Absolute',
                value:
                    {
                        id: 1,
                        name: 'absolute'
                    }
            }
        ]

// const TEXTALIGNDROPDOWNS replaced with API data
    export const TEXTALIGNDROPDOWNS: SelectItem[] =
        [
            {
                label: 'Left',
                value:
                    {
                        id: 0,
                        name: 'left'
                    }
            },
            {
                label: 'Center',
                value:
                    {
                        id: 1,
                        name: 'center'
                    }
            },
            {
                label: 'Right',
                value:
                    {
                        id: 2,
                        name: 'right'
                    }
            }
        ]

// const IMAGESOURCEDROPDOWNS replaced with API data
    export const IMAGESOURCEDROPDOWNS: SelectItem[] =
        [
            {
                label: 'Coffee',
                value:
                    {
                        id: 1,
                        name: '../assets/coffee.jpg'
                    }
            }
        ]

// const GRIDSIZEDROPDOWNS replaced with API data
    // export const GRIDSIZEDROPDOWNS: SelectItem[] =
    //     [
    //         {
    //             label: '1px',
    //             value:
    //                 {
    //                     id: 1,
    //                     name: '1'
    //                 }
    //         },
    //         {
    //             label: '2px',
    //             value:
    //                 {
    //                     id: 2,
    //                     name: '2'
    //                 }
    //         },
    //         {
    //             label: '3px',
    //             value:
    //                 {
    //                     id: 3,
    //                     name: '3'
    //                 }
    //         },
    //         {
    //             label: '4px',
    //             value:
    //                 {
    //                     id: 4,
    //                     name: '4'
    //                 }
    //         },
    //         {
    //             label: '5px',
    //             value:
    //                 {
    //                     id: 5,
    //                     name: '5'
    //                 }
    //         },
    //         {
    //             label: '6px',
    //             value:
    //                 {
    //                     id: 6,
    //                     name: '6'
    //                 }
    //         },
    //         {
    //             label: '9px',
    //             value:
    //                 {
    //                     id: 9,
    //                     name: '9'
    //                 }
    //         },
    //         {
    //             label: '12px',
    //             value:
    //                 {
    //                     id: 12,
    //                     name: '12'
    //                 }
    //         },
    //         {
    //             label: '18px',
    //             value:
    //                 {
    //                     id: 18,
    //                     name: '18'
    //                 }
    //         },
    //         {
    //             label: '24px',
    //             value:
    //                 {
    //                     id: 24,
    //                     name: '24'
    //                 }
    //         },
    //         {
    //             label: '30px',
    //             value:
    //                 {
    //                     id: 30,
    //                     name: '30'
    //                 }
    //         },
    //     ];

// const BACKGROUNDIMAGEDROPDOWNS replaced with API data
    // export const BACKGROUNDIMAGEDROPDOWNS: SelectItem[] =
    //     [
    //         {
    //             label: 'None',
    //             value:
    //                 {
    //                     id: 1,
    //                     name: ''
    //                 }
    //         },
    //         {
    //             label: 'Dolphin',
    //             value:
    //                 {
    //                     id: 1,
    //                     name: "url('../assets/CanvasBackgroundImages/dolphin-1078319_1280.jpg')"
    //                 }
    //         },
    //         {
    //             label: 'River Sunset',
    //             value:
    //                 {
    //                     id: 1,
    //                     name: "url('../assets/CanvasBackgroundImages/River Sunset.png')"
    //                 }
    //         },
    //         {
    //             label: 'Snow Landscape',
    //             value:
    //                 {
    //                     id: 1,
    //                     name: "url('../assets/CanvasBackgroundImages/snow landscape.jpg')"
    //                 }
    //         },
    //     ];

// const GRAPHTYPES replaced with API data
    export const GRAPHTYPES: GraphType[] =
        [
            {
                label: 'BarChart',
                value: {
                    id: 0,
                    name: 'BarChart'
                }
            },
            {
                label: 'PieChart',
                value: {
                    id: 2,
                    name: 'PieChart'
                }
            },
            {
                label: 'LineChart',
                value: {
                    id: 3,
                    name: 'LineChart'
                }
            },
        ];

// const WIDGETTYPES replaced with API data
    // export const WIDGETTYPES: WidgetType[] =
    //     [
    //         {
    //             label: 'WidgetSet',
    //             value: {
    //                 id: 0,
    //                 name: 'WidgetSet'
    //             }
    //         },
    //         {
    //             label: 'BarChart',
    //             value: {
    //                 id: 1,
    //                 name: 'BarChart'
    //             }
    //         },
    //         {
    //             label: 'PieChart',
    //             value: {
    //                 id: 2,
    //                 name: 'PieChart'
    //             }
    //         },
    //         {
    //             label: 'LineChart',
    //             value: {
    //                 id: 3,
    //                 name: 'LineChart'
    //             }
    //         },
    //         {
    //             label: 'Custom',
    //             value: {
    //                 id: 4,
    //                 name: 'Custom'
    //             }
    //         }
    //     ];

export const PERSONALISATION: Personalisation =
    {
        personalisationID: 0,
        averageWarningRuntime: 3,
        dashboardIDStartup: -1,
        environment: 'Live',
        frontendColorScheme: 'beige',
        defaultReportFilters: '',
        defaultWidgetConfiguration: '',
        gridSize: 3,
        growlLife: 3,
        growlSticky: false,
        snapToGrid: true
    };

export const DATASOURCEUSERACCESS: DataSourceUserAccess[] =
    [
        {
            datasourceID: 0,
            userName: 'janniei',
            dataSourceUserAccessType: 'Readonly',         // Type = Readonly, Update, Add, Delete, Full
            dataSourceUserAccessScope: 'All',             // Applies to: All (records), context specific .. ?
            datasourceUserAccessCreatedDateTime: '2017/05/01',
            datasourceUserAccessCreatedUserName: 'janniei',
            datasourceUserAccessUpdatedDateTime: '2017/05/01',
            datasourceUserAccessUpdatedUserName: 'janniei'
        },
        {
            datasourceID: 1,
            userName: 'janniei',
            dataSourceUserAccessType: 'Full',             // Type = Readonly, Update, Add, Delete, Full
            dataSourceUserAccessScope: 'All',             // Applies to: All (records), context specific .. ?
            datasourceUserAccessCreatedDateTime: '2017/05/01',
            datasourceUserAccessCreatedUserName: 'janniei',
            datasourceUserAccessUpdatedDateTime: '2017/05/01',
            datasourceUserAccessUpdatedUserName: 'janniei'
        },
        {
            datasourceID: 0,
            userName: 'bradleyk',
            dataSourceUserAccessType: 'Readonly',         // Type = Readonly, Update, Add, Delete, Full
            dataSourceUserAccessScope: 'All',             // Applies to: All (records), context specific .. ?
            datasourceUserAccessCreatedDateTime: '2017/05/01',
            datasourceUserAccessCreatedUserName: 'janniei',
            datasourceUserAccessUpdatedDateTime: '2017/05/01',
            datasourceUserAccessUpdatedUserName: 'janniei'
        },
        {
            datasourceID: 1,
            userName: 'bradleyk',
            dataSourceUserAccessType: 'Add',              // Type = Readonly, Update, Add, Delete, Full
            dataSourceUserAccessScope: 'All',             // Applies to: All (records), context specific .. ?
            datasourceUserAccessCreatedDateTime: '2017/05/01',
            datasourceUserAccessCreatedUserName: 'janniei',
            datasourceUserAccessUpdatedDateTime: '2017/05/01',
            datasourceUserAccessUpdatedUserName: 'janniei'
        }
    ];

export const REPORTHISTORY: ReportHistory[] =
    [
        {
            reportHistoryID: 0,
            userName: 'janniei',
            reportID: 1,
            datasourceID: 0,
            reportHistoryStartDateTime: '2017/05/01 08:21',
            reportHistoryEndDateTime: '2017/05/01 08:24',
            reportHistoryStatus: 'Succes',
            reportHistoryNrRowsReturned: 12,
            reportHistoryComments: ''
        },
        {
            reportHistoryID: 1,
            userName: 'janniei',
            reportID: 2,
            datasourceID: 0,
            reportHistoryStartDateTime: '2017/05/01 08:21',
            reportHistoryEndDateTime: '2017/05/01 08:24',
            reportHistoryStatus: 'Succes',
            reportHistoryNrRowsReturned: 12,
            reportHistoryComments: ''
        },
        {
            reportHistoryID: 2,
            userName: 'janniei',
            reportID: 1,
            datasourceID: 0,
            reportHistoryStartDateTime: '2017/05/01 08:21',
            reportHistoryEndDateTime: '2017/05/01 08:24',
            reportHistoryStatus: 'Failed',
            reportHistoryNrRowsReturned: 12,
            reportHistoryComments: ''
        },
        {
            reportHistoryID: 3,
            userName: 'janniei',
            reportID: 1,
            datasourceID: 1,
            reportHistoryStartDateTime: '2017/05/01 08:21',
            reportHistoryEndDateTime: '2017/05/01 08:24',
            reportHistoryStatus: 'Succes',
            reportHistoryNrRowsReturned: 12,
            reportHistoryComments: 'At last'
        },
        {
            reportHistoryID: 4,
            userName: 'bradleyk',
            reportID: 1,
            datasourceID: 1,
            reportHistoryStartDateTime: '2017/05/01 08:21',
            reportHistoryEndDateTime: '2017/05/01 08:24',
            reportHistoryStatus: 'Succes',
            reportHistoryNrRowsReturned: 12,
            reportHistoryComments: ''
        },
    ];

export const REPORTUSERRELATIONSHIP: ReportUserRelationship[] =
    [
        {
            reportUserRelationshipID: 0,
            userName: 'janniei',
            reportID: 1,
            reportUserRelationshipType: 'Owns',
            reportUserRelationshipRating: 0,
            reportUserRelationshipCreatedDateTime: '2017/05/01 14:21',
            reportUserRelationshipCreatedUserName: 'janniei',
            reportUserRelationshipUpdatedDateTime: '2017/05/01 14:21',
            reportUserRelationshipUpdatedUserName: 'janniei'
        },
        {
            reportUserRelationshipID: 0,
            userName: 'bradleyk',
            reportID: 1,
            reportUserRelationshipType: 'Owns',
            reportUserRelationshipRating: 0,
            reportUserRelationshipCreatedDateTime: '2017/05/01 14:21',
            reportUserRelationshipCreatedUserName: 'janniei',
            reportUserRelationshipUpdatedDateTime: '2017/05/01 14:21',
            reportUserRelationshipUpdatedUserName: 'janniei'
        }
    ];

export const DATASOURCES: DataSource[] =
    [
        {
            datasourceID: 0,
            datasourceName: 'Overlay Packages',
            datasourceDescription: 'Complete list of packages on Overlay',
            datasourceDBname: '',
            datasourceSource: '',
            datasourceDBType: '',
            datasourceDBconnectionProd: '',
            datasourceDBconnectionTest: '',
            datasourceEnvironment: '',
            datasourceDataQuality: '',
            datasourceDataIssues: [
                {
                    dataIssueCreatedDate: '',
                    dataIssueCreatedUserName: '',
                    dataIssueDescription: '',
                    dataIssueStatus: '',
                }
            ],
            datasourceMaxRowsReturned: 0,
            datasourceDefaultReturnFormat: '',
            datasourceUserEditable: false,
            packagePk: 0,
            packageName: '',
            packageRepository: '',
            packageCompiled: false,
            datasourceParameters:
            [
                {
                    name: '',
                    value: '',
                    parser: '',
                }
            ],
            datasourceFields: [                     // Array of Django fields
                {
                    name: '',
                    dtype: '',
                }
            ],
            datasourceQueries: [
                {
                    name : '',
                    parameters : '',
                }
            ],
            datasourceDateLastSynced: '',
            datasourceLastSyncSuccessful: false,
            datasourceLastSyncError: '',
            datasourceLastRuntimeError: '',
            datasourceExecuteURL: '',
            datasourceUrl: '',
            datasourceSQL: '',
            datasourceCreatedDateTime: '',
            datasourceCreatedUserName: '',
            datasourceUpdatedDateTime: '',
            datasourceUpdatedUserName: ''
        },
        {
            datasourceID: 1,
            datasourceName: 'Overlay Reports',
            datasourceDescription: 'Complete list of reports on Overlay',
            datasourceDBname: '',
            datasourceSource: '',
            datasourceDBType: '',
            datasourceDBconnectionProd: '',
            datasourceDBconnectionTest: '',
            datasourceEnvironment: '',
            datasourceDataQuality: '',
            datasourceDataIssues: [
                {
                    dataIssueCreatedDate: '',
                    dataIssueCreatedUserName: '',
                    dataIssueDescription: '',
                    dataIssueStatus: '',
                }
            ],
            datasourceMaxRowsReturned: 0,
            datasourceDefaultReturnFormat: '',
            datasourceUserEditable: false,
            packagePk: 0,
            packageName: '',
            packageRepository: '',
            packageCompiled: false,
            datasourceParameters:
            [
                {
                    name: '',
                    value: '',
                    parser: '',
                }
            ],
            datasourceFields: [                     // Array of Django fields
                {
                    name: '',
                    dtype: '',
                }
            ],
            datasourceQueries: [
                {
                    name : '',
                    parameters : '',
                }
            ],
            datasourceDateLastSynced: '',
            datasourceLastSyncSuccessful: false,
            datasourceLastSyncError: '',
            datasourceLastRuntimeError: '',
            datasourceExecuteURL: '',
            datasourceUrl: '',
            datasourceSQL: '',
            datasourceCreatedDateTime: '',
            datasourceCreatedUserName: '',
            datasourceUpdatedDateTime: '',
            datasourceUpdatedUserName: ''
        }
    ];

export const DASHBOARDGROUPRELATIONSHIP: DashboardGroupRelationship[] =
    [
        {
            dashboardGroupRelationshipID: 0,
            dashboardID: 1,
            groupID: 0,
            dashboardGroupRelationshipType: 'SharedWith',
            dashboardGroupRelationshipRating: 0,
            dashboardGroupRelationshipCreatedDateTime: '2017/05/01 16:01',
            dashboardGroupRelationshipCreatedUserName: 'janniei',
            dashboardGroupRelationshipUpdatedDateTime: '2017/05/01 16:01',
            dashboardGroupRelationshipUpdatedUserName: 'janniei'
        }
    ];

export const DASHBOARDUSERRELATIONSHIP: DashboardUserRelationship[] =
    [
        {
            dashboardUserRelationshipID: 0,
            dashboardID: 0,
            userName: 'janniei',
            dashboardUserRelationshipType: 'SharedWith',
            dashboardUserRelationshipRating: 0,
            dashboardUserRelationshipCreatedDateTime: '2017/05/01 16:01',
            dashboardUserRelationshipCreatedUserName: 'janniei',
            dashboardUserRelationshipUpdatedDateTime: '2017/05/01 16:01',
            dashboardUserRelationshipUpdatedUserName: 'janniei'
        },
        {
            dashboardUserRelationshipID: 1,
            dashboardID: 0,
            userName: 'janniei',
            dashboardUserRelationshipType: 'Likes',
            dashboardUserRelationshipRating: 0,
            dashboardUserRelationshipCreatedDateTime: '2017/05/01 16:01',
            dashboardUserRelationshipCreatedUserName: 'janniei',
            dashboardUserRelationshipUpdatedDateTime: '2017/05/01 16:01',
            dashboardUserRelationshipUpdatedUserName: 'janniei'
        },
        {
            dashboardUserRelationshipID: 2,
            dashboardID: 1,
            userName: 'bradleyk',
            dashboardUserRelationshipType: 'Likes',
            dashboardUserRelationshipRating: 0,
            dashboardUserRelationshipCreatedDateTime: '2017/05/01 16:01',
            dashboardUserRelationshipCreatedUserName: 'janniei',
            dashboardUserRelationshipUpdatedDateTime: '2017/05/01 16:01',
            dashboardUserRelationshipUpdatedUserName: 'janniei'
        },
        {
            dashboardUserRelationshipID: 3,
            dashboardID: 0,
            userName: 'bradleyk',
            dashboardUserRelationshipType: 'SharedWith',
            dashboardUserRelationshipRating: 0,
            dashboardUserRelationshipCreatedDateTime: '2017/05/01 16:01',
            dashboardUserRelationshipCreatedUserName: 'janniei',
            dashboardUserRelationshipUpdatedDateTime: '2017/05/01 16:01',
            dashboardUserRelationshipUpdatedUserName: 'janniei'
        },
        {
            dashboardUserRelationshipID: 4,
            dashboardID: 3,
            userName: 'bradleyk',
            dashboardUserRelationshipType: 'SharedWith',
            dashboardUserRelationshipRating: 0,
            dashboardUserRelationshipCreatedDateTime: '2017/05/01 16:01',
            dashboardUserRelationshipCreatedUserName: 'janniei',
            dashboardUserRelationshipUpdatedDateTime: '2017/05/01 16:01',
            dashboardUserRelationshipUpdatedUserName: 'janniei'
        },
        {
            dashboardUserRelationshipID: 5,
            dashboardID: 3,
            userName: 'janniei',
            dashboardUserRelationshipType: 'Owns',
            dashboardUserRelationshipRating: 0,
            dashboardUserRelationshipCreatedDateTime: '2017/05/01 16:01',
            dashboardUserRelationshipCreatedUserName: 'janniei',
            dashboardUserRelationshipUpdatedDateTime: '2017/05/01 16:01',
            dashboardUserRelationshipUpdatedUserName: 'janniei'
        }
    ];

export const DASHBOARDS: Dashboard[] =
    [
        {
            dashboardID: 0,
            dashboardCode: 'Bar charts',
            dashboardName: 'Collection of Bar charts',
            isContainerHeaderDark: true,
            showContainerHeader: true,
            dashboardBackgroundColor: '',
            dashboardBackgroundImageSrc: "url('../assets/CanvasBackgroundImages/dolphin-1078319_1280.jpg')",
            dashboardComments: 'Comments bla-bla-bla',
            dashboardCreatedDateTime: '2017/07/08',
            dashboardCreatedUserName: 'BenVdMark',
            dashboardDefaultExportFileType: 'PowerPoint',
            dashboardDescription: 'This is a unique and special dashboard, like all others',
            dashboardNrGroups: 0,
            dashboardIsLocked: false,
            dashboardIsLiked: false,
            dashboardOpenTabNr: 1,
            dashboardOwners: 'JohnH',
            dashboardPassword: 'StudeBaker',
            dashboardRefreshedDateTime: '',
            dashboardRefreshedUserName: '',
            dashboardRefreshMode: 'Manual',
            dashboardRefreshFrequency: 0,
            dashboardNrUsersSharedWith: 0,
            dashboardNrGroupsSharedWith: 0,
            dashboardSystemMessage: '',
            dashboardUpdatedDateTime: '2017/07/08',
            dashboardUpdatedUserName: 'GordenJ'
        },
        {
            dashboardID: 1,
            dashboardCode: 'Pie charts',
            dashboardName: 'Collection of Pie charts',
            isContainerHeaderDark: false,
            showContainerHeader: true,
            dashboardBackgroundColor: '',
            dashboardBackgroundImageSrc: '',
            dashboardComments: 'No Comment',
            dashboardCreatedDateTime: '2016/07/08',
            dashboardCreatedUserName: 'GranalN',
            dashboardDefaultExportFileType: 'Excel',
            dashboardDescription: 'Just another Dashboard',
            dashboardNrGroups: 0,
            dashboardIsLocked: false,
            dashboardIsLiked: false,
            dashboardOpenTabNr: 0,
            dashboardOwners: 'AshR',
            dashboardPassword: '',
            dashboardRefreshedDateTime: '2016/08/07',
            dashboardRefreshedUserName: '',
            dashboardRefreshMode: 'Manual',
            dashboardRefreshFrequency: 0,
            dashboardNrUsersSharedWith: 0,
            dashboardNrGroupsSharedWith: 0,
            dashboardSystemMessage: '',
            dashboardUpdatedDateTime: '2016/09/08',
            dashboardUpdatedUserName: 'JerimiaA'
        },
        {
            dashboardID: 3,
            dashboardCode: 'Tree map',
            dashboardName: 'Tree map ...',
            isContainerHeaderDark: true,
            showContainerHeader: true,
            dashboardBackgroundColor: 'darkred',
            dashboardBackgroundImageSrc: '',
            dashboardComments: 'No Comment',
            dashboardCreatedDateTime: '2016/07/08',
            dashboardCreatedUserName: 'GranalN',
            dashboardDefaultExportFileType: 'Excel',
            dashboardDescription: 'Just another Dashboard',
            dashboardNrGroups: 0,
            dashboardIsLocked: false,
            dashboardIsLiked: false,
            dashboardOpenTabNr: 0,
            dashboardOwners: 'AshR',
            dashboardPassword: '',
            dashboardRefreshedDateTime: '2016/08/07',
            dashboardRefreshedUserName: '',
            dashboardRefreshMode: 'Manual',
            dashboardRefreshFrequency: 0,
            dashboardNrUsersSharedWith: 0,
            dashboardNrGroupsSharedWith: 0,
            dashboardSystemMessage: '',
            dashboardUpdatedDateTime: '2016/09/08',
            dashboardUpdatedUserName: 'JerimiaA'
        },
        {
            dashboardID: 4,
            dashboardCode: 'Word Cloud',
            dashboardName: 'Word Cloud of random text',
            isContainerHeaderDark: false,
            showContainerHeader: false,
            dashboardBackgroundColor: '',
            dashboardBackgroundImageSrc: '',
            dashboardComments: 'No Comment',
            dashboardCreatedDateTime: '2016/07/08',
            dashboardCreatedUserName: 'GranalN',
            dashboardDefaultExportFileType: 'Excel',
            dashboardDescription: 'Just another Dashboard',
            dashboardNrGroups: 0,
            dashboardIsLocked: false,
            dashboardIsLiked: false,
            dashboardOpenTabNr: 0,
            dashboardOwners: 'AshR',
            dashboardPassword: '',
            dashboardRefreshedDateTime: '2016/08/07',
            dashboardRefreshedUserName: '',
            dashboardRefreshMode: 'Manual',
            dashboardRefreshFrequency: 0,
            dashboardNrUsersSharedWith: 0,
            dashboardNrGroupsSharedWith: 0,
            dashboardSystemMessage: '',
            dashboardUpdatedDateTime: '2016/09/08',
            dashboardUpdatedUserName: 'JerimiaA'
        },
        {
            dashboardID: 5,
            dashboardCode: 'Jobs timeseries',
            dashboardName: 'Stacked graph with jobs timeseries',
            isContainerHeaderDark: false,
            showContainerHeader: true,
            dashboardBackgroundColor: '',
            dashboardBackgroundImageSrc: '',
            dashboardComments: 'No Comment',
            dashboardCreatedDateTime: '2016/07/08',
            dashboardCreatedUserName: 'GranalN',
            dashboardDefaultExportFileType: 'Excel',
            dashboardDescription: 'Just another Dashboard',
            dashboardNrGroups: 0,
            dashboardIsLocked: false,
            dashboardIsLiked: false,
            dashboardOpenTabNr: 0,
            dashboardOwners: 'AshR',
            dashboardPassword: '',
            dashboardRefreshedDateTime: '2016/08/07',
            dashboardRefreshedUserName: '',
            dashboardRefreshMode: 'Manual',
            dashboardRefreshFrequency: 0,
            dashboardNrUsersSharedWith: 0,
            dashboardNrGroupsSharedWith: 0,
            dashboardSystemMessage: '',
            dashboardUpdatedDateTime: '2016/09/08',
            dashboardUpdatedUserName: 'JerimiaA'
        },
        {
            dashboardID: 6,
            dashboardCode: 'Another Dash',
            dashboardName: 'Another Dashboard',
            isContainerHeaderDark: true,
            showContainerHeader: true,
            dashboardBackgroundColor: '',
            dashboardBackgroundImageSrc: '',
            dashboardComments: 'No Comment',
            dashboardCreatedDateTime: '2016/07/08',
            dashboardCreatedUserName: 'GranalN',
            dashboardDefaultExportFileType: 'Excel',
            dashboardDescription: 'Just another Dashboard',
            dashboardNrGroups: 0,
            dashboardIsLocked: false,
            dashboardIsLiked: false,
            dashboardOpenTabNr: 0,
            dashboardOwners: 'AshR',
            dashboardPassword: '',
            dashboardRefreshedDateTime: '2016/08/07',
            dashboardRefreshedUserName: '',
            dashboardRefreshMode: 'Manual',
            dashboardRefreshFrequency: 0,
            dashboardNrUsersSharedWith: 0,
            dashboardNrGroupsSharedWith: 0,
            dashboardSystemMessage: '',
            dashboardUpdatedDateTime: '2016/09/08',
            dashboardUpdatedUserName: 'JerimiaA'
        }
    ];

export const DASHBOARDGROUPS: DashboardGroup[] =
    [
        {
            dashboardGroupID: 0,
            dashboardGroupName: 'Admin',
            dashboardGroupDescription: 'Dashboards for Admin users',
            dashboardGroupCreatedDateTime: '2017/05/01',
            dashboardGroupCreatedUserName: 'JamesK',
            dashboardGroupUpdatedDateTime: '2017/05/01',
            dashboardGroupUpdatedUserName: 'JamesK'
        },
        {
            dashboardGroupID: 1,
            dashboardGroupName: 'Marketing',
            dashboardGroupDescription: 'Dashboards for Marketing Team',
            dashboardGroupCreatedDateTime: '2017/05/01',
            dashboardGroupCreatedUserName: 'JamesK',
            dashboardGroupUpdatedDateTime: '2017/05/01',
            dashboardGroupUpdatedUserName: 'JamesK'
        },
        {
            dashboardGroupID: 2,
            dashboardGroupName: 'BI Team',
            dashboardGroupDescription: 'Dashboards for BI Team',
            dashboardGroupCreatedDateTime: '2017/05/01',
            dashboardGroupCreatedUserName: 'JamesK',
            dashboardGroupUpdatedDateTime: '2017/05/01',
            dashboardGroupUpdatedUserName: 'JamesK'
        },
        {
            dashboardGroupID: 3,
            dashboardGroupName: 'HR',
            dashboardGroupDescription: 'Dashboards for Human Resources Department',
            dashboardGroupCreatedDateTime: '2017/05/01',
            dashboardGroupCreatedUserName: 'JamesK',
            dashboardGroupUpdatedDateTime: '2017/05/01',
            dashboardGroupUpdatedUserName: 'JamesK'
        },
        {
            dashboardGroupID: 4,
            dashboardGroupName: 'Finance',
            dashboardGroupDescription: 'Dashboards for Finance Department',
            dashboardGroupCreatedDateTime: '2017/05/01',
            dashboardGroupCreatedUserName: 'JamesK',
            dashboardGroupUpdatedDateTime: '2017/05/01',
            dashboardGroupUpdatedUserName: 'JamesK'
        },
        {
            dashboardGroupID: 5,
            dashboardGroupName: 'Sales',
            dashboardGroupDescription: 'Dashboards for Sales Department',
            dashboardGroupCreatedDateTime: '2017/05/01',
            dashboardGroupCreatedUserName: 'JamesK',
            dashboardGroupUpdatedDateTime: '2017/05/01',
            dashboardGroupUpdatedUserName: 'JamesK'
        },
        {
            dashboardGroupID: 6,
            dashboardGroupName: 'R&D',
            dashboardGroupDescription: 'Dashboards for Research and Development Department',
            dashboardGroupCreatedDateTime: '2017/05/01',
            dashboardGroupCreatedUserName: 'JamesK',
            dashboardGroupUpdatedDateTime: '2017/05/01',
            dashboardGroupUpdatedUserName: 'JamesK'
        },
        {
            dashboardGroupID: 7,
            dashboardGroupName: 'IT',
            dashboardGroupDescription: 'Dashboards for Information Technology Department',
            dashboardGroupCreatedDateTime: '2017/05/01',
            dashboardGroupCreatedUserName: 'JamesK',
            dashboardGroupUpdatedDateTime: '2017/05/01',
            dashboardGroupUpdatedUserName: 'JamesK'
        }
    ];

export const DASHBOARDGROUPMEMBERSHIP: DashboardGroupMembership[] =
    [
        {
            dashboardGroupID: 0,
            dashboardID: 0,
            dashboardGroupMembershipCreatedDateTime: '2017/05/01',
            dashboardGroupMembershipCreatedUserName:  'JamesK',
            dashboardGroupMembershipUpdatedDateTime: '2017/05/01',
            dashboardGroupMembershipUpdatedUserName: 'JamesK'
        },
        {
            dashboardGroupID: 4,
            dashboardID: 0,
            dashboardGroupMembershipCreatedDateTime: '2017/05/01',
            dashboardGroupMembershipCreatedUserName:  'JamesK',
            dashboardGroupMembershipUpdatedDateTime: '2017/05/01',
            dashboardGroupMembershipUpdatedUserName: 'JamesK'
        },
        {
            dashboardGroupID: 1,
            dashboardID: 1,
            dashboardGroupMembershipCreatedDateTime: '2017/05/01',
            dashboardGroupMembershipCreatedUserName:  'JamesK',
            dashboardGroupMembershipUpdatedDateTime: '2017/05/01',
            dashboardGroupMembershipUpdatedUserName: 'JamesK'
        },
        {
            dashboardGroupID: 5,
            dashboardID: 1,
            dashboardGroupMembershipCreatedDateTime: '2017/05/01',
            dashboardGroupMembershipCreatedUserName:  'JamesK',
            dashboardGroupMembershipUpdatedDateTime: '2017/05/01',
            dashboardGroupMembershipUpdatedUserName: 'JamesK'
        },
    ];

export const DASHBOARDTABS: DashboardTab[] =
    [
        {
            dashboardID: 0,
            dashboardTabID: 0,
            dashboardTabName: 'Value',
            dashboardTabDescription: '0-Value: Full and detailed desription of tab - purpose',
            dashboardTabCreatedDateTime: '2017/05/01',
            dashboardTabCreatedUserName: 'John Doe',
            dashboardTabUpdatedDateTime: '2017/05/01',
            dashboardTabUpdatedUserName: 'Leonard Cohen'
        },
        {
            dashboardID: 0,
            dashboardTabID: 1,
            dashboardTabName: 'Volume',
            dashboardTabDescription: '0-Volume: Full and detailed desription of tab - purpose',
            dashboardTabCreatedDateTime: '2017/05/01',
            dashboardTabCreatedUserName: 'John Doe',
            dashboardTabUpdatedDateTime: '2017/05/01',
            dashboardTabUpdatedUserName: 'Leonard Cohen'
        },
        {
            dashboardID: 1,
            dashboardTabID: 2,
            dashboardTabName: 'Value',
            dashboardTabDescription: 'Full and detailed desription of tab - purpose',
            dashboardTabCreatedDateTime: '2017/05/01',
            dashboardTabCreatedUserName: 'John Doe',
            dashboardTabUpdatedDateTime: '2017/05/01',
            dashboardTabUpdatedUserName: 'Leonard Cohen'
        },
        {
            dashboardID: 1,
            dashboardTabID: 3,
            dashboardTabName: 'Volume',
            dashboardTabDescription: '1-Value: Full and detailed desription of tab - purpose',
            dashboardTabCreatedDateTime: '2017/05/01',
            dashboardTabCreatedUserName: 'John Doe',
            dashboardTabUpdatedDateTime: '2017/05/01',
            dashboardTabUpdatedUserName: 'Leonard Cohen'
        },
        {
            dashboardID: 3,
            dashboardTabID: 4,
            dashboardTabName: 'Value',
            dashboardTabDescription: '3-Value: Full and detailed desription of tab - purpose',
            dashboardTabCreatedDateTime: '2017/05/01',
            dashboardTabCreatedUserName: 'John Doe',
            dashboardTabUpdatedDateTime: '2017/05/01',
            dashboardTabUpdatedUserName: 'Leonard Cohen'
        },
        {
            dashboardID: 4,
            dashboardTabID: 5,
            dashboardTabName: 'Value',
            dashboardTabDescription: '4-Value: Full and detailed desription of tab - purpose',
            dashboardTabCreatedDateTime: '2017/05/01',
            dashboardTabCreatedUserName: 'John Doe',
            dashboardTabUpdatedDateTime: '2017/05/01',
            dashboardTabUpdatedUserName: 'Leonard Cohen'
        },
        {
            dashboardID: 5,
            dashboardTabID: 6,
            dashboardTabName: 'Value',
            dashboardTabDescription: '5-Value: Full and detailed desription of tab - purpose',
            dashboardTabCreatedDateTime: '2017/05/01',
            dashboardTabCreatedUserName: 'John Doe',
            dashboardTabUpdatedDateTime: '2017/05/01',
            dashboardTabUpdatedUserName: 'Leonard Cohen'
        },
    ];

export const WIDGETS: Widget[] =
    [
        {
            container: {
                backgroundColor: 'transparent',
                border: '1px solid black',
                boxShadow: '',
                color: 'brown',
                fontSize: 1,
                height: 310,
                left: 240,
                widgetTitle: 'Value EDM 2017',
                top: 80,
                width: 380,
            },
            areas: {
                showWidgetText: true,
                showWidgetGraph: false,
                showWidgetTable: false,
                showWidgetImage: true,
            },
            textual: {
                textText: '<strong>History</strong> of the coffee bean<br> on ##today##',
                textBackgroundColor: 'transparent',
                textBorder: 'transparent',
                textColor: 'black',
                textFontSize: 1,
                textFontWeight: 'normal',
                textHeight: 12,
                textLeft: 10,
                textMargin: '5px 5px 5px 5px',
                textPadding:  '5px 5px 5px 5px',
                textPosition: 'absolute',
                textTextAlign: 'left',
                textTop: 25,
                textWidth: 200,
            },
            graph: {
                graphID: 0,
                graphLeft: 5,
                graphTop: 25,
                vegaParameters: {
                    vegaGraphHeight: 200,
                    vegaGraphWidth: 180,
                    vegaGraphPadding: 10,
                    vegaHasSignals: true,
                    vegaXcolumn: 'category',
                    vegaYcolumn: 'amount',
                    vegaFillColor: 'darkred',
                    vegaHoverColor: 'lightgray'
                },
                spec: {
                "$schema": "https://vega.github.io/schema/vega/v3.0.json",
                "description": "Yes, Bradley",
                "scheme": "greys-9",
                "width": 250,
                "height": 200,
                "padding": 5,

                "data": [
                    {

                    "name": "table",
                    "values": [
                        {"category": "A1", "amount": 28},
                        {"category": "B1", "amount": 55},
                        {"category": "C1", "amount": 43},
                        {"category": "D1", "amount": 91},
                        {"category": "E1", "amount": 81},
                        {"category": "F1", "amount": 53},
                        {"category": "G1", "amount": 19},
                        {"category": "H1", "amount": 87}
                    ]

                    }
                ],

                "signals": [
                    {
                        "name": "tooltip",
                        "value": {},
                        "on": [
                            {"events": "rect:mouseover", "update": "datum"},
                            {"events": "rect:mouseout",  "update": "{}"}
                        ]
                    }
                ],

                "scales": [
                    {
                    "name": "xscale",
                    "type": "band",
                    "domain": {"data": "table", "field": "category"},
                    "range": "width"
                    },
                    {
                    "name": "yscale",
                    "domain": {"data": "table", "field": "amount"},
                    "nice": true,
                    "range": "height"
                    }
                ],

                "axes": [
                    {
                        "orient": "bottom",
                        "scale": "xscale",
                        "title": "bottom Axis"
                    },
                    {
                        "orient": "left",
                        "scale": "yscale",
                        "title": "left Axis"
                    }
                ],

                "marks": [

                    {
                        "type": "rect",
                        "from": {"data":"table"},
                        "encode": {
                            "enter": {
                            "x": {"scale": "xscale", "field": "category", "offset": 1},
                            "width": {"scale": "xscale", "band": 1, "offset": -1},
                            "y": {"scale": "yscale", "field": "amount"},
                            "y2": {"scale": "yscale", "value": 0}
                            },
                            "update": {
                            "fill": {"value": "maroon"}
                            },
                            "hover": {
                            "fill": {"value": "red"}
                            }
                        }
                    },
                    {
                        "type": "text",
                        "encode": {
                            "enter": {
                                "align": {"value": "center"},
                                "baseline": {"value": "bottom"},
                                "fill": {"value": "#333"}
                            },
                            "update": {
                                "x": {"scale": "xscale", "signal": "tooltip.category", "band": 0.5},
                                "y": {"scale": "yscale", "signal": "tooltip.amount", "offset": -2},
                                "text": {"signal": "tooltip.amount"},
                                "fillOpacity": [
                                    {"test": "datum === tooltip", "value": 0},
                                    {"value": 1}
                                ]
                            }
                        }
                    }


                ]
                }
            },
            table:{
                tableColor: 'white',
                tableCols: 1,
                tableHeight: 25,
                tableHideHeader: false,
                tableLeft: 5,
                tableRows: 1,
                tableTop: 300,
                tableWidth: 25,
            },
            image: {
                imageAlt: 'coffee.jpg',
                imageHeigt: 220,
                imageLeft: 5,
                imageSource: '../assets/coffee.jpg',
                imageTop: 70,
                imageWidth: 360,
            },
            properties: {
                widgetID: 1,
                dashboardID: 0,
                dashboardName: 'Collection of Bar charts',
                dashboardTabID: 0,
                dashboardTabName: "Value",
                widgetCode: 'FirstBar',
                widgetName: 'Bar Chart 1',
                widgetAddRestRow: true,
                widgetCreatedDateTime: '',
                widgetCreatedUserName: '',
                widgetComments: 'Just a common comment',
                widgetDefaultExportFileType: '.png',
                widgetDescription: 'This graph showing empirical bla-bla-bla ..',
                widgetIndex: 1,
                widgetIsLocked: false,
                widgetHyperLinkTabNr: 'Volume',
                widgetHyperLinkWidgetID: '22',
                widgetIsLiked: false,
                widgetLiked: [
                    {
                        widgetLikedUserName: 'JessyB'
                    },
                    {
                        widgetLikedUserName: 'JonnyC'
                    }
                ],
                widgetPassword: '***',
                widgetRefreshedDateTime: '',
                widgetRefreshedUserName: '',
                widgetRefreshFrequency: 3,
                widgetRefreshMode: 'Repeat',
                widgetReportID: 1,
                widgetReportName: 'EDM weekly Values',
                widgetReportParameters: 'today()',
                widgetShowLimitedRows: 5,
                widgetSize: 'Small',
                widgetSystemMessage: '',
                widgetTypeID: 1,
                widgetType: 'BarChart',
                widgetUpdatedDateTime: '',
                widgetUpdatedUserName: ''
            }
        },

        {
            container: {
                backgroundColor: 'transparent',
                border: '1px solid black',
                boxShadow: '',
                color: 'brown',
                fontSize: 1,
                height: 440,
                left: 640,
                widgetTitle: 'Headcount Comparison',
                top: 80,
                width: 440,
            },
            areas: {
                showWidgetText: true,
                showWidgetGraph: true,
                showWidgetTable: true,
                showWidgetImage: false,
            },
            textual: {
                textText: '<strong>Headcount </strong> for ##today##',
                textBackgroundColor: 'transparent',
                textBorder: 'none',
                textColor: 'black',
                textFontSize: 1,
                textFontWeight: 'normal',
                textHeight: 16,
                textLeft: 0,
                textMargin: '0 5px 0 5px',
                textPadding:  '5px 0 5px',
                textPosition: 'absolute',
                textTextAlign: 'center',
                textTop: 25,
                textWidth: 300,
            },
            graph: {
                graphID: 0,
                graphLeft: 5,
                graphTop: 75,
                vegaParameters: {
                    vegaGraphHeight: 200,
                    vegaGraphWidth: 180,
                    vegaGraphPadding: 10,
                    vegaHasSignals: true,
                    vegaXcolumn: 'category',
                    vegaYcolumn: 'amount',
                    vegaFillColor: 'pink',
                    vegaHoverColor: 'lightgray'
                },
                spec: {
                "$schema": "https://vega.github.io/schema/vega/v3.0.json",
                "width": 290,
                "height": 220,
                "padding": 5,

                "data": [
                    {
                    "name": "table",
                    "values": [
                        {"category": "A1", "amount": 28},
                        {"category": "B1", "amount": 55},
                        {"category": "C1", "amount": 43},
                        {"category": "D1", "amount": 91},
                        {"category": "E1", "amount": 81},
                        {"category": "F1", "amount": 53},
                        {"category": "G1", "amount": 19},
                        {"category": "H1", "amount": 87}
                    ]
                    }
                ],

                "signals": [
                    {
                    "name": "tooltip",
                    "value": {},
                    "on": [
                        {"events": "rect:mouseover", "update": "datum"},
                        {"events": "rect:mouseout",  "update": "{}"}
                    ]
                    }
                ],

                "scales": [
                    {
                    "name": "xscale",
                    "type": "band",
                    "domain": {"data": "table", "field": "category"},
                    "range": "width"
                    },
                    {
                    "name": "yscale",
                    "domain": {"data": "table", "field": "amount"},
                    "nice": true,
                    "range": "height"
                    }
                ],

                "axes": [
                    { "orient": "bottom", "scale": "xscale" },
                    { "orient": "left", "scale": "yscale" }
                ],

                "marks": [
                    {
                    "type": "rect",
                    "from": {"data":"table"},
                    "encode": {
                        "enter": {
                        "x": {"scale": "xscale", "field": "category", "offset": 1},
                        "width": {"scale": "xscale", "band": 1, "offset": -1},
                        "y": {"scale": "yscale", "field": "amount"},
                        "y2": {"scale": "yscale", "value": 0}
                        },
                        "update": {
                        "fill": {"value": "darkslategray"}
                        },
                        "hover": {
                        "fill": {"value": "red"}
                        }
                    }
                    },
                    {
                    "type": "text",
                    "encode": {
                        "enter": {
                        "align": {"value": "center"},
                        "baseline": {"value": "bottom"},
                        "fill": {"value": "#333"}
                        },
                        "update": {
                        "x": {"scale": "xscale", "signal": "tooltip.category", "band": 0.5},
                        "y": {"scale": "yscale", "signal": "tooltip.amount", "offset": -2},
                        "text": {"signal": "tooltip.amount"},
                        "fillOpacity": [
                            {"test": "datum === tooltip", "value": 0},
                            {"value": 1}
                        ]
                        }
                    }
                    }
                ]
                }
            },
            table:{
                tableColor: 'red',
                tableCols: 2,
                tableHeight: 120,
                tableHideHeader: true,
                tableLeft: 50,
                tableRows: 10,
                tableTop: 340,
                tableWidth: 340,
            },
            image: {
                imageAlt: '',
                imageHeigt: 200,
                imageLeft: 5,
                imageSource: '', //  <img src="pic_mountain.jpg" alt="Mountain View" style="width:304px;height:228px;">
                imageTop: 300,
                imageWidth: 200,
            },
            properties: {
                widgetID: 2,
                dashboardID: 0,
                dashboardName: 'Collection of Bar charts',
                dashboardTabID: 0,
                dashboardTabName: "Value",
                widgetCode: 'SecondBar',
                widgetName: 'Bar Chart 2',
                widgetAddRestRow: true,
                widgetCreatedDateTime: '',
                widgetCreatedUserName: '',
                widgetComments: '',
                widgetDefaultExportFileType: '',
                widgetDescription: 'This graph showing ...',
                widgetIndex: 1,
                widgetIsLocked: true,
                widgetHyperLinkTabNr: '',
                widgetHyperLinkWidgetID: '',
                widgetIsLiked: false,
                widgetLiked: [
                    {
                        widgetLikedUserName: 'janniei',
                    }
                ],
                widgetPassword: '',
                widgetRefreshedDateTime: '',
                widgetRefreshedUserName: '',
                widgetRefreshFrequency: 3,
                widgetRefreshMode: '',
                widgetReportID: 1,
                widgetReportName: '',
                widgetReportParameters: '',
                widgetShowLimitedRows: 0,
                widgetSize: '',
                widgetSystemMessage: '',
                widgetTypeID: 1,
                widgetType: 'BarChart',
                widgetUpdatedDateTime: '',
                widgetUpdatedUserName: ''
            }
        },
        {
            container: {
                backgroundColor: 'transparent',
                border: '1px solid black',
                boxShadow: '',
                color: 'brown',
                fontSize: 1,
                height: 360,
                left: 190,
                widgetTitle: 'Sales 2013',
                top: 420,
                width: 430,
            },
            areas: {
                showWidgetText: true,
                showWidgetGraph: true,
                showWidgetTable: false,
                showWidgetImage: false,
            },
            textual: {
                textText: '<table> <tr>    <th>Firstname</th>    <th>Lastname</th>     <th>Age</th>  </tr>  <tr>    <td>Jill</td>    <td>Smith</td>     <td>50</td>  </tr>  <tr>    <td>Eve</td>    <td>Jackson</td>     <td>94</td>  </tr></table>',
                textBackgroundColor: 'transparent',
                textBorder: 'none',
                textColor: 'black',
                textFontSize: 1,
                textFontWeight: 'normal',
                textHeight: 16,
                textLeft: 0,
                textMargin: '0 5px 0 5px',
                textPadding:  '5px 0 5px',
                textPosition: 'absolute',
                textTextAlign: 'center',
                textTop: 25,
                textWidth: 0,
            },
            graph: {
                graphID: 0,
                graphLeft: 5,
                graphTop: 110,
                vegaParameters: {
                    vegaGraphHeight: 200,
                    vegaGraphWidth: 180,
                    vegaGraphPadding: 10,
                    vegaHasSignals: true,
                    vegaXcolumn: 'category',
                    vegaYcolumn: 'amount',
                    vegaFillColor: 'pink',
                    vegaHoverColor: 'lightgray'
                },
                spec: {
                    "$schema": "https://vega.github.io/schema/vega/v3.0.json",
                    "width": 300,
                    "height": 200,
                    "padding": 5,

                    "data": [
                        {
                        "name": "table",
                        "values": [
                            {"x": 0, "y": 28, "c":0}, {"x": 0, "y": 55, "c":1},
                            {"x": 1, "y": 43, "c":0}, {"x": 1, "y": 91, "c":1},
                            {"x": 2, "y": 81, "c":0}, {"x": 2, "y": 53, "c":1},
                            {"x": 3, "y": 19, "c":0}, {"x": 3, "y": 87, "c":1},
                            {"x": 4, "y": 52, "c":0}, {"x": 4, "y": 48, "c":1},
                            {"x": 5, "y": 24, "c":0}, {"x": 5, "y": 49, "c":1},
                            {"x": 6, "y": 87, "c":0}, {"x": 6, "y": 66, "c":1},
                            {"x": 7, "y": 17, "c":0}, {"x": 7, "y": 27, "c":1},
                            {"x": 8, "y": 68, "c":0}, {"x": 8, "y": 16, "c":1},
                            {"x": 9, "y": 49, "c":0}, {"x": 9, "y": 15, "c":1}
                        ],
                        "transform": [
                            {
                            "type": "stack",
                            "groupby": ["x"],
                            "sort": {"field": "c"},
                            "field": "y"
                            }
                        ]
                        }
                    ],

                    "scales": [
                        {
                        "name": "x",
                        "type": "band",
                        "range": "width",
                        "domain": {"data": "table", "field": "x"}
                        },
                        {
                        "name": "y",
                        "type": "linear",
                        "range": "height",
                        "nice": true, "zero": true,
                        "domain": {"data": "table", "field": "y1"}
                        },
                        {
                        "name": "color",
                        "type": "ordinal",
                        "range": "category",
                        "domain": {"data": "table", "field": "c"}
                        }
                    ],

                    "axes": [
                        {"orient": "bottom", "scale": "x", "zindex": 1},
                        {"orient": "left", "scale": "y", "zindex": 1}
                    ],

                    "marks": [
                        {
                        "type": "rect",
                        "from": {"data": "table"},
                        "encode": {
                            "enter": {
                            "x": {"scale": "x", "field": "x"},
                            "width": {"scale": "x", "band": 1, "offset": -1},
                            "y": {"scale": "y", "field": "y0"},
                            "y2": {"scale": "y", "field": "y1"},
                            "fill": {"scale": "color", "field": "c"}
                            },
                            "update": {
                            "fillOpacity": {"value": 1}
                            },
                            "hover": {
                            "fillOpacity": {"value": 0.5}
                            }
                        }
                        }
                    ]
                }
            },
            table:{
                tableColor: 'white',
                tableCols: 1,
                tableHeight: 25,
                tableHideHeader: false,
                tableLeft: 5,
                tableRows: 1,
                tableTop: 300,
                tableWidth: 25,
            },
            image: {
                imageAlt: '',
                imageHeigt: 200,
                imageLeft: 5,
                imageSource: '', //  <img src="pic_mountain.jpg" alt="Mountain View" style="width:304px;height:228px;">
                imageTop: 300,
                imageWidth: 200,
            },
            properties: {
                widgetID: 3,
                dashboardID: 0,
                dashboardName: 'Collection of Bar charts',
                dashboardTabID: 0,
                dashboardTabName: "Value",
                widgetCode: 'ThirdBar',
                widgetName: 'Bar Chart 3',
                widgetAddRestRow: true,
                widgetCreatedDateTime: '',
                widgetCreatedUserName: '',
                widgetComments: '',
                widgetDefaultExportFileType: '',
                widgetDescription: 'This graph showing ...',
                widgetIndex: 1,
                widgetIsLocked: true,
                widgetHyperLinkTabNr: '',
                widgetHyperLinkWidgetID: '',
                widgetIsLiked: false,
                widgetLiked: [
                    {
                        widgetLikedUserName: '',
                    }
                ],
                widgetPassword: '',
                widgetRefreshedDateTime: '',
                widgetRefreshedUserName: '',
                widgetRefreshFrequency: 3,
                widgetRefreshMode: '',
                widgetReportID: -1,
                widgetReportName: '',
                widgetReportParameters: '',
                widgetShowLimitedRows: 0,
                widgetSize: '',
                widgetSystemMessage: '',
                widgetTypeID: 1,
                widgetType: 'BarChart',
                widgetUpdatedDateTime: '',
                widgetUpdatedUserName: ''
            }
        },
        {
            container: {
                backgroundColor: 'black',
                border: '2px solid white',
                boxShadow: '4px 4px 12px gray',
                color: 'brown',
                fontSize: 1,
                height: 270,
                left: 470,
                widgetTitle: 'Customer Segmentation',
                top: 80,
                width: 350,
            },
            areas: {
                showWidgetText: false,
                showWidgetGraph: true,
                showWidgetTable: false,
                showWidgetImage: false,
            },
            textual: {
                textText: 'texie',
                textBackgroundColor: 'transparent',
                textBorder: 'none',
                textColor: 'darkgray',
                textFontSize: 1,
                textFontWeight: 'normal',
                textHeight: 16,
                textLeft: 0,
                textMargin: '0 5px 0 5px',
                textPadding:  '5px 0 5px',
                textPosition: 'absolute',
                textTextAlign: 'center',
                textTop: 25,
                textWidth: 0,
            },
            graph: {
                graphID: 0,
                graphLeft: 5,
                graphTop: 25,
                vegaParameters: {
                    vegaGraphHeight: 200,
                    vegaGraphWidth: 180,
                    vegaGraphPadding: 10,
                    vegaHasSignals: true,
                    vegaXcolumn: 'category',
                    vegaYcolumn: 'amount',
                    vegaFillColor: 'pink',
                    vegaHoverColor: 'lightgray'
                },
                spec: {
                    "$schema": "https://vega.github.io/schema/vega/v3.0.json",
                    "width": 300,
                    "height": 210,
                    "padding": 10,

                    "data": [
                        {
                        "name": "table",
                        "values": [
                            {"category":"A", "position":0, "value":0.1},
                            {"category":"A", "position":1, "value":0.6},
                            {"category":"A", "position":2, "value":0.9},
                            {"category":"A", "position":3, "value":0.4},
                            {"category":"B", "position":0, "value":0.7},
                            {"category":"B", "position":1, "value":0.2},
                            {"category":"B", "position":2, "value":1.1},
                            {"category":"B", "position":3, "value":0.8},
                            {"category":"C", "position":0, "value":0.6},
                            {"category":"C", "position":1, "value":0.1},
                            {"category":"C", "position":2, "value":0.2},
                            {"category":"C", "position":3, "value":0.7}
                        ]
                        }
                    ],

                    "scales": [
                        {
                        "name": "yscale",
                        "type": "band",
                        "domain": {"data": "table", "field": "category"},
                        "range": "height",
                        "padding": 0.2
                        },
                        {
                        "name": "xscale",
                        "type": "linear",
                        "domain": {"data": "table", "field": "value"},
                        "range": "width",
                        "round": true,
                        "zero": true,
                        "nice": true
                        },
                        {
                        "name": "color",
                        "type": "ordinal",
                        "domain": {"data": "table", "field": "position"},
                        "range": {"scheme": "category20"}
                        }
                    ],

                    "axes": [
                        {"orient": "left", "scale": "yscale", "tickSize": 0, "labelPadding": 4, "zindex": 1},
                        {"orient": "bottom", "scale": "xscale"}
                    ],

                    "marks": [
                        {
                        "type": "group",

                        "from": {
                            "facet": {
                            "data": "table",
                            "name": "facet",
                            "groupby": "category"
                            }
                        },

                        "encode": {
                            "enter": {
                            "y": {"scale": "yscale", "field": "category"}
                            }
                        },

                        "signals": [
                            {"name": "height", "update": "bandwidth('yscale')"}
                        ],

                        "scales": [
                            {
                            "name": "pos",
                            "type": "band",
                            "range": "height",
                            "domain": {"data": "facet", "field": "position"}
                            }
                        ],

                        "marks": [
                            {
                            "name": "bars",
                            "from": {"data": "facet"},
                            "type": "rect",
                            "encode": {
                                "enter": {
                                "y": {"scale": "pos", "field": "position"},
                                "height": {"scale": "pos", "band": 1},
                                "x": {"scale": "xscale", "field": "value"},
                                "x2": {"scale": "xscale", "value": 0},
                                "fill": {"scale": "color", "field": "position"}
                                }
                            }
                            },
                            {
                            "type": "text",
                            "from": {"data": "bars"},
                            "encode": {
                                "enter": {
                                "x": {"field": "x2", "offset": -5},
                                "y": {"field": "y", "offset": {"field": "height", "mult": 0.5}},
                                "fill": {"value": "white"},
                                "align": {"value": "right"},
                                "baseline": {"value": "middle"},
                                "text": {"field": "datum.value"}
                                }
                            }
                            }
                        ]
                        }
                    ]
                }
            },
            table:{
                tableColor: 'white',
                tableCols: 1,
                tableHeight: 25,
                tableHideHeader: false,
                tableLeft: 5,
                tableRows: 1,
                tableTop: 300,
                tableWidth: 25,
            },
            image: {
                imageAlt: '',
                imageHeigt: 200,
                imageLeft: 5,
                imageSource: '', //  <img src="pic_mountain.jpg" alt="Mountain View" style="width:304px;height:228px;">
                imageTop: 300,
                imageWidth: 200,
            },
            properties: {
                widgetID: 4,
                dashboardID: 0,
                dashboardName: 'Collection of Bar charts',
                dashboardTabID: 1,
                dashboardTabName: "Volume",
                widgetCode: 'FourthBar',
                widgetName: 'Bar Chart 4',
                widgetAddRestRow: true,
                widgetCreatedDateTime: '',
                widgetCreatedUserName: '',
                widgetComments: '',
                widgetDefaultExportFileType: '',
                widgetDescription: 'This graph showing ...',
                widgetIndex: 1,
                widgetIsLocked: true,
                widgetHyperLinkTabNr: '',
                widgetHyperLinkWidgetID: '',
                widgetIsLiked: false,
                widgetLiked: [
                    {
                        widgetLikedUserName: '',
                    }
                ],
                widgetPassword: '',
                widgetRefreshedDateTime: '',
                widgetRefreshedUserName: '',
                widgetRefreshFrequency: 3,
                widgetRefreshMode: '',
                widgetReportID: -1,
                widgetReportName: '',
                widgetReportParameters: '',
                widgetShowLimitedRows: 0,
                widgetSize: '',
                widgetSystemMessage: '',
                widgetTypeID: 0,
                widgetType: 'WidgetSet',
                widgetUpdatedDateTime: '',
                widgetUpdatedUserName: ''
            }
        },
        {
            container: {
                backgroundColor: 'slategray',
                border: '2px solid white',
                boxShadow: '4px 4px 12px gray',
                color: 'brown',
                fontSize: 0.9,
                height: 300,
                left: 870,
                widgetTitle: 'Resources used',
                top: 80,
                width: 680,
            },
            areas: {
                showWidgetText: false,
                showWidgetGraph: true,
                showWidgetTable: false,
                showWidgetImage: false,
            },
            textual: {
                textText: 'texie',
                textBackgroundColor: 'transparent',
                textBorder: 'none',
                textColor: 'darkgray',
                textFontSize: 1,
                textFontWeight: 'normal',
                textHeight: 16,
                textLeft: 0,
                textMargin: '0 5px 0 5px',
                textPadding:  '5px 0 5px',
                textPosition: 'absolute',
                textTextAlign: 'center',
                textTop: 25,
                textWidth: 0,
            },
            graph: {
                graphID: 0,
                graphLeft: 5,
                graphTop: 25,
                vegaParameters: {
                    vegaGraphHeight: 200,
                    vegaGraphWidth: 180,
                    vegaGraphPadding: 10,
                    vegaHasSignals: true,
                    vegaXcolumn: 'category',
                    vegaYcolumn: 'amount',
                    vegaFillColor: 'pink',
                    vegaHoverColor: 'lightgray'
                },
                spec: {
                    "$schema": "https://vega.github.io/schema/vega/v3.0.json",
                    "height": 210,
                    "width": 300,
                    "padding": 5,

                    "signals": [
                        { "name": "chartWidth", "value": 300 },
                        { "name": "chartPad", "value": 20 },
                        { "name": "width", "update": "2 * chartWidth + chartPad" },
                        { "name": "year", "value": 2000,
                        "bind": {"input": "range", "min": 1850, "max": 2000, "step": 10} }
                    ],

                    "data": [
                        {
                        "name": "population",
                        "url": "../assets/vega/vega-datasets/population.json"
                        },
                        {
                        "name": "popYear",
                        "source": "population",
                        "transform": [
                            {"type": "filter", "expr": "datum.year == year"}
                        ]
                        },
                        {
                        "name": "males",
                        "source": "popYear",
                        "transform": [
                            {"type": "filter", "expr": "datum.sex == 1"}
                        ]
                        },
                        {
                        "name": "females",
                        "source": "popYear",
                        "transform": [
                            {"type": "filter", "expr": "datum.sex == 2"}
                        ]
                        },
                        {
                        "name": "ageGroups",
                        "source": "population",
                        "transform": [
                            { "type": "aggregate", "groupby": ["age"] }
                        ]
                        }
                    ],

                    "scales": [
                        {
                        "name": "y",
                        "type": "band",
                        "range": [{"signal": "height"}, 0],
                        "round": true,
                        "domain": {"data": "ageGroups", "field": "age"}
                        },
                        {
                        "name": "c",
                        "type": "ordinal",
                        "domain": [1, 2],
                        "range": ["#1f77b4", "#e377c2"]
                        }
                    ],

                    "marks": [
                        {
                        "type": "text",
                        "interactive": false,
                        "from": {"data": "ageGroups"},
                        "encode": {
                            "enter": {
                            "x": {"signal": "chartWidth + chartPad / 2"},
                            "y": {"scale": "y", "field": "age", "band": 0.5},
                            "text": {"field": "age"},
                            "baseline": {"value": "middle"},
                            "align": {"value": "center"},
                            "fill": {"value": "#000"}
                            }
                        }
                        },
                        {
                        "type": "group",

                        "encode": {
                            "update": {
                            "x": {"value": 0},
                            "height": {"signal": "height"}
                            }
                        },

                        "scales": [
                            {
                            "name": "x",
                            "type": "linear",
                            "range": [{"signal": "chartWidth"}, 0],
                            "nice": true, "zero": true,
                            "domain": {"data": "population", "field": "people"}
                            }
                        ],

                        "axes": [
                            {"orient": "bottom", "scale": "x", "format": "s"}
                        ],

                        "marks": [
                            {
                            "type": "rect",
                            "from": {"data": "females"},
                            "encode": {
                                "enter": {
                                "x": {"scale": "x", "field": "people"},
                                "x2": {"scale": "x", "value": 0},
                                "y": {"scale": "y", "field": "age"},
                                "height": {"scale": "y", "band": 1, "offset": -1},
                                "fillOpacity": {"value": 0.6},
                                "fill": {"scale": "c", "field": "sex"}
                                }
                            }
                            }
                        ]
                        },
                        {
                        "type": "group",

                        "encode": {
                            "update": {
                            "x": {"signal": "chartWidth + chartPad"},
                            "height": {"signal": "height"}
                            }
                        },

                        "scales": [
                            {
                            "name": "x",
                            "type": "linear",
                            "range": [0, {"signal": "chartWidth"}],
                            "nice": true, "zero": true,
                            "domain": {"data": "population", "field": "people"}
                            }
                        ],

                        "axes": [
                            {"orient": "bottom", "scale": "x", "format": "s"}
                        ],

                        "marks": [
                            {
                            "type": "rect",
                            "from": {"data": "males"},
                            "encode": {
                                "enter": {
                                "x": {"scale": "x", "field": "people"},
                                "x2": {"scale": "x", "value": 0},
                                "y": {"scale": "y", "field": "age"},
                                "height": {"scale": "y", "band": 1, "offset": -1},
                                "fillOpacity": {"value": 0.6},
                                "fill": {"scale": "c", "field": "sex"}
                                }
                            }
                            }
                        ]
                        }
                    ]
                }
            },
            table:{
                tableColor: 'white',
                tableCols: 1,
                tableHeight: 25,
                tableHideHeader: false,
                tableLeft: 5,
                tableRows: 1,
                tableTop: 300,
                tableWidth: 25,
            },
            image: {
                imageAlt: '',
                imageHeigt: 200,
                imageLeft: 5,
                imageSource: '', //  <img src="pic_mountain.jpg" alt="Mountain View" style="width:304px;height:228px;">
                imageTop: 300,
                imageWidth: 200,
            },
            properties: {
                widgetID: 5,
                dashboardID: 0,
                dashboardName: 'Collection of Bar charts',
                dashboardTabID: 1,
                dashboardTabName: "Volume",
                widgetCode: 'FifthBar',
                widgetName: 'Bar Chart 5',
                widgetAddRestRow: true,
                widgetCreatedDateTime: '',
                widgetCreatedUserName: '',
                widgetComments: 'Just simple comments',
                widgetDefaultExportFileType: '',
                widgetDescription: 'This graph showing ...',
                widgetIndex: 1,
                widgetIsLocked: true,
                widgetHyperLinkTabNr: '',
                widgetHyperLinkWidgetID: '',
                widgetIsLiked: false,
                widgetLiked: [
                    {
                        widgetLikedUserName: '',
                    }
                ],
                widgetPassword: '',
                widgetRefreshedDateTime: '',
                widgetRefreshedUserName: '',
                widgetRefreshFrequency: 3,
                widgetRefreshMode: '',
                widgetReportID: -1,
                widgetReportName: '',
                widgetReportParameters: '',
                widgetShowLimitedRows: 0,
                widgetSize: '',
                widgetSystemMessage: '',
                widgetTypeID: 0,
                widgetType: 'WidgetSet',
                widgetUpdatedDateTime: '',
                widgetUpdatedUserName: ''
            }
        },
        {
            container: {
                backgroundColor: 'white',
                border: '1px solid darkgray',
                boxShadow: '2px 2px 12px black',
                color: 'black',
                fontSize: 1,
                height: 320,
                left: 800,
                widgetTitle: 'P&L 2017',
                top: 100,
                width: 350,
            },
            areas: {
                showWidgetText: false,
                showWidgetGraph: true,
                showWidgetTable: false,
                showWidgetImage: false,
            },
            textual: {
                textText: 'texie',
                textBackgroundColor: 'transparent',
                textBorder: 'none',
                textColor: 'darkgray',
                textFontSize: 1,
                textFontWeight: 'normal',
                textHeight: 16,
                textLeft: 0,
                textMargin: '0 5px 0 5px',
                textPadding:  '5px 0 5px',
                textPosition: 'absolute',
                textTextAlign: 'center',
                textTop: 25,
                textWidth: 0,
            },
            graph: {
                graphID: 0,
                graphLeft: 5,
                graphTop: 25,
                vegaParameters: {
                    vegaGraphHeight: 200,
                    vegaGraphWidth: 180,
                    vegaGraphPadding: 10,
                    vegaHasSignals: true,
                    vegaXcolumn: 'category',
                    vegaYcolumn: 'amount',
                    vegaFillColor: 'pink',
                    vegaHoverColor: 'lightgray'
                },
                spec: {
                "$schema": "https://vega.github.io/schema/vega/v3.0.json",
                "width": 140,
                "height": 140,
                "padding": 50,
                "data": [
                    {
                    "name": "table",
                    "values": [12, 23, 47, 6, 52, 19],
                    "transform": [{"type": "pie", "field": "data"}]
                    }
                ],

                "scales": [
                    {
                    "name": "r",
                    "type": "sqrt",
                    "domain": {"data": "table", "field": "data"},
                    "zero": true,
                    "range": [20, 100]
                    }
                ],

                "marks": [
                    {
                    "type": "arc",
                    "from": {"data": "table"},
                    "encode": {
                        "enter": {
                        "x": {"field": {"group": "width"}, "mult": 0.5},
                        "y": {"field": {"group": "height"}, "mult": 0.5},
                        "startAngle": {"field": "startAngle"},
                        "endAngle": {"field": "endAngle"},
                        "innerRadius": {"value": 20},
                        "outerRadius": {"scale": "r", "field": "data"},
                        "stroke": {"value": "#fff"}
                        },
                        "update": {
                        "fill": {"value": "#ccc"}
                        },
                        "hover": {
                        "fill": {"value": "pink"}
                        }
                    }
                    },

                    {
                    "type": "text",
                    "from": {"data": "table"},
                    "encode": {
                        "enter": {
                        "x": {"field": {"group": "width"}, "mult": 0.5},
                        "y": {"field": {"group": "height"}, "mult": 0.5},
                        "radius": {"scale": "r", "field": "data", "offset": 8},
                        "theta": {"signal": "(datum.startAngle + datum.endAngle)/2"},
                        "fill": {"value": "#000"},
                        "align": {"value": "center"},
                        "baseline": {"value": "middle"},
                        "text": {"field": "data"}
                        }
                    }
                    }
                ]
                }
            },
            table:{
                tableColor: 'white',
                tableCols: 1,
                tableHeight: 25,
                tableHideHeader: false,
                tableLeft: 5,
                tableRows: 1,
                tableTop: 300,
                tableWidth: 25,
            },
            image: {
                imageAlt: '',
                imageHeigt: 200,
                imageLeft: 5,
                imageSource: '', //  <img src="pic_mountain.jpg" alt="Mountain View" style="width:304px;height:228px;">
                imageTop: 300,
                imageWidth: 200,
            },
            properties: {
                widgetID: 11,
                dashboardID: 1,
                dashboardName: 'Collection of Pie charts',
                dashboardTabID: 2,
                dashboardTabName: "Value",
                widgetCode: 'FirstPie',
                widgetName: 'Pie contracts per Broker 2',
                widgetAddRestRow: true,
                widgetCreatedDateTime: '',
                widgetCreatedUserName: '',
                widgetComments: '',
                widgetDefaultExportFileType: '',
                widgetDescription: 'This graph showing ...',
                widgetIndex: 3,
                widgetIsLocked: true,
                widgetHyperLinkTabNr: '',
                widgetHyperLinkWidgetID: '',
                widgetIsLiked: false,
                widgetLiked: [
                    {
                        widgetLikedUserName: '',
                    }
                ],
                widgetPassword: '',
                widgetRefreshedDateTime: '',
                widgetRefreshedUserName: '',
                widgetRefreshFrequency: 3,
                widgetRefreshMode: '',
                widgetReportID: -1,
                widgetReportName: '',
                widgetReportParameters: '',
                widgetShowLimitedRows: 0,
                widgetSize: '',
                widgetSystemMessage: '',
                widgetTypeID: 0,
                widgetType: 'WidgetSet',
                widgetUpdatedDateTime: '',
                widgetUpdatedUserName: ''
            }
        },
        {
            container: {
                backgroundColor: 'white',
                border: '',
                boxShadow: '',
                color: 'black',
                fontSize: 1,
                height: 700,
                left: 210,
                widgetTitle: 'Momentum Equities',
                top: 100,
                width: 350,
            },
            areas: {
                showWidgetText: false,
                showWidgetGraph: true,
                showWidgetTable: false,
                showWidgetImage: false,
            },
            textual: {
                textText: 'texie',
                textBackgroundColor: 'transparent',
                textBorder: 'none',
                textColor: 'darkgray',
                textFontSize: 1,
                textFontWeight: 'normal',
                textHeight: 16,
                textLeft: 0,
                textMargin: '0 5px 0 5px',
                textPadding:  '5px 0 5px',
                textPosition: 'absolute',
                textTextAlign: 'center',
                textTop: 25,
                textWidth: 0,
            },
            graph: {
                graphID: 0,
                graphLeft: 5,
                graphTop: 25,
                vegaParameters: {
                    vegaGraphHeight: 200,
                    vegaGraphWidth: 180,
                    vegaGraphPadding: 10,
                    vegaHasSignals: true,
                    vegaXcolumn: 'category',
                    vegaYcolumn: 'amount',
                    vegaFillColor: 'pink',
                    vegaHoverColor: 'lightgray'
                },
                spec: {
                "$schema": "https://vega.github.io/schema/vega/v3.0.json",
                "width": 170,
                "height": 400,
                "autosize": "none",
                "padding": 40,
                "signals": [
                    {
                    "name": "startAngle", "value": 0,
                    "bind": {"input": "range", "min": 0, "max": 6.29, "step": 0.01}
                    },
                    {
                    "name": "endAngle", "value": 6.29,
                    "bind": {"input": "range", "min": 0, "max": 6.29, "step": 0.01}
                    },
                    {
                    "name": "padAngle", "value": 0,
                    "bind": {"input": "range", "min": 0, "max": 0.1}
                    },
                    {
                    "name": "innerRadius", "value": 60,
                    "bind": {"input": "range", "min": 0, "max": 90, "step": 1}
                    },
                    {
                    "name": "cornerRadius", "value": 0,
                    "bind": {"input": "range", "min": 0, "max": 10, "step": 0.5}
                    },
                    {
                    "name": "sort", "value": false,
                    "bind": {"input": "checkbox"}
                    }
                ],

                "data": [
                    {
                    "name": "table",
                    "values": [
                        {"field": 4},
                        {"field": 6},
                        {"field": 10},
                        {"field": 3},
                        {"field": 7},
                        {"field": 8}
                    ],
                    "transform": [
                        {
                        "type": "pie",
                        "field": "field",
                        "startAngle": {"signal": "startAngle"},
                        "endAngle": {"signal": "endAngle"},
                        "sort": {"signal": "sort"}
                        }
                    ]
                    }
                ],

                "scales": [
                    {
                    "name": "color",
                    "type": "ordinal",
                    "range": {"scheme": "category20"}
                    }
                ],

                "marks": [
                    {
                    "type": "arc",
                    "from": {"data": "table"},
                    "encode": {
                        "enter": {
                        "fill": {"scale": "color", "field": "_id"},
                        "x": {"signal": "width / 2"},
                        "y": {"signal": "height / 2"}
                        },
                        "update": {
                        "startAngle": {"field": "startAngle"},
                        "endAngle": {"field": "endAngle"},
                        "padAngle": {"signal": "padAngle"},
                        "innerRadius": {"signal": "innerRadius"},
                        "outerRadius": {"signal": "width / 2"},
                        "cornerRadius": {"signal": "cornerRadius"}
                        }
                    }
                    }
                ]
                }
            },
            table:{
                tableColor: 'white',
                tableCols: 1,
                tableHeight: 25,
                tableHideHeader: false,
                tableLeft: 5,
                tableRows: 1,
                tableTop: 300,
                tableWidth: 25,
            },
            image: {
                imageAlt: '',
                imageHeigt: 200,
                imageLeft: 5,
                imageSource: '', //  <img src="pic_mountain.jpg" alt="Mountain View" style="width:304px;height:228px;">
                imageTop: 300,
                imageWidth: 200,
            },
            properties: {
                widgetID: 12,
                dashboardID: 1,
                dashboardName: 'Collection of Pie charts',
                dashboardTabID: 3,
                dashboardTabName: "Volume",
                widgetCode: 'SecondBar',
                widgetName: 'Line Volume 1',
                widgetAddRestRow: true,
                widgetCreatedDateTime: '',
                widgetCreatedUserName: '',
                widgetComments: '',
                widgetDefaultExportFileType: '',
                widgetDescription: 'This graph showing ...',
                widgetIndex: 2,
                widgetIsLocked: true,
                widgetHyperLinkTabNr: '',
                widgetHyperLinkWidgetID: '',
                widgetIsLiked: false,
                widgetLiked: [
                    {
                        widgetLikedUserName: '',
                    }
                ],
                widgetPassword: '',
                widgetRefreshedDateTime: '',
                widgetRefreshedUserName: '',
                widgetRefreshFrequency: 3,
                widgetRefreshMode: '',
                widgetReportID: -1,
                widgetReportName: '',
                widgetReportParameters: '',
                widgetShowLimitedRows: 0,
                widgetSize: '',
                widgetSystemMessage: '',
                widgetTypeID: 0,
                widgetType: 'WidgetSet',
                widgetUpdatedDateTime: '',
                widgetUpdatedUserName: ''
            }
        },

        {
            container: {
                backgroundColor: 'powderblue',
                border: '1px solid darkgray',
                boxShadow: '2px 2px 12px black',
                color: 'black',
                fontSize: 2,
                height: 280,
                left: 800,
                widgetTitle: 'FTSE 100',
                top: 90,
                width: 350,
            },
            areas: {
                showWidgetText: false,
                showWidgetGraph: true,
                showWidgetTable: false,
                showWidgetImage: false,
            },
            textual: {
                textText: 'texie',
                textBackgroundColor: 'transparent',
                textBorder: 'none',
                textColor: 'darkgray',
                textFontSize: 1,
                textFontWeight: 'normal',
                textHeight: 16,
                textLeft: 0,
                textMargin: '0 5px 0 5px',
                textPadding:  '5px 0 5px',
                textPosition: 'absolute',
                textTextAlign: 'center',
                textTop: 25,
                textWidth: 0,
            },
            graph: {
                graphID: 0,
                graphLeft: 5,
                graphTop: 25,
                vegaParameters: {
                    vegaGraphHeight: 200,
                    vegaGraphWidth: 180,
                    vegaGraphPadding: 10,
                    vegaHasSignals: true,
                    vegaXcolumn: 'category',
                    vegaYcolumn: 'amount',
                    vegaFillColor: 'pink',
                    vegaHoverColor: 'lightgray'
                },
                spec: {
                    "$schema": "https://vega.github.io/schema/vega/v3.0.json",
                    "width": 960,
                    "height": 500,
                    "autosize": "none",

                    "data": [
                        {
                        "name": "unemp",
                        "url": "../assets/vega/vega-datasets/unemployment.tsv",
                        "format": {"type": "tsv", "parse": "auto"}
                        },
                        {
                        "name": "counties",
                        "url": "../assets/vega/vega-datasets/us-10m.json",
                        "format": {"type": "topojson", "feature": "counties"},
                        "transform": [
                            { "type": "lookup", "from": "unemp", "key": "id", "fields": ["id"], "as": ["unemp"] },
                            { "type": "filter", "expr": "datum.unemp != null" }
                        ]
                        }
                    ],

                    "projections": [
                        {
                        "name": "projection",
                        "type": "albersUsa"
                        }
                    ],

                    "scales": [
                        {
                        "name": "color",
                        "type": "quantize",
                        "domain": [0, 0.15],
                        "range": {"scheme": "blues-9"}
                        }
                    ],

                    "legends": [
                        {
                        "fill": "color",
                        "orient": "bottom-right",
                        "title": "Unemployment",
                        "format": "0.1%",
                        "encode": {
                            "symbols": {
                            "update": {
                                "shape": {"value": "square"},
                                "stroke": {"value": "#ccc"},
                                "strokeWidth": {"value": 0.2}
                            }
                            }
                        }
                        }
                    ],

                    "marks": [
                        {
                        "type": "shape",
                        "from": {"data": "counties"},
                        "encode": {
                            "enter": { "tooltip": {"signal": "format(datum.unemp.rate, '0.1%')"}},
                            "update": { "fill": {"scale": "color", "field": "unemp.rate"} },
                            "hover": { "fill": {"value": "red"} }
                        },
                        "transform": [
                            { "type": "geoshape", "projection": "projection" }
                        ]
                        }
                    ]
                }
            },
            table:{
                tableColor: 'white',
                tableCols: 1,
                tableHeight: 25,
                tableHideHeader: false,
                tableLeft: 5,
                tableRows: 1,
                tableTop: 300,
                tableWidth: 25,
            },
            image: {
                imageAlt: '',
                imageHeigt: 200,
                imageLeft: 5,
                imageSource: '', //  <img src="pic_mountain.jpg" alt="Mountain View" style="width:304px;height:228px;">
                imageTop: 300,
                imageWidth: 200,
            },
            properties: {
                widgetID: 21,
                dashboardID: 3,
                dashboardName: 'Tree map ...',
                dashboardTabID: 4,
                dashboardTabName: "Value",
                widgetCode: 'FirstPie',
                widgetName: 'Pie contracts per Broker 2',
                widgetAddRestRow: true,
                widgetCreatedDateTime: '',
                widgetCreatedUserName: '',
                widgetComments: '',
                widgetDefaultExportFileType: '',
                widgetDescription: 'This graph showing ...',
                widgetIndex: 4,
                widgetIsLocked: true,
                widgetHyperLinkTabNr: '',
                widgetHyperLinkWidgetID: '',
                widgetIsLiked: false,
                widgetLiked: [
                    {
                        widgetLikedUserName: '',
                    }
                ],
                widgetPassword: '',
                widgetRefreshedDateTime: '',
                widgetRefreshedUserName: '',
                widgetRefreshFrequency: 3,
                widgetRefreshMode: '',
                widgetReportID: -1,
                widgetReportName: '',
                widgetReportParameters: '',
                widgetShowLimitedRows: 0,
                widgetSize: '',
                widgetSystemMessage: '',
                widgetTypeID: 0,
                widgetType: 'WidgetSet',
                widgetUpdatedDateTime: '',
                widgetUpdatedUserName: ''
            },
        },

        {
            container: {
                backgroundColor: 'powderblue',
                border: '1px solid darkgray',
                boxShadow: '2px 2px 12px black',
                color: 'black',
                fontSize: 0.4,
                height: 780,
                left: 200,
                widgetTitle: 'ZAR/USD exRate',
                top: 80,
                width: 1050,
            },
            areas: {
                showWidgetText: false,
                showWidgetGraph: true,
                showWidgetTable: false,
                showWidgetImage: false,
            },
            textual: {
                textText: 'texie',
                textBackgroundColor: 'transparent',
                textBorder: 'none',
                textColor: 'darkgray',
                textFontSize: 1,
                textFontWeight: 'normal',
                textHeight: 16,
                textLeft: 0,
                textMargin: '0 5px 0 5px',
                textPadding:  '5px 0 5px',
                textPosition: 'absolute',
                textTextAlign: 'center',
                textTop: 25,
                textWidth: 0,
            },
            graph: {
                graphID: 0,
                graphLeft: 5,
                graphTop: 25,
                vegaParameters: {
                    vegaGraphHeight: 200,
                    vegaGraphWidth: 180,
                    vegaGraphPadding: 10,
                    vegaHasSignals: true,
                    vegaXcolumn: 'category',
                    vegaYcolumn: 'amount',
                    vegaFillColor: 'pink',
                    vegaHoverColor: 'lightgray'
                },
                spec: {
                    "$schema": "https://vega.github.io/schema/vega/v3.0.json",
                    "width": 600,
                    "height": 1600,
                    "padding": 5,

                    "signals": [
                        {
                        "name": "labels", "value": true,
                        "bind": {"input": "checkbox"}
                        },
                        {
                        "name": "layout", "value": "tidy",
                        "bind": {"input": "radio", "options": ["tidy", "cluster"]}
                        },
                        {
                        "name": "links", "value": "diagonal",
                        "bind": {
                            "input": "select",
                            "options": ["line", "curve", "diagonal", "orthogonal"]
                        }
                        }
                    ],

                    "data": [
                        {
                        "name": "tree",
                        "url": "../assets/vega/vega-datasets/flare.json",
                        "transform": [
                            {
                            "type": "stratify",
                            "key": "id",
                            "parentKey": "parent"
                            },
                            {
                            "type": "tree",
                            "method": {"signal": "layout"},
                            "size": [{"signal": "height"}, {"signal": "width - 100"}],
                            "as": ["y", "x", "depth", "children"]
                            }
                        ]
                        },
                        {
                        "name": "links",
                        "source": "tree",
                        "transform": [
                            { "type": "treelinks", "key": "id" },
                            {
                            "type": "linkpath",
                            "orient": "horizontal",
                            "shape": {"signal": "links"}
                            }
                        ]
                        }
                    ],

                    "scales": [
                        {
                        "name": "color",
                        "type": "sequential",
                        "range": {"scheme": "magma"},
                        "domain": {"data": "tree", "field": "depth"},
                        "zero": true
                        }
                    ],

                    "marks": [
                        {
                        "type": "path",
                        "from": {"data": "links"},
                        "encode": {
                            "update": {
                            "path": {"field": "path"},
                            "stroke": {"value": "#ccc"}
                            }
                        }
                        },
                        {
                        "type": "symbol",
                        "from": {"data": "tree"},
                        "encode": {
                            "enter": {
                            "size": {"value": 100},
                            "stroke": {"value": "#fff"}
                            },
                            "update": {
                            "x": {"field": "x"},
                            "y": {"field": "y"},
                            "fill": {"scale": "color", "field": "depth"}
                            }
                        }
                        },
                        {
                        "type": "text",
                        "from": {"data": "tree"},
                        "encode": {
                            "enter": {
                            "text": {"field": "name"},
                            "fontSize": {"value": 9},
                            "baseline": {"value": "middle"}
                            },
                            "update": {
                            "x": {"field": "x"},
                            "y": {"field": "y"},
                            "dx": {"signal": "datum.children ? -7 : 7"},
                            "align": {"signal": "datum.children ? 'right' : 'left'"},
                            "opacity": {"signal": "labels ? 1 : 0"}
                            }
                        }
                        }
                    ]
                }
            },
            table:{
                tableColor: 'white',
                tableCols: 1,
                tableHeight: 25,
                tableHideHeader: false,
                tableLeft: 5,
                tableRows: 1,
                tableTop: 300,
                tableWidth: 25,
            },
            image: {
                imageAlt: '',
                imageHeigt: 200,
                imageLeft: 5,
                imageSource: '', //  <img src="pic_mountain.jpg" alt="Mountain View" style="width:304px;height:228px;">
                imageTop: 300,
                imageWidth: 200,
            },
            properties: {
                widgetID: 6,
                dashboardID: 3,
                dashboardName: 'Tree map ...',
                dashboardTabID: 4,
                dashboardTabName: "Value",
                widgetCode: 'FirstPie',
                widgetName: 'Pie contracts per Broker 2',

                widgetAddRestRow: true,
                widgetCreatedDateTime: '',
                widgetCreatedUserName: '',
                widgetComments: '',
                widgetDefaultExportFileType: '',
                widgetDescription: 'This graph showing ...',
                widgetIndex: 4,
                widgetIsLocked: true,
                widgetHyperLinkTabNr: '',
                widgetHyperLinkWidgetID: '',
                widgetIsLiked: false,
                widgetLiked: [
                    {
                        widgetLikedUserName: '',
                    }
                ],
                widgetPassword: '',
                widgetRefreshedDateTime: '',
                widgetRefreshedUserName: '',
                widgetRefreshFrequency: 3,
                widgetRefreshMode: '',
                widgetReportID: -1,
                widgetReportName: '',
                widgetReportParameters: '',
                widgetShowLimitedRows: 0,
                widgetSize: '',
                widgetSystemMessage: '',
                widgetTypeID: 0,
                widgetType: 'WidgetSet',
                widgetUpdatedDateTime: '',
                widgetUpdatedUserName: ''
            }
        },

        {
            container: {
                backgroundColor: 'powderblue',
                border: '1px solid darkgray',
                boxShadow: '2px 2px 12px black',
                color: 'black',
                fontSize: 2,
                height: 480,
                left: 260,
                widgetTitle: 'Population in Kenya',
                top: 120,
                width: 860,
            },
            areas: {
                showWidgetText: false,
                showWidgetGraph: true,
                showWidgetTable: false,
                showWidgetImage: false,
            },
            textual: {
                textText: 'texie',
                textBackgroundColor: 'transparent',
                textBorder: 'none',
                textColor: 'darkgray',
                textFontSize: 1,
                textFontWeight: 'normal',
                textHeight: 16,
                textLeft: 0,
                textMargin: '0 5px 0 5px',
                textPadding:  '5px 0 5px',
                textPosition: 'absolute',
                textTextAlign: 'center',
                textTop: 25,
                textWidth: 0,
            },
            graph: {
                graphID: 0,
                graphLeft: 5,
                graphTop: 25,
                vegaParameters: {
                    vegaGraphHeight: 200,
                    vegaGraphWidth: 180,
                    vegaGraphPadding: 10,
                    vegaHasSignals: true,
                    vegaXcolumn: 'category',
                    vegaYcolumn: 'amount',
                    vegaFillColor: 'pink',
                    vegaHoverColor: 'lightgray'
                },
                spec: {
                    "$schema": "https://vega.github.io/schema/vega/v3.0.json",
                    "name": "wordcloud",
                    "width": 800,
                    "height": 400,
                    "padding": 0,

                    "data": [
                        {
                        "name": "table",
                        "values": [
                            "Declarative visualization grammars can accelerate development, facilitate retargeting across platforms, and allow language-level optimizations. However, existing declarative visualization languages are primarily concerned with visual encoding, and rely on imperative event handlers for interactive behaviors. In response, we introduce a model of declarative interaction design for data visualizations. Adopting methods from reactive programming, we model low-level events as composable data streams from which we form higher-level semantic signals. Signals feed predicates and scale inversions, which allow us to generalize interactive selections at the level of item geometry (pixels) into interactive queries over the data domain. Production rules then use these queries to manipulate the visualization’s appearance. To facilitate reuse and sharing, these constructs can be encapsulated as named interactors: standalone, purely declarative specifications of interaction techniques. We assess our model’s feasibility and expressivity by instantiating it with extensions to the Vega visualization grammar. Through a diverse range of examples, we demonstrate coverage over an established taxonomy of visualization interaction techniques.",
                            "We present Reactive Vega, a system architecture that provides the first robust and comprehensive treatment of declarative visual and interaction design for data visualization. Starting from a single declarative specification, Reactive Vega constructs a dataflow graph in which input data, scene graph elements, and interaction events are all treated as first-class streaming data sources. To support expressive interactive visualizations that may involve time-varying scalar, relational, or hierarchical data, Reactive Vega’s dataflow graph can dynamically re-write itself at runtime by extending or pruning branches in a data-driven fashion. We discuss both compile- and run-time optimizations applied within Reactive Vega, and share the results of benchmark studies that indicate superior interactive performance to both D3 and the original, non-reactive Vega system.",
                            "We present Vega-Lite, a high-level grammar that enables rapid specification of interactive data visualizations. Vega-Lite combines a traditional grammar of graphics, providing visual encoding rules and a composition algebra for layered and multi-view displays, with a novel grammar of interaction. Users specify interactive semantics by composing selections. In Vega-Lite, a selection is an abstraction that defines input event processing, points of interest, and a predicate function for inclusion testing. Selections parameterize visual encodings by serving as input data, defining scale extents, or by driving conditional logic. The Vega-Lite compiler automatically synthesizes requisite data flow and event handling logic, which users can override for further customization. In contrast to existing reactive specifications, Vega-Lite selections decompose an interaction design into concise, enumerable semantic units. We evaluate Vega-Lite through a range of examples, demonstrating succinct specification of both customized interaction methods and common techniques such as panning, zooming, and linked selection."
                        ],
                        "transform": [
                            {
                            "type": "countpattern",
                            "field": "data",
                            "case": "upper",
                            "pattern": "[\\w']{3,}",
                            "stopwords": "(i|me|my|myself|we|us|our|ours|ourselves|you|your|yours|yourself|yourselves|he|him|his|himself|she|her|hers|herself|it|its|itself|they|them|their|theirs|themselves|what|which|who|whom|whose|this|that|these|those|am|is|are|was|were|be|been|being|have|has|had|having|do|does|did|doing|will|would|should|can|could|ought|i'm|you're|he's|she's|it's|we're|they're|i've|you've|we've|they've|i'd|you'd|he'd|she'd|we'd|they'd|i'll|you'll|he'll|she'll|we'll|they'll|isn't|aren't|wasn't|weren't|hasn't|haven't|hadn't|doesn't|don't|didn't|won't|wouldn't|shan't|shouldn't|can't|cannot|couldn't|mustn't|let's|that's|who's|what's|here's|there's|when's|where's|why's|how's|a|an|the|and|but|if|or|because|as|until|while|of|at|by|for|with|about|against|between|into|through|during|before|after|above|below|to|from|up|upon|down|in|out|on|off|over|under|again|further|then|once|here|there|when|where|why|how|all|any|both|each|few|more|most|other|some|such|no|nor|not|only|own|same|so|than|too|very|say|says|said|shall)"
                            },
                            {
                            "type": "formula", "as": "angle",
                            "expr": "[-45, 0, 45][~~(random() * 3)]"
                            },
                            {
                            "type": "formula", "as": "weight",
                            "expr": "if(datum.text=='VEGA', 600, 300)"
                            }
                        ]
                        }
                    ],

                    "scales": [
                        {
                        "name": "color",
                        "type": "ordinal",
                        "range": ["#d5a928", "#652c90", "#939597"]
                        }
                    ],

                    "marks": [
                        {
                        "type": "text",
                        "from": {"data": "table"},
                        "encode": {
                            "enter": {
                            "text": {"field": "text"},
                            "align": {"value": "center"},
                            "baseline": {"value": "alphabetic"},
                            "fill": {"scale": "color", "field": "text"}
                            },
                            "update": {
                            "fillOpacity": {"value": 1}
                            },
                            "hover": {
                            "fillOpacity": {"value": 0.5}
                            }
                        },
                        "transform": [
                            {
                            "type": "wordcloud",
                            "size": [800, 400],
                            "text": {"field": "text"},
                            "rotate": {"field": "datum.angle"},
                            "font": "Helvetica Neue, Arial",
                            "fontSize": {"field": "datum.count"},
                            "fontWeight": {"field": "datum.weight"},
                            "fontSizeRange": [12, 56],
                            "padding": 2
                            }
                        ]
                        }
                    ]
                }
            },
            table:{
                tableColor: 'white',
                tableCols: 1,
                tableHeight: 25,
                tableHideHeader: false,
                tableLeft: 5,
                tableRows: 1,
                tableTop: 300,
                tableWidth: 25,
            },
            image: {
                imageAlt: '',
                imageHeigt: 200,
                imageLeft: 5,
                imageSource: '', //  <img src="pic_mountain.jpg" alt="Mountain View" style="width:304px;height:228px;">
                imageTop: 300,
                imageWidth: 200,
            },
            properties: {
                widgetID: 41,
                dashboardID: 4,
                dashboardName: 'Word Cloud of random text',
                dashboardTabID: 5,
                dashboardTabName: "Value",
                widgetCode: 'FirstPie',
                widgetName: 'Pie contracts per Broker 2',

                widgetAddRestRow: true,
                widgetCreatedDateTime: '',
                widgetCreatedUserName: '',
                widgetComments: '',
                widgetDefaultExportFileType: '',
                widgetDescription: 'This graph showing ...',
                widgetIndex: 4,
                widgetIsLocked: true,
                widgetHyperLinkTabNr: '',
                widgetHyperLinkWidgetID: '',
                widgetIsLiked: false,
                widgetLiked: [
                    {
                        widgetLikedUserName: '',
                    }
                ],
                widgetPassword: '',
                widgetRefreshedDateTime: '',
                widgetRefreshedUserName: '',
                widgetRefreshFrequency: 3,
                widgetRefreshMode: '',
                widgetReportID: -1,
                widgetReportName: '',
                widgetReportParameters: '',
                widgetShowLimitedRows: 0,
                widgetSize: '',
                widgetSystemMessage: '',
                widgetTypeID: 0,
                widgetType: 'WidgetSet',
                widgetUpdatedDateTime: '',
                widgetUpdatedUserName: ''
            }
        },

        {
            container: {
                backgroundColor: 'powderblue',
                border: '1px solid darkgray',
                boxShadow: '2px 2px 12px black',
                color: 'black',
                fontSize: 1,
                height: 630,
                left: 210,
                widgetTitle: 'Roads in Brasil',
                top: 60,
                width: 900,
            },
            areas: {
                showWidgetText: false,
                showWidgetGraph: true,
                showWidgetTable: false,
                showWidgetImage: false,
            },
            textual: {
                textText: 'texie',
                textBackgroundColor: 'transparent',
                textBorder: 'none',
                textColor: 'darkgray',
                textFontSize: 1,
                textFontWeight: 'normal',
                textHeight: 16,
                textLeft: 0,
                textMargin: '0 5px 0 5px',
                textPadding:  '5px 0 5px',
                textPosition: 'absolute',
                textTextAlign: 'center',
                textTop: 25,
                textWidth: 0,
            },
            graph: {
                graphID: 0,
                graphLeft: 5,
                graphTop: 25,
                vegaParameters: {
                    vegaGraphHeight: 200,
                    vegaGraphWidth: 180,
                    vegaGraphPadding: 10,
                    vegaHasSignals: true,
                    vegaXcolumn: 'category',
                    vegaYcolumn: 'amount',
                    vegaFillColor: 'pink',
                    vegaHoverColor: 'lightgray'
                },
                spec: {
                    "$schema": "https://vega.github.io/schema/vega/v3.0.json",
                    "width": 800,
                    "height": 500,
                    "padding": 15,

                    "signals": [
                        {
                        "name": "sex", "value": "all",
                        "bind": {"input": "radio", "options": ["men", "women", "all"]}
                        },
                        {
                        "name": "query", "value": "",
                        "on": [
                            {"events": "area:click!", "update": "datum.job"},
                            {"events": "dblclick!", "update": "''"}
                        ],
                        "bind": {"input": "text", "placeholder": "search", "autocomplete": "off"}
                        }
                    ],

                    "data": [
                        {
                        "name": "jobs",
                        "url": "../assets/vega/vega-datasets/jobs.json",
                        "transform": [
                            {
                            "type": "filter",
                            "expr": "(sex === 'all' || datum.sex === sex) && (!query || test(regexp(query,'i'), datum.job))"
                            },
                            {
                            "type": "stack",
                            "field": "perc",
                            "groupby": ["year"],
                            "sort": {
                                "field": ["job", "sex"],
                                "order": ["descending", "descending"]
                            }
                            }
                        ]
                        },
                        {
                        "name": "series",
                        "source": "jobs",
                        "transform": [
                            {
                            "type": "aggregate",
                            "groupby": ["job", "sex"],
                            "fields": ["perc", "perc"],
                            "ops": ["sum", "argmax"],
                            "as": ["sum", "argmax"]
                            }
                        ]
                        }
                    ],

                    "scales": [
                        {
                        "name": "x",
                        "type": "linear",
                        "range": "width",
                        "zero": false, "round": true,
                        "domain": {"data": "jobs", "field": "year"}
                        },
                        {
                        "name": "y",
                        "type": "linear",
                        "range": "height", "round": true, "zero": true,
                        "domain": {"data": "jobs", "field": "y1"}
                        },
                        {
                        "name": "color",
                        "type": "ordinal",
                        "domain": ["men", "women"],
                        "range": ["#33f", "#f33"]
                        },
                        {
                        "name": "alpha",
                        "type": "linear", "zero": true,
                        "domain": {"data": "series", "field": "sum"},
                        "range": [0.4, 0.8]
                        },
                        {
                        "name": "font",
                        "type": "sqrt",
                        "range": [0, 20], "round": true, "zero": true,
                        "domain": {"data": "series", "field": "argmax.perc"}
                        },
                        {
                        "name": "opacity",
                        "type": "quantile",
                        "range": [0, 0, 0, 0, 0, 0.1, 0.2, 0.4, 0.7, 1.0],
                        "domain": {"data": "series", "field": "argmax.perc"}
                        },
                        {
                        "name": "align",
                        "type": "quantize",
                        "range": ["left", "center", "right"], "zero": false,
                        "domain": [1730, 2130]
                        },
                        {
                        "name": "offset",
                        "type": "quantize",
                        "range": [6, 0, -6], "zero": false,
                        "domain": [1730, 2130]
                        }
                    ],

                    "axes": [
                        {
                        "orient": "bottom", "scale": "x", "format": "d", "tickCount": 15
                        },
                        {
                        "orient": "right", "scale": "y", "format": "%",
                        "grid": true, "domain": false, "tickSize": 12,
                        "encode": {
                            "grid": {"enter": {"stroke": {"value": "#ccc"}}},
                            "ticks": {"enter": {"stroke": {"value": "#ccc"}}}
                        }
                        }
                    ],

                    "marks": [
                        {
                        "type": "group",
                        "from": {
                            "data": "series",
                            "facet": {
                            "name": "facet",
                            "data": "jobs",
                            "groupby": ["job", "sex"]
                            }
                        },

                        "marks": [
                            {
                            "type": "area",
                            "from": {"data": "facet"},
                            "encode": {
                                "update": {
                                "x": {"scale": "x", "field": "year"},
                                "y": {"scale": "y", "field": "y0"},
                                "y2": {"scale": "y", "field": "y1"},
                                "fill": {"scale": "color", "field": "sex"},
                                "fillOpacity": {"scale": "alpha", "field": {"parent": "sum"}}
                                },
                                "hover": {
                                "fillOpacity": {"value": 0.2}
                                }
                            }
                            }
                        ]
                        },
                        {
                        "type": "text",
                        "from": {"data": "series"},
                        "interactive": false,
                        "encode": {
                            "update": {
                            "x": {"scale": "x", "field": "argmax.year"},
                            "dx": {"scale": "offset", "field": "argmax.year"},
                            "y": {"signal": "scale('y', 0.5 * (datum.argmax.y0 + datum.argmax.y1))"},
                            "fill": {"value": "#000"},
                            "fillOpacity": {"scale": "opacity", "field": "argmax.perc"},
                            "fontSize": {"scale": "font", "field": "argmax.perc", "offset": 5},
                            "text": {"field": "job"},
                            "align": {"scale": "align", "field": "argmax.year"},
                            "baseline": {"value": "middle"}
                            }
                        }
                        }
                    ]
                    }
            },
            table:{
                tableColor: 'white',
                tableCols: 1,
                tableHeight: 25,
                tableHideHeader: false,
                tableLeft: 5,
                tableRows: 1,
                tableTop: 300,
                tableWidth: 25,
            },
            image: {
                imageAlt: '',
                imageHeigt: 200,
                imageLeft: 5,
                imageSource: '', //  <img src="pic_mountain.jpg" alt="Mountain View" style="width:304px;height:228px;">
                imageTop: 300,
                imageWidth: 200,
            },
            properties: {
                widgetID: 51,
                dashboardID: 5,
                dashboardName: 'Stacked graph with jobs timeseries',
                dashboardTabID: 6,
                dashboardTabName: "Value",
                widgetCode: 'FirstPie',
                widgetName: 'Pie contracts per Broker 2',

                widgetAddRestRow: true,
                widgetCreatedDateTime: '',
                widgetCreatedUserName: '',
                widgetComments: '',
                widgetDefaultExportFileType: '',
                widgetDescription: 'This graph showing ...',
                widgetIndex: 4,
                widgetIsLocked: true,
                widgetHyperLinkTabNr: '',
                widgetHyperLinkWidgetID: '',
                widgetIsLiked: false,
                widgetLiked: [
                    {
                        widgetLikedUserName: '',
                    }
                ],
                widgetPassword: '',
                widgetRefreshedDateTime: '',
                widgetRefreshedUserName: '',
                widgetRefreshFrequency: 3,
                widgetRefreshMode: '',
                widgetReportID: -1,
                widgetReportName: '',
                widgetReportParameters: '',
                widgetShowLimitedRows: 0,
                widgetSize: '',
                widgetSystemMessage: '',
                widgetTypeID: 0,
                widgetType: 'WidgetSet',
                widgetUpdatedDateTime: '',
                widgetUpdatedUserName: ''
            }
        }
    ];

export const WIDGETCOMMENTS: WidgetComment[] =
    [
        {
            widgetCommentID: 1,
            widgetID: 1,
            widgetCommentThreadID: 1,
            widgetCommentCreatedDateTime: '2017/02/14 13:01',
            widgetCommentCreatedUserName: 'JohnS',
            widgetCommentHeading: 'Data Accuracy',
            widgetCommentBody: 'Is the Nov data correct?'
        },
        {
            widgetCommentID: 2,
            widgetID: 1,
            widgetCommentThreadID: 1,
            widgetCommentCreatedDateTime: '2017/02/14 13:15',
            widgetCommentCreatedUserName: 'SandyB',
            widgetCommentHeading: 'Data Accuracy',
            widgetCommentBody: 'Yip, checked against external source'
        },
        {
            widgetCommentID: 3,
            widgetID: 1,
            widgetCommentThreadID: 1,
            widgetCommentCreatedDateTime: '2017/02/14 14:03',
            widgetCommentCreatedUserName: 'JohnS',
            widgetCommentHeading: 'Data Accuracy',
            widgetCommentBody: 'Thanx'
        },
        {
            widgetCommentID: 4,
            widgetID: 1,
            widgetCommentThreadID: 2,
            widgetCommentCreatedDateTime: '2017/02/17 07:50',
            widgetCommentCreatedUserName: 'DonnaD',
            widgetCommentHeading: 'Congrats',
            widgetCommentBody: 'Excellent sales, keep going!'
        },
        {
            widgetCommentID: 5,
            widgetID: 1,
            widgetCommentThreadID: 14,
            widgetCommentCreatedDateTime: '2017/04/14',
            widgetCommentCreatedUserName: 'HenriD',
            widgetCommentHeading: 'More research required on incidents',
            widgetCommentBody: ''
        },
    ];

export const REPORTS: Report[] =
    [
        {
            reportID: 1,
            reportCode: 'EDM Val',
            reportName: 'EDM weekly Values',
            description: 'Description ...  etc',
            reportParameters: '',
            dataSourceID: 0,
            dataSourceParameters: '',
            reportFields:
                [ "category", "amount"],
            reportData:
                [
                    {"category": "A0", "amount": 38},
                    {"category": "B0", "amount": 45},
                    {"category": "C0", "amount": 53},
                    {"category": "D0", "amount": 61},
                    {"category": "E0", "amount": 71},
                    {"category": "F0", "amount": 83},
                    {"category": "G0", "amount": 99},
                    {"category": "H0", "amount": 107}
                ],
            reportCreatedDateTime: '2017/05/01',
            reportCreatedUserName: 'jannie'
        },
        {
            reportID: 2,
            reportCode: 'Bond Val',
            reportName: 'Bond monthly Values',
            description: 'Description ...  etc',
            reportParameters: '',
            dataSourceID: 1,
            dataSourceParameters: '',
            reportFields:
                [ "category", "amount"],
            reportData:
                [
                    {"category": "A22", "amount": 108},
                    {"category": "B22", "amount": 115},
                    {"category": "C22", "amount": 123},
                    {"category": "D22", "amount": 131},
                    {"category": "E22", "amount": 144},
                    {"category": "F22", "amount": 153},
                    {"category": "G22", "amount": 169},
                    {"category": "H22", "amount": 177}
                ],
            reportCreatedDateTime: '2017/05/01',
            reportCreatedUserName: 'jannie'
        }
    ];

export const WIDGETTEMPLATES: WidgetTemplate[] =
    [
        {
            widgetTemplateID: 0,
            widgetTemplateName: 'BarChart',
            widgetTemplateDescription: 'Template for the Vega spec of a Bar Chart',
            vegaParameters: {
                vegaGraphHeight: 200,
                vegaGraphWidth: 180,
                vegaGraphPadding: 10,
                vegaHasSignals: true,
                vegaXcolumn: 'category',
                vegaYcolumn: 'amount',
                vegaFillColor: 'pink',
                vegaHoverColor: 'lightgray'
            },
            vegaSpec:
                {
                    "$schema": "https://vega.github.io/schema/vega/v3.0.json",
                    "width": 400,
                    "height": 200,
                    "padding": 5,

                    "data": [
                        {
                        "name": "table",
                        "values": [
                            {"category": "A", "amount": 28},
                            {"category": "B", "amount": 55},
                            {"category": "C", "amount": 43},
                            {"category": "D", "amount": 91},
                            {"category": "E", "amount": 81},
                            {"category": "F", "amount": 53},
                            {"category": "G", "amount": 19},
                            {"category": "H", "amount": 87}
                        ]
                        }
                    ],

                    "signals": [
                        {
                        "name": "tooltip",
                        "value": {},
                        "on": [
                            {"events": "rect:mouseover", "update": "datum"},
                            {"events": "rect:mouseout",  "update": "{}"}
                        ]
                        }
                    ],

                    "scales": [
                        {
                        "name": "xscale",
                        "type": "band",
                        "domain": {"data": "table", "field": "category"},
                        "range": "width"
                        },
                        {
                        "name": "yscale",
                        "domain": {"data": "table", "field": "amount"},
                        "nice": true,
                        "range": "height"
                        }
                    ],

                    "axes": [
                        { "orient": "bottom", "scale": "xscale" },
                        { "orient": "left", "scale": "yscale" }
                    ],

                    "marks": [
                        {
                        "type": "rect",
                        "from": {"data":"table"},
                        "encode": {
                            "enter": {
                            "x": {"scale": "xscale", "field": "category", "offset": 1},
                            "width": {"scale": "xscale", "band": 1, "offset": -1},
                            "y": {"scale": "yscale", "field": "amount"},
                            "y2": {"scale": "yscale", "value": 0}
                            },
                            "update": {
                            "fill": {"value": "steelblue"}
                            },
                            "hover": {
                            "fill": {"value": "red"}
                            }
                        }
                        },
                        {
                        "type": "text",
                        "encode": {
                            "enter": {
                            "align": {"value": "center"},
                            "baseline": {"value": "bottom"},
                            "fill": {"value": "#333"}
                            },
                            "update": {
                            "x": {"scale": "xscale", "signal": "tooltip.category", "band": 0.5},
                            "y": {"scale": "yscale", "signal": "tooltip.amount", "offset": -2},
                            "text": {"signal": "tooltip.amount"},
                            "fillOpacity": [
                                {"test": "datum === tooltip", "value": 0},
                                {"value": 1}
                            ]
                            }
                        }
                        }
                    ]
                    },
            widgetTemplateCreatedDateTime: '2017/05/01',
            widgetTemplateCreatedUserName: 'janniei',
            widgetTemplateUpdatedDateTime: '2017/05/01',
            widgetTemplateUpdatedUserName: 'janniei'
        }
    ];

export const GROUPS: Group[] =
    [
        {
            groupID: 0,
            groupName: 'Admin',
            groupDescription: 'Admin group has full rights to the whole system',
            groupCreatedDateTime: '2017/05/01',
            groupCreatedUserName: 'JamesK',
            groupUpdatedDateTime: '2017/05/01',
            groupUpdatedUserName: 'JamesK'
        },
        {
            groupID: 1,
            groupName: 'Guest',
            groupDescription: 'Guest group has no rights',
            groupCreatedDateTime: '2017/05/01',
            groupCreatedUserName: 'JamesK',
            groupUpdatedDateTime: '2017/05/01',
            groupUpdatedUserName: 'JamesK'
        },
        {
            groupID: 2,
            groupName: 'BI Team',
            groupDescription: 'BI Team',
            groupCreatedDateTime: '2017/05/01',
            groupCreatedUserName: 'JamesK',
            groupUpdatedDateTime: '2017/05/01',
            groupUpdatedUserName: 'JamesK'
        },
        {
            groupID: 3,
            groupName: 'HR',
            groupDescription: 'Human Resources Department',
            groupCreatedDateTime: '2017/05/01',
            groupCreatedUserName: 'JamesK',
            groupUpdatedDateTime: '2017/05/01',
            groupUpdatedUserName: 'JamesK'
        },
        {
            groupID: 4,
            groupName: 'Finance',
            groupDescription: 'Finance Department',
            groupCreatedDateTime: '2017/05/01',
            groupCreatedUserName: 'JamesK',
            groupUpdatedDateTime: '2017/05/01',
            groupUpdatedUserName: 'JamesK'
        },
        {
            groupID: 5,
            groupName: 'Sales',
            groupDescription: 'Sales Department',
            groupCreatedDateTime: '2017/05/01',
            groupCreatedUserName: 'JamesK',
            groupUpdatedDateTime: '2017/05/01',
            groupUpdatedUserName: 'JamesK'
        },
        {
            groupID: 6,
            groupName: 'R&D',
            groupDescription: 'Research and Development Department',
            groupCreatedDateTime: '2017/05/01',
            groupCreatedUserName: 'JamesK',
            groupUpdatedDateTime: '2017/05/01',
            groupUpdatedUserName: 'JamesK'
        },
        {
            groupID: 7,
            groupName: 'IT',
            groupDescription: 'Information Technology Department',
            groupCreatedDateTime: '2017/05/01',
            groupCreatedUserName: 'JamesK',
            groupUpdatedDateTime: '2017/05/01',
            groupUpdatedUserName: 'JamesK'
        }
    ];

export const GROUPDATASOURCEACCESS: GroupDatasourceAccess[] =
    [
        {
            groupID: 0,
            datasourceID: 0,
            groupDatasourceAccessAccessType: 'Read',
            groupDatasourceAccessCreatedDateTime: '2017/05/01',
            groupDatasourceAccessCreatedUserName: 'PatricOS',
            groupDatasourceAccessUpdatedDateTime: '2017/05/01',
            groupDatasourceAccessUpdatedUserName: 'PatricOS'
        }
    ];

export const USERGROUPMEMBERSHIP: UserGroupMembership[] =
    [
        {
            groupID: 0,
            userName: 'janniei',
            userGroupMembershipCreatedDateTime: '2017/05/01',
            userGroupMembershipCreatedUserName:  'JamesK',
            userGroupMembershipUpdatedDateTime: '2017/05/01',
            userGroupMembershipUpdatedUserName: 'JamesK'
        },
        {
            groupID: 4,
            userName: 'janniei',
            userGroupMembershipCreatedDateTime: '2017/05/01',
            userGroupMembershipCreatedUserName:  'JamesK',
            userGroupMembershipUpdatedDateTime: '2017/05/01',
            userGroupMembershipUpdatedUserName: 'JamesK'
        },
        {
            groupID: 1,
            userName: 'bradleyk',
            userGroupMembershipCreatedDateTime: '2017/05/01',
            userGroupMembershipCreatedUserName:  'JamesK',
            userGroupMembershipUpdatedDateTime: '2017/05/01',
            userGroupMembershipUpdatedUserName: 'JamesK'
        },
        {
            groupID: 5,
            userName: 'bradleyk',
            userGroupMembershipCreatedDateTime: '2017/05/01',
            userGroupMembershipCreatedUserName:  'JamesK',
            userGroupMembershipUpdatedDateTime: '2017/05/01',
            userGroupMembershipUpdatedUserName: 'JamesK'
        },
    ];

export const REPORTWIDGETSET: ReportWidgetSet[] =
    [
        {
            reportID: 1,
            widgetSetID: 1,
            widgetSetName: 'Blue Value per week',
            widgetSetDescription: 'Description blue ...',
            vegaSpec: {
                "$schema": "https://vega.github.io/schema/vega/v3.0.json",
                "width": 290,
                "height": 220,
                "padding": 5,

                "data": [
                    {
                    "name": "table",
                    "values": [
                        {"category": "A1", "amount": 28},
                        {"category": "B1", "amount": 55},
                        {"category": "C1", "amount": 43},
                        {"category": "D1", "amount": 91},
                        {"category": "E1", "amount": 81},
                        {"category": "F1", "amount": 53},
                        {"category": "G1", "amount": 19},
                        {"category": "H1", "amount": 87}
                    ]
                    }
                ],

                "signals": [
                    {
                    "name": "tooltip",
                    "value": {},
                    "on": [
                        {"events": "rect:mouseover", "update": "datum"},
                        {"events": "rect:mouseout",  "update": "{}"}
                    ]
                    }
                ],

                "scales": [
                    {
                    "name": "xscale",
                    "type": "band",
                    "domain": {"data": "table", "field": "category"},
                    "range": "width"
                    },
                    {
                    "name": "yscale",
                    "domain": {"data": "table", "field": "amount"},
                    "nice": true,
                    "range": "height"
                    }
                ],

                "axes": [
                    { "orient": "bottom", "scale": "xscale" },
                    { "orient": "left", "scale": "yscale" }
                ],

                "marks": [
                    {
                    "type": "rect",
                    "from": {"data":"table"},
                    "encode": {
                        "enter": {
                        "x": {"scale": "xscale", "field": "category", "offset": 1},
                        "width": {"scale": "xscale", "band": 1, "offset": -1},
                        "y": {"scale": "yscale", "field": "amount"},
                        "y2": {"scale": "yscale", "value": 0}
                        },
                        "update": {
                        "fill": {"value": "blue"}
                        },
                        "hover": {
                        "fill": {"value": "red"}
                        }
                    }
                    },
                    {
                    "type": "text",
                    "encode": {
                        "enter": {
                        "align": {"value": "center"},
                        "baseline": {"value": "bottom"},
                        "fill": {"value": "#333"}
                        },
                        "update": {
                        "x": {"scale": "xscale", "signal": "tooltip.category", "band": 0.5},
                        "y": {"scale": "yscale", "signal": "tooltip.amount", "offset": -2},
                        "text": {"signal": "tooltip.amount"},
                        "fillOpacity": [
                            {"test": "datum === tooltip", "value": 0},
                            {"value": 1}
                        ]
                        }
                    }
                    }
                ]
            },
            reportWidgetSetUpdatedDateTime: '20147/05/01',
            reportWidgetSetUpdatedUserName: 'janniei',
            reportWidgetSetCreatedDateTime: '20147/05/01',
            reportWidgetSetCreatedUserName: 'janniei',
        },
        {
            reportID: 1,
            widgetSetID: 2,
            widgetSetName: 'Green Value per week',
            widgetSetDescription: 'Description green ...',
            vegaSpec: {
                "$schema": "https://vega.github.io/schema/vega/v3.0.json",
                "width": 290,
                "height": 220,
                "padding": 5,

                "data": [
                    {
                    "name": "table",
                    "values": [
                        {"category": "A1", "amount": 28},
                        {"category": "B1", "amount": 55},
                        {"category": "C1", "amount": 43},
                        {"category": "D1", "amount": 91},
                        {"category": "E1", "amount": 81},
                        {"category": "F1", "amount": 53},
                        {"category": "G1", "amount": 19},
                        {"category": "H1", "amount": 87}
                    ]
                    }
                ],

                "signals": [
                    {
                    "name": "tooltip",
                    "value": {},
                    "on": [
                        {"events": "rect:mouseover", "update": "datum"},
                        {"events": "rect:mouseout",  "update": "{}"}
                    ]
                    }
                ],

                "scales": [
                    {
                    "name": "xscale",
                    "type": "band",
                    "domain": {"data": "table", "field": "category"},
                    "range": "width"
                    },
                    {
                    "name": "yscale",
                    "domain": {"data": "table", "field": "amount"},
                    "nice": true,
                    "range": "height"
                    }
                ],

                "axes": [
                    { "orient": "bottom", "scale": "xscale" },
                    { "orient": "left", "scale": "yscale" }
                ],

                "marks": [
                    {
                    "type": "rect",
                    "from": {"data":"table"},
                    "encode": {
                        "enter": {
                        "x": {"scale": "xscale", "field": "category", "offset": 1},
                        "width": {"scale": "xscale", "band": 1, "offset": -1},
                        "y": {"scale": "yscale", "field": "amount"},
                        "y2": {"scale": "yscale", "value": 0}
                        },
                        "update": {
                        "fill": {"value": "green"}
                        },
                        "hover": {
                        "fill": {"value": "white"}
                        }
                    }
                    },
                    {
                    "type": "text",
                    "encode": {
                        "enter": {
                        "align": {"value": "center"},
                        "baseline": {"value": "bottom"},
                        "fill": {"value": "#333"}
                        },
                        "update": {
                        "x": {"scale": "xscale", "signal": "tooltip.category", "band": 0.5},
                        "y": {"scale": "yscale", "signal": "tooltip.amount", "offset": -2},
                        "text": {"signal": "tooltip.amount"},
                        "fillOpacity": [
                            {"test": "datum === tooltip", "value": 0},
                            {"value": 1}
                        ]
                        }
                    }
                    }
                ]
            },
            reportWidgetSetUpdatedDateTime: '20147/05/01',
            reportWidgetSetUpdatedUserName: 'janniei',
            reportWidgetSetCreatedDateTime: '20147/05/01',
            reportWidgetSetCreatedUserName: 'janniei',

        },
        {
            reportID: 1,
            widgetSetID: 3,
            widgetSetName: 'Red Value per week',
            widgetSetDescription: 'Description red ...',
            vegaSpec: {
                "$schema": "https://vega.github.io/schema/vega/v3.0.json",
                "width": 290,
                "height": 220,
                "padding": 5,

                "data": [
                    {
                    "name": "table",
                    "values": [
                        {"category": "A1", "amount": 28},
                        {"category": "B1", "amount": 55},
                        {"category": "C1", "amount": 43},
                        {"category": "D1", "amount": 91},
                        {"category": "E1", "amount": 81},
                        {"category": "F1", "amount": 53},
                        {"category": "G1", "amount": 19},
                        {"category": "H1", "amount": 87}
                    ]
                    }
                ],

                "signals": [
                    {
                    "name": "tooltip",
                    "value": {},
                    "on": [
                        {"events": "rect:mouseover", "update": "datum"},
                        {"events": "rect:mouseout",  "update": "{}"}
                    ]
                    }
                ],

                "scales": [
                    {
                    "name": "xscale",
                    "type": "band",
                    "domain": {"data": "table", "field": "category"},
                    "range": "width"
                    },
                    {
                    "name": "yscale",
                    "domain": {"data": "table", "field": "amount"},
                    "nice": true,
                    "range": "height"
                    }
                ],

                "axes": [
                    { "orient": "bottom", "scale": "xscale" },
                    { "orient": "left", "scale": "yscale" }
                ],

                "marks": [
                    {
                    "type": "rect",
                    "from": {"data":"table"},
                    "encode": {
                        "enter": {
                        "x": {"scale": "xscale", "field": "category", "offset": 1},
                        "width": {"scale": "xscale", "band": 1, "offset": -1},
                        "y": {"scale": "yscale", "field": "amount"},
                        "y2": {"scale": "yscale", "value": 0}
                        },
                        "update": {
                        "fill": {"value": "darkred"}
                        },
                        "hover": {
                        "fill": {"value": "gray"}
                        }
                    }
                    },
                    {
                    "type": "text",
                    "encode": {
                        "enter": {
                        "align": {"value": "center"},
                        "baseline": {"value": "bottom"},
                        "fill": {"value": "#333"}
                        },
                        "update": {
                        "x": {"scale": "xscale", "signal": "tooltip.category", "band": 0.5},
                        "y": {"scale": "yscale", "signal": "tooltip.amount", "offset": -2},
                        "text": {"signal": "tooltip.amount"},
                        "fillOpacity": [
                            {"test": "datum === tooltip", "value": 0},
                            {"value": 1}
                        ]
                        }
                    }
                    }
                ]
            },
            reportWidgetSetUpdatedDateTime: '20147/05/01',
            reportWidgetSetUpdatedUserName: 'janniei',
            reportWidgetSetCreatedDateTime: '20147/05/01',
            reportWidgetSetCreatedUserName: 'janniei',

        }
    ];

export const CANVASMESSAGES: CanvasMessage[] =
    [
        {
            canvasMessageConversationID: 0,
            canvasMessageID: 0,
            canvasMessageSenderUserName: 'janniei',
            canvasMessageSentDateTime: '2017/05/01 09:10',
            canvasMessageIsSystemGenerated: false,
            canvasMessageDashboardID: 0,
            canvasMessageReportID: 1,
            canvasMessageWidgetID: -1,
            canvasMessageSubject: 'Value looks too low',
            canvasMessageBody: 'Please look at value for May, particularly in Bonds',
            canvasMessageSentToMe: false,
            canvasMessageMyStatus: 'UnRead',
            canvasMessageRecipients: [
                {
                    canvasMessageRecipientUserName: 'bradleyk',
                    canvasMessageRecipientStatus: 'Read',
                    canvasMessageReadDateTime: '2017/05/01 09:11',
                }
            ]
        },
        {
            canvasMessageConversationID: 0,
            canvasMessageID: 1,
            canvasMessageSenderUserName: 'bradleyk',
            canvasMessageSentDateTime: '2017/05/01 10:17',
            canvasMessageIsSystemGenerated: false,
            canvasMessageDashboardID: 0,
            canvasMessageReportID: 1,
            canvasMessageWidgetID: -1,
            canvasMessageSubject: 'Value looks too low',
            canvasMessageBody: 'Checked, all good',
            canvasMessageSentToMe: true,
            canvasMessageMyStatus: 'Read',
            canvasMessageRecipients: [
                {
                    canvasMessageRecipientUserName: 'janniei',
                    canvasMessageRecipientStatus: 'Read',
                    canvasMessageReadDateTime: '2017/05/01 11:50',
                }
            ]
        },
        {
            canvasMessageConversationID: 0,
            canvasMessageID: 2,
            canvasMessageSenderUserName: 'janniei',
            canvasMessageSentDateTime: '2017/05/01 11:51',
            canvasMessageIsSystemGenerated: false,
            canvasMessageDashboardID: 0,
            canvasMessageReportID: 1,
            canvasMessageWidgetID: -1,
            canvasMessageSubject: 'Value looks too low',
            canvasMessageBody: 'Thank you',
            canvasMessageSentToMe: false,
            canvasMessageMyStatus: 'UnRead',
            canvasMessageRecipients: [
                {
                    canvasMessageRecipientUserName: 'bradleyk',
                    canvasMessageRecipientStatus: 'UnRead',
                    canvasMessageReadDateTime: '',
                }
            ]
        },
        {
            canvasMessageConversationID: 1,
            canvasMessageID: 3,
            canvasMessageSenderUserName: 'janniei',
            canvasMessageSentDateTime: '2017/05/02 13:47',
            canvasMessageIsSystemGenerated: false,
            canvasMessageDashboardID: -1,
            canvasMessageReportID: 2,
            canvasMessageWidgetID: 3,
            canvasMessageSubject: 'Snacks available @ coffee machine',
            canvasMessageBody: 'Enjoy!',
            canvasMessageSentToMe: false,
            canvasMessageMyStatus: 'UnRead',
            canvasMessageRecipients: [
                {
                    canvasMessageRecipientUserName: 'jamesv',
                    canvasMessageRecipientStatus: 'UnRead',
                    canvasMessageReadDateTime: '',
                },
                {
                    canvasMessageRecipientUserName: 'bradleyk',
                    canvasMessageRecipientStatus: 'Read',
                    canvasMessageReadDateTime: '2017/05/02 14:23',
                },
                {
                    canvasMessageRecipientUserName: 'veronicas',
                    canvasMessageRecipientStatus: 'UnRead',
                    canvasMessageReadDateTime: '',
                }
            ]
        }
    ];


@Injectable()
export class EazlService implements OnInit {
    httpBaseUri: string;                                    // url for the RESTi
    httpHeaders: Headers;                                   // Header for http
    httpOptions: RequestOptions;                            // Options for http
    route: string = 'users';                                // Route to RESTi - users/authen...

    // Local Arrays to keep data for the rest of the Application
    borderDropdowns: SelectItem[];                          // List of Border dropdown options
    boxShadowDropdowns: SelectItem[];                       // List of Box Shadow dropdown options
    fontSizeDropdowns: SelectItem[];                        // List of FontSize dropdown options
    fontWeightDropdown: SelectItem[] = FONTWEIGHTDROPDOWNS; // List of FontWeight dropwdown options
    gridSizeDropdowns: SelectItem[];                        // List of Grid Size dropdown options
    textMarginDropdowns: SelectItem[];                      // List of Margins for text box dropdown options
    textPaddingDropdowns: SelectItem[] = TEXTPADDINGDROPDOWNS;      // List of Text Padding dropdown options
    textPositionDropdowns: SelectItem[] = TEXTPOSITIONDROPDOWNS;    // List of Text Position dropdown options
    textAlignDropdowns: SelectItem[] = TEXTALIGNDROPDOWNS;          // List of Text alignment options
    imageSourceDropdowns: SelectItem[] = IMAGESOURCEDROPDOWNS;       // List of Image Source file dropdown options
    backgroundImageDropdowns: SelectItem[];                 // List of backgrounds for dropdown options
    canvasMessages: CanvasMessage[] = CANVASMESSAGES;       // List of CanvasMessages
    canvasMessageRecipients: CanvasMessageRecipient[] = []; // List of canvasMessageRecipients
    dashboards: Dashboard[] = DASHBOARDS;                   // List of Dashboards
    dashboardGroupMembership: DashboardGroupMembership[] = DASHBOARDGROUPMEMBERSHIP; //List of Dashboard-Group
    dashboardGroupRelationship: DashboardGroupRelationship[] = DASHBOARDGROUPRELATIONSHIP; // Dashboard-Group relationships
    dashboardUserRelationship: DashboardUserRelationship[] = DASHBOARDUSERRELATIONSHIP; // Dashboard-Group relationships
    dashboardGroups: DashboardGroup[] = DASHBOARDGROUPS;    //List of Dashboard-Group
    dashboardsPerUser: DashboardsPerUser[] = [];            // List of DashboardsPerUser
    dashboardTabs: DashboardTab[] = DASHBOARDTABS;          // List of Dashboard Tabs
    datasources: DataSource[] = DATASOURCES;                // List of Data Sources
    datasourcesPerUser: DatasourcesPerUser[] = [];          // List of DatasourcesPerUser
    dataSourceUserAccess: DataSourceUserAccess[] = DATASOURCEUSERACCESS;   // List of users with Access to a Datasource
    filters: Filter[] [];                                   // List of Filters
    graphTypes: GraphType[] = GRAPHTYPES;                   // List of Graph Types
    groups: Group[] = GROUPS;                               // List of Groups
    groupDatasourceAccess: GroupDatasourceAccess[] = GROUPDATASOURCEACCESS;     // List of group access to DS
    isStaffDropdown: SelectItem[] = ISSTAFFDROPDOWN;        // List of IsStaff dropdown options
    notifications: Notification[] = [];                     // List of Notifications
    packageTask: PackageTask[] = [];                        // List of PackageTask
    reports: Report[] = REPORTS;                            // List of Reports
    reportHistory: ReportHistory[] = REPORTHISTORY;         // List of Report History (ran)
    reportUserRelationship: ReportUserRelationship[] = REPORTUSERRELATIONSHIP; // List of relationships
    reportWidgetSet: ReportWidgetSet[] = REPORTWIDGETSET;   // List of WidgetSets per Report
    personalisation: Personalisation = PERSONALISATION;     // Personal settings for current user
    storage: Storage = isDevMode() ? window.localStorage: window.sessionStorage;
    isSuperuserDropdown: SelectItem[] = ISSUPERUSERDROPDOWN; // List of IsSuperUser options for Dropdown
    systemConfiguration: SystemConfiguration = SYSTEMCONFIGURATION; // System wide settings
    users: User[] = [];                                     // List of Users
    userGroupMembership: UserGroupMembership[] = USERGROUPMEMBERSHIP;  // List of User-Group                               // List of Groups
    widgetComments: WidgetComment[] = WIDGETCOMMENTS;       // List of Widget Comments
    widgets: Widget[] = WIDGETS;                            // List of Widgets for a selected Dashboard
    widgetTemplates: WidgetTemplate[] = WIDGETTEMPLATES     // List of Widget Templates
    widgetTypes: WidgetType[];                              // List of Widget types

    constructor(
        private canvasDate: CanvasDate,
        private cdal: CDAL,
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private http: Http,
        private reconnectingWebSocket: ReconnectingWebSocket,
        ) {
            this.httpBaseUri = `${window.location.protocol}//${window.location.hostname}:8000/api/`
            this.httpHeaders = new Headers(
                {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            );
            this.httpOptions = new RequestOptions({headers: this.httpHeaders});
    }

    ngOnInit() {
        // Starters
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

    }

    getSystemConfiguration(): SystemConfiguration {
        // Returns SystemConfiguration

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataSystemConfiguration.getValue() == true) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'SystemConfiguration is dirty / not up to date',
                detail:   'The SystemConfiguration data is being refreshed; request again to get the latest from the database'
            });
        }

        this.globalFunctionService.printToConsole(this.constructor.name,'getSystemConfiguration', '@Start');

        return this.systemConfiguration;
    }

    getPersonalisation(): Personalisation {
        // Returns Personalisation
        this.globalFunctionService.printToConsole(this.constructor.name,'getPersonalisation', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataPersonalisation.getValue() == true) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'Personalisation is dirty / not up to date',
                detail:   'The Personalisation data is being refreshed; request again to get the latest from the database'
            });
        }
        return this.personalisation;
    }

    updateSystemConfiguration(systemConfiguration: SystemConfiguration) {
        // Updates SystemConfiguration, and also refresh (.next) global variables
        // - systemConfiguration New data
        this.globalFunctionService.printToConsole(this.constructor.name,'updateSystemConfiguration', '@Start');

        // Mark as dirty
        this.globalVariableService.dirtyDataSystemConfiguration.next(true) ;

        // Update Global Variables
        this.globalVariablesSystemConfiguration(systemConfiguration);

        // Store in DB
        this.cdal.saveSystemConfiguration(systemConfiguration);

        // Update local array
        this.systemConfiguration = systemConfiguration;

        // Mark as clean
        this.globalVariableService.dirtyDataSystemConfiguration.next(false) ;
    }

    globalVariablesSystemConfiguration(systemConfiguration: SystemConfiguration) {
        //  Refresh (.next) global variables
        // - systemConfiguration New data
        this.globalFunctionService.printToConsole(this.constructor.name,'globalVariablesSystemConfiguration', '@Start');

        // Update local values that have changed
        if (systemConfiguration.companyName != this.systemConfiguration.companyName) {
            this.globalVariableService.companyName.next(systemConfiguration.companyName);
        }
        if (systemConfiguration.companyLogo != this.systemConfiguration.companyLogo) {
            this.globalVariableService.companyLogo.next(systemConfiguration.companyLogo);
        }
        if (systemConfiguration.backendUrl != this.systemConfiguration.backendUrl) {
            this.globalVariableService.backendUrl.next(systemConfiguration.backendUrl);
        }
        if (systemConfiguration.defaultDaysToKeepResultSet != this.systemConfiguration.defaultDaysToKeepResultSet) {
            this.globalVariableService.defaultDaysToKeepResultSet.next(systemConfiguration.defaultDaysToKeepResultSet);
        }
        if (systemConfiguration.maxRowsDataReturned != this.systemConfiguration.maxRowsDataReturned) {
            this.globalVariableService.maxRowsDataReturned.next(systemConfiguration.maxRowsDataReturned);
        }
        if (systemConfiguration.maxRowsPerWidgetGraph != this.systemConfiguration.maxRowsPerWidgetGraph) {
            this.globalVariableService.maxRowsPerWidgetGraph.next(systemConfiguration.maxRowsPerWidgetGraph);
        }

    }

    updatePersonalisation(personalisation: Personalisation) {
        // Updates Personalisation, and also refresh (.next) global variables
        // - personalisation New data
        this.globalFunctionService.printToConsole(this.constructor.name,'updatePersonalisation', '@Start');

        // Mark as dirty
        this.globalVariableService.dirtyDataPersonalisation.next(true) ;

        // Refresh globals variables that may have changed
        this.globalVariablesPersonalisation(personalisation);

        // Store in DB
        this.cdal.savePersonalisation(personalisation);

        // Update local array
        this.personalisation = personalisation;

        // Mark as clean
        this.globalVariableService.dirtyDataPersonalisation.next(false) ;
    }

    globalVariablesPersonalisation(personalisation: Personalisation) {
        // Refresh (.next) global variables
        // - personalisation New data
        this.globalFunctionService.printToConsole(this.constructor.name,'globalVariablesPersonalisation', '@Start');

        // Update local values that have changed
        if (personalisation.averageWarningRuntime != this.personalisation.averageWarningRuntime) {
            this.globalVariableService.averageWarningRuntime.next(personalisation.averageWarningRuntime);
        }
        if (personalisation.dashboardIDStartup != this.personalisation.dashboardIDStartup) {
            this.globalVariableService.dashboardIDStartup.next(personalisation.dashboardIDStartup);
        }
        if (personalisation.environment != this.personalisation.environment) {
            this.globalVariableService.environment.next(personalisation.environment);
        }
        if (personalisation.frontendColorScheme != this.personalisation.frontendColorScheme) {
            this.globalVariableService.frontendColorScheme.next(personalisation.frontendColorScheme);
        }
        if (personalisation.defaultWidgetConfiguration != this.personalisation.defaultWidgetConfiguration) {
            this.globalVariableService.defaultWidgetConfiguration.next(personalisation.defaultWidgetConfiguration);
        }
        if (personalisation.defaultReportFilters != this.personalisation.defaultReportFilters) {
            this.globalVariableService.defaultReportFilters.next(personalisation.defaultReportFilters);
        }
        if (personalisation.growlSticky != this.personalisation.growlSticky) {
            this.globalVariableService.growlSticky.next(personalisation.growlSticky);
        }
        if (personalisation.growlLife != this.personalisation.growlLife) {
            this.globalVariableService.growlLife.next(personalisation.growlLife);
        }
        if (personalisation.gridSize != this.personalisation.gridSize) {
            this.globalVariableService.gridSize.next(personalisation.gridSize);
        }
        if (personalisation.snapToGrid != this.personalisation.snapToGrid) {
            this.globalVariableService.snapToGrid.next(personalisation.snapToGrid);
        }
    }

    logout(username: string) {
        // Logout user from backend
        this.globalFunctionService.printToConsole(this.constructor.name,'logout', '@Start');

        this.globalVariableService.canvasUser.next(new CanvasUser);
        this.globalVariableService.isAuthenticatedOnEazl.next(false);
        this.storage.removeItem('canvas-token');

        // Clear local data
        this.globalFunctionService.printToConsole(
            this.constructor.name,'login', '  refresh the Cache');
        this.cacheCanvasData('all', 'clear');

        // Inform the user
        this.globalVariableService.growlGlobalMessage.next({
            severity: 'info',
            summary:  'Logged out',
            detail:   'Logout successful for ' + username
        });

    }

    login(username: string, password: string): Promise<any> {
        // User logs into the backend
        // - username to log into Eazl
        // - password for Eazl

        this.globalFunctionService.printToConsole(this.constructor.name, 'login', '@Start');

    		return this.post<Token>(
                'auth-token',
                {username: username, password: password}
                )
            .toPromise()
            .then(authToken => {

		        this.storage.setItem('canvas-token', authToken.token);
                this.httpHeaders.set('Authorization', `token ${authToken.token}`);
                return this.get<EazlUser>(`${this.route}/authenticated-user/`)
                .toPromise()
                .then(
                    eazlUser => {

                        let nick_name: string = '';
                        let cell_number: string = '';
                        let work_number: string = '';
                        let profile_picture: string = '';

                        if (eazlUser.profile != null) {
                            nick_name = eazlUser.profile.nick_name;
                            cell_number = eazlUser.profile.cell_number;
                            work_number = eazlUser.profile.work_number;
                            profile_picture = eazlUser.profile.profile_picture;
                        }
                        this.globalVariableService.canvasUser.next({
                            pk: eazlUser.pk,
                            username: eazlUser.username,
                            first_name: eazlUser.first_name,
                            last_name: eazlUser.last_name,
                            email: eazlUser.email,
                            password: eazlUser.password,
                            is_superuser: eazlUser.is_superuser,
                            is_staff: eazlUser.is_staff,
                            is_active: eazlUser.is_active,
                            date_joined: eazlUser.date_joined,
                            last_login: eazlUser.last_login,
                            profile:
                                {
                                    nick_name:  nick_name,
                                    cell_number: cell_number,
                                    work_number: work_number,
                                    profile_picture: profile_picture
                                }
                        });
                        this.globalVariableService.isAuthenticatedOnEazl.next(true);

                        // Inform the user
                        this.globalVariableService.growlGlobalMessage.next({
                            severity: 'info',
                            summary:  'Succes',
                            detail:   'Login successful for ' + eazlUser.username
                        });

                        // Get the data locally
                        this.globalFunctionService.printToConsole(
                            this.constructor.name,'login', '  refresh the Cache');
                            this.cacheCanvasData('all', 'reset');
                        // this.cacheCanvasData('BackgroundImageDropdown', 'reset');

                        // Log into web socket service
                        this.reconnectingWebSocket.connect(authToken)

                        // Return the user object from the RESTi
                        return eazlUser;
                    }
                )
                .catch(this.loginError)
            })
		    .catch(this.loginError);
	}

    loginError(error: any): Promise<any> {
        // Error handling when login failed, & returns Promise with error
        this.globalFunctionService.printToConsole(this.constructor.name,'loginError', '@Start');

		this.storage.removeItem('canvas-token');
        this.globalVariableService.growlGlobalMessage.next({
            severity: 'warn',
            summary:  'Login Failed',
            detail:   '*Login unsuccessful'
        });
        this.globalVariableService.isAuthenticatedOnEazl.next(false);
        return Promise.reject(error.message || error);
    }

    changePassword(username: string, newPassword: string): string {
        // Change the password for a user
        // Return '' if good, else return error message
        this.globalFunctionService.printToConsole(this.constructor.name,'changePassword', '@Start');

        // TODO - this must be done in DB
        return '';
    }

    prepareRoute(route: string): string {
        if (route.slice(-1) !== '/') {
            route = `${route}/`;
        }

        if (route.slice(0) === '/') {
            route = route.slice(1);
        }
        return `${this.httpBaseUri}${route}`;
    }

    parseResponse(response: Response) {
        return response.json() || {};
    }

    handleError(response: Response | any): Observable<Response> {
        // Error for observable
        // TODO - figure out why this guy errors when there is an http-error
        // this.globalFunctionService.printToConsole(this.constructor.name,'handleError', '@Start');

        var error: string = '';
         // Do some logging one day
        if (response instanceof Response) {
            // TODO - this must be sorted IF return is html - since it errors (in the error)
            // var payload = response.json() || '';
            //  error = payload.body || JSON.stringify(payload);
            console.log('CDAL testing response', response);
            error = response.toString();
        } else {
            error = response.message ? response.message : response.toString();
        }
         return Observable.throw(error);
    }

    get<T>(route: string, data?: Object): Observable<any> {
        // Get from http
        this.globalFunctionService.printToConsole(this.constructor.name,'get-http', '@Start');

        return this.http.get(this.prepareRoute(route), this.httpOptions)
            .map(this.parseResponse)
            .catch(this.handleError);
    }

    post<T>(route: string, data: Object): Observable<any> {
        // Post to http
        this.globalFunctionService.printToConsole(this.constructor.name,'post-http', '@Start');

        return this.http.post(this.prepareRoute(route), JSON.stringify(data), this.httpOptions)
            .map(this.parseResponse)
            .catch(this.handleError);
    }

    addUser(user: User) {
        // Adds a new User to the DB
        this.globalFunctionService.printToConsole(this.constructor.name,'addUser', '@Start');

        // TODO - remove this hack once Users in separate DB
        let today = new Date();
        let workingUser: any = {
            username: user.username,
            first_name: user.firstName,
            last_name: user.lastName,
            email: user.emailAddress,
            password: 'canvas100*',
            is_superuser: false,        //ro
            is_staff: user.isStaff, //ro
            is_active: true,
            last_login: null,
            profile:
                {
                    nick_name: user.nickName,
                    cell_number: user.cellNumber,
                    work_number: user.workTelephoneNumber,
                    profile_picture: user.photoPath
                }
        }

        return this.post<EazlUser>('users',workingUser)
                .toPromise()
                .then( eazlUser => {
                    // Update local store
                    this.users.push(user);

                    // TODO - reGet the local => always in sync
                    // Not dirty any longer
                    this.globalVariableService.dirtyDataUser.next(false);

                    // Return the data
                    return this.users;
                } )
                .catch(error => {
                    this.globalVariableService.growlGlobalMessage.next({
                        severity: 'warn',
                        summary:  'AddUsers',
                        detail:   'Unsuccessful in adding user to the database'
                    });
                    error.message || error
                })
    }

    getUsers(): User[] {
        // Return a list of Users
        this.globalFunctionService.printToConsole(this.constructor.name,'getUsers', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataUser.getValue() == true) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'User data is dirty / not up to date',
                detail:   'The User data is being refreshed; request again to get the latest from the database'
            });
        }

        return this.users;
    }

    updateDashboardContainerHeader(
        dashboardID: number,
        isContainerHeaderDark: boolean){
        // Update isContainerHeaderDark for given dashboard
        // - dashboardID: ID of Dashboard to update
        // - isContainerHeaderDark: new value of isContainerHeaderDark field

        // Mark the data as dirty
        this.globalVariableService.dirtyDataDashboard.next(true);

        // TODO - update for real in DB
        for (var i = 0; i < this.dashboards.length; i++) {
            if (this.dashboards[i].dashboardID == dashboardID) {
                this.dashboards[i].isContainerHeaderDark = isContainerHeaderDark;
            }
        }

        // Mark the data as clean
        this.globalVariableService.dirtyDataDashboard.next(false);
    }

    updateDashboardshowContainerHeader(
        dashboardID: number,
        showContainerHeader: boolean){
        // Update showContainerHeader for given dashboard
        // - dashboardID: ID of Dashboard to update
        // - showContainerHeader: new value of showContainerHeader field

        // Mark the data as dirty
        this.globalVariableService.dirtyDataDashboard.next(true);

        // TODO - update for real in DB

        // TODO - update for real in DB
        for (var i = 0; i < this.dashboards.length; i++) {
            if (this.dashboards[i].dashboardID == dashboardID) {
                this.dashboards[i].showContainerHeader = showContainerHeader;
            }
        }

        // Mark the data as dirty
        this.globalVariableService.dirtyDataDashboard.next(false);
    }

    updateDashboardBackgroundColor(
        dashboardID: number,
        dashboardBackgroundColor: string){
        // Update dashboardBackgroundColor for given dashboard
        // - dashboardID: ID of Dashboard to update
        // - dashboardBackgroundColor: new value of dashboardBackgroundColor field

        // Mark the data as dirty
        this.globalVariableService.dirtyDataDashboard.next(true);

        // TODO - update for real in DB

        // TODO - update for real in DB
        for (var i = 0; i < this.dashboards.length; i++) {
            if (this.dashboards[i].dashboardID == dashboardID) {
                this.dashboards[i].dashboardBackgroundColor = dashboardBackgroundColor;
            }
        }

        // Mark the data as dirty
        this.globalVariableService.dirtyDataDashboard.next(false);
    }

    updateDashboardBackgroundImageSrc(
        dashboardID: number,
        dashboardBackgroundImageSrc: string){
        // Update dashboardBackgroundImageSrc for given dashboard
        // - dashboardID: ID of Dashboard to update
        // - dashboardBackgroundImageSrc: new value of dashboardBackgroundImageSrc fieldp

        // Mark the data as dirty
        this.globalVariableService.dirtyDataDashboard.next(true);

        // TODO - update for real in DB

        // TODO - update for real in DB
        for (var i = 0; i < this.dashboards.length; i++) {
            if (this.dashboards[i].dashboardID == dashboardID) {
                this.dashboards[i].dashboardBackgroundImageSrc = dashboardBackgroundImageSrc;
            }
        }

        // Mark the data as dirty
        this.globalVariableService.dirtyDataDashboard.next(false);
    }

    getDashboards(
        dashboardID: number = -1,
        relatedUsername: string = '*',
        relationshipType: string = ''): Dashboard[] {
        // Return a list of Dashboards, with optional filters
        // - dashboardID Optional parameter to select ONE, else select ALL (if >= 0)
        // - relatedUsername Optional username
        // - relationshipType Optional type, ie SharedWith
        this.globalFunctionService.printToConsole(this.constructor.name,'getDashboards', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataDashboard.getValue() == true) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'Dashboard data is dirty / not up to date',
                detail:   'The Dashboard data is being refreshed; request again to get the latest from the database'
            });
        }

        // TODO - when from DB, fill the properties.widgetComments field with the latest
        //        comment from the widgetComments table.  This is used in *ngIf

        // TODO - get a standard set of methods, ie getXXX returns all, findXXX returns one.
        //        OR, use TS standard with .filter, .find, etc .... ??
        // IF an ID was provided, only return that one.  Else, al

        // Start with all
        let dashboardsWorking: Dashboard[] = this.dashboards;

        // Filter on related ones, IF so requested
        if (relatedUsername != '*') {
            let dashboardIDs: number[] = [];
            for (var i = 0; i < this.dashboardUserRelationship.length; i++) {
                if (this.dashboardUserRelationship[i].userName == relatedUsername
                   &&
                   this.dashboardUserRelationship[i].dashboardUserRelationshipType ==
                        relationshipType) {
                        dashboardIDs.push(this.dashboardUserRelationship[i].dashboardID)
                }
            }
            dashboardsWorking = dashboardsWorking.filter( dw =>
                (dashboardIDs.indexOf(dw.dashboardID) >= 0))
        }

        // Get current user
        let currentUser: string = this.globalFunctionService.currentUser();

        // Add NrGroups calculated field
        dashboardsWorking.forEach( dw => {
            dw.dashboardNrGroups = 0;
            dw.dashboardNrGroups = this.dashboardGroupMembership.filter( dg => {
                if (dg.dashboardID == dw.dashboardID) {
                    return dg;
                }
            }).length;
        });

        // Add dashboardIsLiked calculated field
        dashboardsWorking.forEach( dw => {
            dw.dashboardIsLiked = false;
            if (this.dashboardUserRelationship.filter(dur =>
                (
                    dur.dashboardID == dw.dashboardID
                    &&
                    dur.userName == currentUser
                    &&
                    dur.dashboardUserRelationshipType == 'Likes'
                )
            ).length > 0) {
                dw.dashboardIsLiked = true;
            }
        });

        // Add TOTAL dashboardNrUsersSharedWith calculated field
        dashboardsWorking.forEach( dw => {
            dw.dashboardNrUsersSharedWith = 0;
            dw.dashboardNrUsersSharedWith = this.dashboardUserRelationship.filter(dur =>
                (
                    dur.dashboardID == dw.dashboardID
                    &&
                    dur.dashboardUserRelationshipType == 'SharedWith'
                )
            ).length
        });

        // Add TOTAL dashboardNrGroupsSharedWith calculated field
        dashboardsWorking.forEach( dw => {
            dw.dashboardNrGroupsSharedWith = 0;
            dw.dashboardNrGroupsSharedWith = this.dashboardGroupRelationship.filter(dgr =>
                (
                    dgr.dashboardID == dw.dashboardID
                    &&
                    dgr.dashboardGroupRelationshipType == 'SharedWith'
                )
            ).length;
        });

        // Return the filtered result
        return dashboardsWorking.filter(d =>
            (dashboardID == -1  ||  d.dashboardID == dashboardID));
    }

    getDashboardSelectionItems(
        dashboardID: number = -1,
        relatedUsername: string = '*',
        relationshipType: string = ''): SelectItem[] {
        // Return a list of Dashboards, with optional filters in SelectItem format
        // - dashboardID Optional parameter to select ONE, else select ALL (if >= 0)
        // - relatedUsername Optional username
        // - relationshipType Optional type, ie SharedWith
        this.globalFunctionService.printToConsole(this.constructor.name,'getDashboardSelectionItems', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataDashboard.getValue() == true) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'Dashboard data is dirty / not up to date',
                detail:   'The Dashboard data is being refreshed; request again to get the latest from the database'
            });
        }

        // Get a list of Dashboards
        let dashboardsWorking: Dashboard[] = this.getDashboards(
            dashboardID,
            relatedUsername,
            relationshipType
        );

        // Fill the dropdown format
        let dashboardsSelectItemsWorking: SelectItem[] = [];
        for (var i = 0; i < dashboardsWorking.length; i++) {
            dashboardsSelectItemsWorking.push({
                label: dashboardsWorking[i].dashboardName,
                value: {
                    id: dashboardsWorking[i].dashboardID,
                    name: dashboardsWorking[i].dashboardName
                }
            });
        }
        return dashboardsSelectItemsWorking;
    }

    getDashboardTabs(selectedDashboardID: number, selectedDashboardTabID?: number): DashboardTab[] {
        // Return a list of Dashboard Tabs for a given DashboardID,
        //   and Optionally if a DashboardTabID was given
        this.globalFunctionService.printToConsole(this.constructor.name,'getDashboardTabs', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataDashboardTab.getValue() == true) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'DashboardTab data is dirty / not up to date',
                detail:   'The DashboardTab data is being refreshed; request again to get the latest from the database'
            });
        }

        let workingDashboardTabs: DashboardTab[] = [];

        workingDashboardTabs = this.dashboardTabs.filter(
            tab => tab.dashboardID == selectedDashboardID
        );
        if (selectedDashboardTabID != undefined) {
            workingDashboardTabs = workingDashboardTabs.filter(
                tab => tab.dashboardTabID == selectedDashboardTabID
            );
        }
        return workingDashboardTabs;
    }

    getDashboardTabsSelectItems(selectedDashboardID: number): SelectItem[] {
        // Return a list of Dashboard Tabs for a given DashboardID as SelectItem Array
        // - selectedDashboardID = filter
        this.globalFunctionService.printToConsole(this.constructor.name,'getDashboardTabsSelectItem', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataDashboardTab.getValue() == true) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'DashboardTab data is dirty / not up to date',
                detail:   'The DashboardTab data is being refreshed; request again to get the latest from the database'
            });
        }

        let workingDashboardTabs: DashboardTab[] = [];
        let dashboardTabsDropDownWorking: SelectItem[] = [];

        // Get all the Tabs for the given Dashboard
        workingDashboardTabs = this.getDashboardTabs(selectedDashboardID);

        // Fill the dropdown format
        for (var i = 0; i < workingDashboardTabs.length; i++) {
            dashboardTabsDropDownWorking.push({
                label: workingDashboardTabs[i].dashboardTabName,
                value: {
                    id: workingDashboardTabs[i].dashboardTabID,
                    name: workingDashboardTabs[i].dashboardTabName
                }
            });
        }
        return dashboardTabsDropDownWorking;
    }

    updateDashboardTab(dashboardID: number,
        dashboardTabID: number,
        dashboardTabDescription: string
        ) {
        // Update the details (like description) for a Dashboard Tab)
        this.globalFunctionService.printToConsole(this.constructor.name,'updateDashboardTab', '@Start');

        // Mark the data as dirty
        this.globalVariableService.dirtyDataDashboardTab.next(true);

        // Get the Tab
        let workingDashboardTabs: DashboardTab[] = [];
        workingDashboardTabs = this.getDashboardTabs(dashboardID, dashboardTabID)

        // Update detail
        if (workingDashboardTabs.length > 0) {
            workingDashboardTabs[0].dashboardTabDescription = dashboardTabDescription;

            // Mark the data as clean
            this.globalVariableService.dirtyDataDashboardTab.next(false);

            return true;
        } else {
            return false;
        }
    }

    getWidgetLastWidgetID(): number {
        // Return the last (biggest) WidgetID
        this.globalFunctionService.printToConsole(this.constructor.name,'getWidgetsForDashboard', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataWidget.getValue() == true) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'Widget data is dirty / not up to date',
                detail:   'The Widget data is being refreshed; request again to get the latest from the database'
            });
        }

        // TODO - do via Eazl into DB
        let lastWidgetID = this.widgets[this.widgets.length - 1].properties.widgetID;

        // Return
        return lastWidgetID + 1;
    }

    getWidgetsForDashboard(selectedDashboardID: number, selectedDashboarTabName: string): Widget[] {
        // Return a list of Dashboards
        this.globalFunctionService.printToConsole(this.constructor.name,'getWidgetsForDashboard', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataWidget.getValue() == true) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'Widget data is dirty / not up to date',
                detail:   'The Widget data is being refreshed; request again to get the latest from the database'
            });
        }

        // Calc WIDGET certain fields, as it is easy to use in *ngIf or *ngFor
        // TODO - this is impure - do better
        let username: string = '';
        if (this.globalVariableService.canvasUser.getValue() != null) {
            username = this.globalVariableService.canvasUser.getValue().username;
        }

        for (var i = 0, len = this.widgets.length; i < len; i++) {

            // Set properties.widgetIsLiked if there are users who liked it
            for (var j = 0, len = this.widgets[i].properties.widgetLiked.length; j < len; j++) {

                if (this.widgets[i].properties.widgetLiked[j].widgetLikedUserName == username) {
                    this.widgets[i].properties.widgetIsLiked = true;
                } else {
                    this.widgets[i].properties.widgetIsLiked = false;
                }
            }
        }

        return this.widgets.filter(widget =>
            widget.properties.dashboardID == selectedDashboardID &&
            widget.properties.dashboardTabName == selectedDashboarTabName
        );

    }

    addWidgetsComments(
        inputWidgetCommentID: number,
        inputWidgetID: number,
        inputWidgetCommentThreadID: number,
        inputWidgetCommentCreatedDateTime: string,
        inputWidgetCommentCreatedUserName: string,
        inputWidgetCommentHeading: string,
        inputWidgetCommentBody: string
        ) {
        // Add a Widget Comment to the DB
        this.globalFunctionService.printToConsole(this.constructor.name,'addWidgetsComments', '@Start');

        this.widgetComments.push(
            {
                widgetCommentID: inputWidgetCommentID,
                widgetID: inputWidgetID,
                widgetCommentThreadID: inputWidgetCommentThreadID,
                widgetCommentCreatedDateTime: inputWidgetCommentCreatedDateTime,
                widgetCommentCreatedUserName: inputWidgetCommentCreatedUserName,
                widgetCommentHeading: inputWidgetCommentHeading,
                widgetCommentBody: inputWidgetCommentBody
            }
        )

        // Mark as dirty
        this.globalVariableService.dirtyDataWidgetComment.next(false);
    }

    getWidgetsComments(selectedWidgetID: number): WidgetComment[] {
        // Return a list of Widget Comments
        this.globalFunctionService.printToConsole(this.constructor.name,'getWidgetsComments', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataWidgetComment.getValue() == true) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'WidgetComment data is dirty / not up to date',
                detail:   'The WidgetComment data is being refreshed; request again to get the latest from the database'
            });
        }

        return this.widgetComments.filter(widgetComment =>
            widgetComment.widgetID == selectedWidgetID
        );
    }

    addWidget (widget: Widget) {
        // Add a new Widget
        this.globalFunctionService.printToConsole(this.constructor.name,'addWidget', '@Start');
        this.widgets.push(widget)

        // Mark the data as dirty
        this.globalVariableService.dirtyDataWidget.next(true);
    }

    getDefaultWidgetConfig (): Widget {
        // Set default config for a new Widget
        this.globalFunctionService.printToConsole(this.constructor.name,'getDefaultWidgetConfig', '@Start');

        let DefaultWidgetConfig: Widget = {
            container: {
                backgroundColor: this.globalVariableService.lastBackgroundColor.getValue().name,
                border: this.globalVariableService.lastBorder.getValue().name,
                boxShadow: this.globalVariableService.lastBoxShadow.getValue().name,
                color: this.globalVariableService.lastColor.getValue().name,
                fontSize: +this.globalVariableService.lastContainerFontSize.getValue().name,
                height: this.globalVariableService.lastWidgetHeight.getValue(),
                left: this.globalVariableService.lastWidgetLeft.getValue(),
                widgetTitle: 'Untitled',
                top: this.globalVariableService.lastWidgetTop.getValue(),
                width: this.globalVariableService.lastWidgetWidth.getValue(),
            },
            areas: {
                showWidgetText: false,
                showWidgetGraph: true,
                showWidgetTable: false,
                showWidgetImage: false,
            },
            textual: {
                textText: 'texie',
                textBackgroundColor: 'transparent',
                textBorder: 'none',
                textColor: 'darkgray',
                textFontSize: 1,
                textFontWeight: 'normal',
                textHeight: 16,
                textLeft: 0,
                textMargin: '0 5px 0 5px',
                textPadding:  '5px 0 5px',
                textPosition: 'absolute',
                textTextAlign: 'center',
                textTop: 25,
                textWidth: 0,
            },
            graph: {
                graphID: 0,
                graphLeft: 5,
                graphTop: 25,
                vegaParameters: {
                    vegaGraphHeight: 200,
                    vegaGraphWidth: 180,
                    vegaGraphPadding: 10,
                    vegaHasSignals: true,
                    vegaXcolumn: 'category',
                    vegaYcolumn: 'amount',
                    vegaFillColor: 'pink',
                    vegaHoverColor: 'lightgray'
                },
                spec: {
                }
            },
            table:{
                tableColor: 'white',
                tableCols: 1,
                tableHeight: 25,
                tableHideHeader: false,
                tableLeft: 5,
                tableRows: 1,
                tableTop: 300,
                tableWidth: 25,
            },
            image: {
                imageAlt: '',
                imageHeigt: 200,
                imageLeft: 5,
                imageSource: '', //  <img src="pic_mountain.jpg" alt="Mountain View" style="width:304px;height:228px;">
                imageTop: 300,
                imageWidth: 200,
            },
            properties: {
                widgetID: 1,
                dashboardID: 0,
                dashboardName: 'Collection of Bar charts',
                dashboardTabID: 0,
                dashboardTabName: '',
                widgetCode: '',
                widgetName: '',
                widgetAddRestRow: false,
                widgetCreatedDateTime: '',
                widgetCreatedUserName: '',
                widgetComments: '',
                widgetDefaultExportFileType: '',
                widgetDescription: 'This graph showing ...',
                widgetIndex: 0,
                widgetIsLocked: false,
                widgetHyperLinkTabNr: '',
                widgetHyperLinkWidgetID: '',
                widgetIsLiked: false,
                widgetLiked: [
                    {
                        widgetLikedUserName: ''
                    }
                ],
                widgetPassword: '',
                widgetRefreshedDateTime: '',
                widgetRefreshedUserName: '',
                widgetRefreshFrequency: 0,
                widgetRefreshMode: '',
                widgetReportID: 1,
                widgetReportName: '',
                widgetReportParameters: '',
                widgetShowLimitedRows: 0,
                widgetSize: '',
                widgetSystemMessage: '',
                widgetTypeID: 0,
                widgetType: '',
                widgetUpdatedDateTime: '',
                widgetUpdatedUserName: ''
            }
        }

        return DefaultWidgetConfig;
    }

    getReports(
        dashboardID: number = -1,
        username: string = '*',
        relationship: string = '*',
        dataSourceID: number = -1
        ): Report[] {
        // Return a list of Reports
        // - dashboardID Optional parameter to filter on
        // - username Optional filter on relationships for this username
        // - relationship Optiona filter of Type of relationship IF username: Likes, Rates, Owns
        this.globalFunctionService.printToConsole(this.constructor.name,'getReports', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataReport.getValue() == true) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'Report data is dirty / not up to date',
                detail:   'The Report data is being refreshed; request again to get the latest from the database'
            });
        }

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataReportUserRelationship.getValue() == true) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'ReportUserRelationship data is dirty / not up to date',
                detail:   'The ReportUserRelationship data is being refreshed; request again to get the latest from the database'
            });
        }

        // Get all of them
        let reportsWorking: Report[] = this.reports;

        if (dashboardID != -1) {

            // Get the ReportIDs from all the Widgets for the requested Dashboard
            let widgetReportIDs: number[] = [];
            for (var i = 0; i < this.widgets.length; i++) {
                if (this.widgets[i].properties.dashboardID == dashboardID) {
                        widgetReportIDs.push(this.widgets[i].properties.widgetReportID);
                    }
            }

            reportsWorking = reportsWorking.filter(rpt =>
             (widgetReportIDs.indexOf(rpt.reportID) >= 0) )
        }

        if (username != '*') {

            // Get the ReportIDs from all the Widgets for the requested Dashboard
            let userRelatedRptIDs: number[] = [];
            for (var i = 0; i < this.reportUserRelationship.length; i++) {
                if (this.reportUserRelationship[i].userName == username
                    && (relationship == '*'  ||
                        this.reportUserRelationship[i].reportUserRelationshipType ==
                            relationship)) {
                        userRelatedRptIDs.push(this.reportUserRelationship[i].reportID);
                }
            }

            reportsWorking = reportsWorking.filter(rpt =>
                (userRelatedRptIDs.indexOf(rpt.reportID) >= 0) )
        }

        if (dataSourceID != -1) {
            reportsWorking = reportsWorking.filter(rpt =>
                (rpt.dataSourceID == dataSourceID) )
        }
        // Return the (filtered) Reports
        return reportsWorking;
    }

    getReport(reportID: number): Report {
        // Return a single Report
        this.globalFunctionService.printToConsole(this.constructor.name,'getReport', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataReport.getValue() == true) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'Report data is dirty / not up to date',
                detail:   'The Report data is being refreshed; request again to get the latest from the database'
            });
        }

        for (var i = 0; i < this.reports.length; i++) {
            if (this.reports[i].reportID == reportID) {
                return this.reports[i];
            }
        }
    }

    getReportFields(reportID: number): string[] {
        // Return a list of Reports
        this.globalFunctionService.printToConsole(this.constructor.name,'getReportFields', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataReport.getValue() == true) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'Report data is dirty / not up to date',
                detail:   'The Report data is being refreshed; request again to get the latest from the database'
            });
        }

        for (var i = 0; i < this.reports.length; i++) {
            if (this.reports[i].reportID == reportID) {
                return this.reports[i].reportFields;
            }
        }
    }

    getReportFieldSelectedItems(reportID: number): SelectItem[] {
        // Return a list of Report Fields in SelectItem format
        this.globalFunctionService.printToConsole(this.constructor.name,'getReportFieldSelectedItems', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataReport.getValue() == true) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'Report data is dirty / not up to date',
                detail:   'The Report data is being refreshed; request again to get the latest from the database'
            });
        }

        let reportWorking: Report = this.getReport(reportID);

        // Fill the dropdown format
        let reportFieldsSelectItemsWorking: SelectItem[] = [];
        for (var i = 0; i < reportWorking.reportFields.length; i++) {
            reportFieldsSelectItemsWorking.push({
                label: reportWorking.reportFields[i],
                value: {
                    id: i,
                    name: reportWorking.reportFields[i]
                }
            });
        }

        // Return
        return reportFieldsSelectItemsWorking;
    }

    getReportData(reportID: number): string[] {
        // Return a list of Reports
        this.globalFunctionService.printToConsole(this.constructor.name,'getReportData', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataReport.getValue() == true) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'Report data is dirty / not up to date',
                detail:   'The Report data is being refreshed; request again to get the latest from the database'
            });
        }

        for (var i = 0; i < this.reports.length; i++) {
            if (this.reports[i].reportID == reportID) {
                return this.reports[i].reportData;
            }
        }
    }

    getReportWidgetSets(reportID: number): ReportWidgetSet[] {
        // Return a list of WidgetSets per Report
        this.globalFunctionService.printToConsole(this.constructor.name,'getReportWidgetSets', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataReportWidgetSet.getValue() == true) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'ReportWidgetSet data is dirty / not up to date',
                detail:   'The ReportWidgetSet data is being refreshed; request again to get the latest from the database'
            });
        }

        return this.reportWidgetSet.filter(wset => wset.reportID == reportID);
    }

    getReportHistory(
            username: string ='*',
            reportID: number = -1,
            datasourceID: number = -1): ReportHistory[] {
        // Return history of reports run, optionally filtered
        this.globalFunctionService.printToConsole(this.constructor.name,'getReportHistory', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataReportHistory.getValue() == true) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'ReportHistory data is dirty / not up to date',
                detail:   'The ReportHistory data is being refreshed; request again to get the latest from the database'
            });
        }

        return this.reportHistory.filter(rh =>
            (username == '*'        ||   rh.userName == username)
            &&
            (reportID == -1         ||   rh.reportID == reportID)
            &&
            (datasourceID == -1     ||   rh.datasourceID == datasourceID)
        )

    }

    getWidgetTemplates(widgetTemplateName: string): WidgetTemplate {
        // Return a list of WidgetSets per Report
        this.globalFunctionService.printToConsole(this.constructor.name,'getWidgetTemplates', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataWidgetTemplate.getValue() == true) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'WidgetTemplate data is dirty / not up to date',
                detail:   'The WidgetTemplate data is being refreshed; request again to get the latest from the database'
            });
        }

        // Get the relevant template
        let workingTemplate = this.widgetTemplates.filter(
            wt => wt.widgetTemplateName == widgetTemplateName
        )[0];

        // Replace the BASIC Template parameters.  Note: not all types have all parameters
        if (workingTemplate == undefined) {
            return undefined;
        }

        if (workingTemplate.vegaParameters.vegaGraphWidth) {
            workingTemplate.vegaSpec.width = workingTemplate.vegaParameters.vegaGraphWidth;
        }

        if (workingTemplate.vegaParameters.vegaGraphHeight) {
            workingTemplate.vegaSpec.height = workingTemplate.vegaParameters.vegaGraphHeight;
        }
        if (workingTemplate.vegaParameters.vegaGraphPadding) {
            workingTemplate.vegaSpec.padding = workingTemplate.vegaParameters.vegaGraphPadding;
        }

        // Bar Chart parameters
        if(widgetTemplateName == 'BarChart') {
            if (workingTemplate.vegaParameters.vegaXcolumn) {
                workingTemplate.vegaSpec.scales[0].domain.field =
                    workingTemplate.vegaParameters.vegaXcolumn;
            }
            if (workingTemplate.vegaParameters.vegaYcolumn) {
                workingTemplate.vegaSpec.scales[1].domain.field =
                    workingTemplate.vegaParameters.vegaYcolumn;
            }
            if (workingTemplate.vegaParameters.vegaXcolumn) {
                workingTemplate.vegaSpec.marks[0].encode.enter.x.field =
                    workingTemplate.vegaParameters.vegaXcolumn;
            }
            if (workingTemplate.vegaParameters.vegaYcolumn) {
                workingTemplate.vegaSpec.marks[0].encode.enter.y.field =
                    workingTemplate.vegaParameters.vegaYcolumn;
            }
            if (workingTemplate.vegaParameters.vegaXcolumn) {
                workingTemplate.vegaSpec.marks[1].encode.update.x.signal =
                    'tooltip.' + workingTemplate.vegaParameters.vegaXcolumn;
            }
            if (workingTemplate.vegaParameters.vegaYcolumn) {
                workingTemplate.vegaSpec.marks[1].encode.update.y.signal =
                    'tooltip.' + workingTemplate.vegaParameters.vegaYcolumn;
            }
            if (workingTemplate.vegaParameters.vegaFillColor) {
                workingTemplate.vegaSpec.marks[0].encode.update.fill.value =
                    workingTemplate.vegaParameters.vegaFillColor;
            }
            if (workingTemplate.vegaParameters.vegaFillColor) {
                workingTemplate.vegaSpec.marks[0].encode.hover.fill.value =
                    workingTemplate.vegaParameters.vegaHoverColor;
            }

           // later: ...  vegaHasSignals: boolean;   // True/False to include Signals section
        }

        // End of story
        return workingTemplate;
    }

    updateWidgetIsLiked(widgetID: number, username:string, isLikedNewState:boolean) {
        // Adds / Removes a user from the widget:
        // - widgetID
        // - username to add / remove
        // - isLikedNewState = new state, so true -> add user, else delete
        this.globalFunctionService.printToConsole(this.constructor.name,'updateWidgetIsLiked', '@Start');

        // Mark the data as dirty
        this.globalVariableService.dirtyDataWidget.next(true);

        let foundUser: boolean = false;

        // Add
        if (isLikedNewState) {
            for (var i = 0; i < this.widgets.length; i++) {
                if (this.widgets[i].properties.widgetID == widgetID) {
                    this.widgets[i].properties.widgetIsLiked = isLikedNewState;
                    for (var j = 0; j < this.widgets[i].properties.widgetLiked.length; j++) {
                        if (this.widgets[i].properties.widgetLiked[j].widgetLikedUserName ==
                            username) {
                                 foundUser = true;
                            }
                    }
                    if (!foundUser) {
                        this.widgets[i].properties.widgetLiked.push(
                            {
                                widgetLikedUserName: username
                            });
                    }
                }
            }
        } else  {
            for (var i = 0; i < this.widgets.length; i++) {
                if (this.widgets[i].properties.widgetID == widgetID) {
                    this.widgets[i].properties.widgetIsLiked == isLikedNewState;
                    for (var j = 0; j < this.widgets[i].properties.widgetLiked.length; j++) {
                        if (this.widgets[i].properties.widgetLiked[j].widgetLikedUserName ==
                            username) {
                                this.widgets[i].properties.widgetLiked.splice(j);
                            }
                    }
                }
            }
        }

        // Mark the data as clean
        this.globalVariableService.dirtyDataWidget.next(false);
    }

    getGroups(groupID: number = -1): Group[] {
        // Return a list of Groups
        // - groupID Optional parameter to select ONE, else select ALL (if >= 0)
        this.globalFunctionService.printToConsole(this.constructor.name,'getGroups', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataGroup.getValue() == true) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'Group data is dirty / not up to date',
                detail:   'The Group data is being refreshed; request again to get the latest from the database'
            });
        }

        // TODO - from DB
        if (groupID == -1) {
            return this.groups;
        }
        else {
            return this.groups.filter(
                grp => grp.groupID == groupID
            )
        }
    }

    addGroup(groupName: string, groupDescription: string) {
        // Add a new Group
        this.globalFunctionService.printToConsole(this.constructor.name,'addGroup', '@Start');

        let currentUser: string = this.globalFunctionService.currentUser();

        this.groups.push({
            groupID: 0,
            groupName: groupName,
            groupDescription: groupDescription,
            groupCreatedDateTime: this.canvasDate.now('standard'),
            groupCreatedUserName: currentUser,
            groupUpdatedDateTime:this.canvasDate.now('standard'),
            groupUpdatedUserName: currentUser
        })

        // Mark the data as dirty
        this.globalVariableService.dirtyDataGroup.next(true);
    }

    updateGroup(groupID: number, groupName: string, groupDescription: string) {
        // Update a given Group
        this.globalFunctionService.printToConsole(this.constructor.name,'updateGroup', '@Start');

        // Mark the data as dirty
        this.globalVariableService.dirtyDataGroup.next(true);

        let currentUser: string = this.globalFunctionService.currentUser();

        // Update data
        for (var i = 0; i < this.groups.length; i++) {
            if (this.groups[i].groupID == groupID) {
                this.groups[i].groupName = groupName;
                this.groups[i].groupDescription = groupDescription;
                this.groups[i].groupUpdatedDateTime = this.canvasDate.now('standard'),
                this.groups[i].groupUpdatedUserName = currentUser
            }
        };

        // Mark the data as dirty
        this.globalVariableService.dirtyDataGroup.next(false);
    }

    deleteGroup(groupID: number) {
        // Delete a given Group
        this.globalFunctionService.printToConsole(this.constructor.name,'deleteGroup', '@Start');

        // Mark the data as dirty
        this.globalVariableService.dirtyDataGroup.next(true);

        // Delete the data
        for (var i = 0; i < this.groups.length; i++) {
            if (this.groups[i].groupID == groupID) {
                this.groups.splice(i,1);
            }
        };

        // Mark the data as dirty
        this.globalVariableService.dirtyDataGroup.next(false);
    }

    getUsersWhoCanAccessDatasource(
            datasourceID: number,
            include: boolean = true): User[] {
        // Return list of Users who has access to a given DataSource
        // - username filter
        // - include: True = those who can access, False = CANNOT access
        this.globalFunctionService.printToConsole(this.constructor.name,'getUsersWhoCanAccessDatasource', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataDataSourceUserAccess.getValue() == true) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'DataSourceUserAccess data is dirty / not up to date',
                detail:   'DataSourceUserAccess User data is being refreshed; request again to get the latest from the database'
            });
        }

        // Get list of usernames with access
        // TODO - when from DB, add access type as I think this will be useful
        let usernames: string[] = [];
        this.dataSourceUserAccess.forEach(du => {
            if (du.datasourceID == datasourceID) {
                usernames.push(du.userName)
            };
        });

        return this.users.filter(
            u => (include   &&  usernames.indexOf(u.username) >= 0)
                  ||
                 (!include  &&  usernames.indexOf(u.username) < 0)
            );
    }

    getDatasourcesPerUser(username: string): DatasourcesPerUser[] {
        // Return list of DataSource for a given user (via Username & Groups)
        // - username filter
        this.globalFunctionService.printToConsole(this.constructor.name,'getDatasourcesPerUser', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataDatasourcesPerUser.getValue() == true) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'DatasourcesPerUser data is dirty / not up to date',
                detail:   'DatasourcesPerUser User data is being refreshed; request again to get the latest from the database'
            });
        }

        let datasourceWorking: DataSource[] = [];
        let datasourceName: string = '';

        // Get current user
        let currentUser: string = this.globalFunctionService.currentUser();

        // Filter on users
        let datasourcesPerUserWorking: DatasourcesPerUser[] = [];
        this.dataSourceUserAccess.forEach(du => {
            if (du.userName == username) {
                datasourceName = '';
                datasourceWorking = this.datasources.filter(d =>
                    d.datasourceID == du.datasourceID);
                if (datasourceWorking.length > 0) {
                    datasourceName = datasourceWorking[0].datasourceName;
                }
                datasourcesPerUserWorking.push( {
                    datasourceID: du.datasourceID,
                    userName: username,
                    datasourceName: datasourceName,
                    datasourcesPerUserAccessVia: 'User: ' + username,
                    datasourcesPerUserAccessType: du.dataSourceUserAccessType,
                    datasourcesPerUserCreatedDateTime: this.canvasDate.now('standard'),
                    datasourcesPerUserCreatedUserName: currentUser,
                    datasourcesPerUserUpdatedDateTime: this.canvasDate.now('standard'),
                    datasourcesPerUserUpdatedUserName: currentUser
                })
            }
        })

        // Get list of GroupIDs that the User belongs to
        let groupIDs: number[] = [];
        this.userGroupMembership.forEach((usrgrp) => {
            if (usrgrp.userName == username)
                groupIDs.push(usrgrp.groupID)
            }
        )

        // Add the DS that those groups have access to
        // TODO - eliminate duplicates (already in User above)
        let groupWorking: Group[] = [];
        this.groupDatasourceAccess.forEach(gd => {
            if (groupIDs.indexOf(gd.groupID) >= 0) {
                groupWorking = this.groups.filter(g =>
                    (g.groupID == gd.groupID)
                )
                datasourceName = '';
                datasourceWorking = this.datasources.filter(d =>
                    d.datasourceID == gd.datasourceID);
                if (datasourceWorking.length > 0) {
                    datasourceName = datasourceWorking[0].datasourceName;
                }

                // Get current user
                let currentUser: string = this.globalFunctionService.currentUser();

                // TODO - make the push once - this is not DRY
                datasourcesPerUserWorking.push({
                    datasourceID: gd.datasourceID,
                    userName: username,
                    datasourceName: datasourceName,
                    datasourcesPerUserAccessVia: 'Group: ' + groupWorking[0].groupName,
                    datasourcesPerUserAccessType: gd.groupDatasourceAccessAccessType,
                    datasourcesPerUserCreatedDateTime: this.canvasDate.now('standard'),
                    datasourcesPerUserCreatedUserName: currentUser,
                    datasourcesPerUserUpdatedDateTime: this.canvasDate.now('standard'),
                    datasourcesPerUserUpdatedUserName: currentUser
                })
            }
        })

        // Return the result
        return datasourcesPerUserWorking;
    }

    getDashboardsPerUser(username: string): DashboardsPerUser[] {
        // Return list of Dashboards for a given user (via Username & Groups)
        // - username filter
        this.globalFunctionService.printToConsole(this.constructor.name,'getDashboardsPerUser', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataDashboardUserRelationship.getValue() == true) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'DashboardUserRelationship data is dirty / not up to date',
                detail:   'The DashboardUserRelationship data is being refreshed; request again to get the latest from the database'
            });
        }

        let dashboardsWorking: Dashboard[] = [];
        let dashboardName: string = '';

        // Filter on users
        let dashboardsPerUserWorking: DashboardsPerUser[] = [];
        this.dashboardUserRelationship.forEach(du => {
            if (du.userName == username) {

                dashboardName = '';
                dashboardsWorking = this.dashboards.filter(d =>
                    d.dashboardID == du.dashboardID);
                if (dashboardsWorking.length > 0) {
                    dashboardName = dashboardsWorking[0].dashboardName;
                }
                dashboardsPerUserWorking.push( {
                    dashboardID: du.dashboardID,
                    dashboardName: dashboardName,
                    username: username,
                    dashboardsPerUserAccessVia: 'User ' + username,
                    dashboardsPerUserAccessType: du.dashboardUserRelationshipType
                })
            }
        })

        // Get list of GroupIDs that the User belongs to
        let groupIDs: number[] = [];
        this.userGroupMembership.forEach((usrgrp) => {
            if (usrgrp.userName == username)
                groupIDs.push(usrgrp.groupID)
            }
        )

        // Add the DS that those groups have access to
        // TODO - eliminate duplicates (already in User above)
        let groupWorking: Group[] = [];
        this.dashboardGroupRelationship.forEach(dg => {
            if (groupIDs.indexOf(dg.groupID) >= 0) {
                groupWorking = this.groups.filter(g =>
                    (g.groupID == dg.groupID)
                )
                dashboardName = '';
                dashboardsWorking = this.dashboards.filter(d =>
                    d.dashboardID == dg.dashboardID);
                if (dashboardsWorking.length > 0) {
                    dashboardName = dashboardsWorking[0].dashboardName;
                }
                dashboardsPerUserWorking.push( {
                    dashboardID: dg.dashboardID,
                    dashboardName: dashboardName,
                    username: username,
                    dashboardsPerUserAccessVia: 'Group ' + groupWorking[0].groupName,
                    dashboardsPerUserAccessType: dg.dashboardGroupRelationshipType
                })
            }
        })

        // Return the result
        return dashboardsPerUserWorking;
    }

    getDatasourcesPerGroup(groupID: number, include: boolean): DataSource[] {
        // Return list of DataSource for a given Group
        // - groupID filter
        // - include: True means that has access, False means has NO access
        this.globalFunctionService.printToConsole(this.constructor.name,'getDatasourcesPerGroup', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataGroupDatasourceAccess.getValue() == true) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'GroupDatasourceAccess data is dirty / not up to date',
                detail:   'The GroupDatasourceAccess data is being refreshed; request again to get the latest from the database'
            });
        }

        // TODO - from DB
        // Get Array of all Groups IDs
        let resultDS: number[] = [];

        this.groupDatasourceAccess.forEach(
            (gDS) => {
                        if (gDS.groupID == groupID)
                        resultDS.push(gDS.datasourceID)
                        }
        );

        // Return necesary Datasources, selectively depending on in/exclude
        return this.datasources.filter(
            ds => (include  &&  resultDS.indexOf(ds.datasourceID) >= 0)
                   ||
                  (!include && resultDS.indexOf(ds.datasourceID) < 0)
        )
    }

    getGroupsPerDatasource(datasourceID: number, include: boolean): Group[] {
        // Return list of Groups for a given DataSource
        // - datasourceID filter
        // - include: True means that has access, False means has NO access
        this.globalFunctionService.printToConsole(this.constructor.name,'getGroupsPerDatasource', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataGroupDatasourceAccess.getValue() == true) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'GroupDatasourceAccess data is dirty / not up to date',
                detail:   'The GroupDatasourceAccess data is being refreshed; request again to get the latest from the database'
            });
        }

        // TODO - from DB
        // Get Array of all Groups IDs
        let resultGroup: number[] = [];

        this.groupDatasourceAccess.forEach(
            (gDS) => {
                        if (gDS.datasourceID == datasourceID)
                        resultGroup.push(gDS.groupID)
                     }
        );

        // Return necesary Datasources, selectively depending on in/exclude
        return this.groups.filter(
            ds => (include  &&  resultGroup.indexOf(ds.groupID) >= 0)
                    ||
                  (!include && resultGroup.indexOf(ds.groupID) < 0)
        )
    }

    getDatasourceUserAccess(
            datasourceID: number = -1,
            username: string = '*',
            accessType: string = '*'): DataSourceUserAccess[] {
        // Return a list of Datasource-User and their access
        // - datasourceID Optional filter,
        // - username Optional filter
        // - accessType Optional filter ( Readonly, Update, Add, Delete, Full)
        this.globalFunctionService.printToConsole(this.constructor.name,'getDatasourceUserAccess', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataDataSourceUserAccess.getValue() == true) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'DatasourceUserAccess data is dirty / not up to date',
                detail:   'The DatasourceUserAccess data is being refreshed; request again to get the latest from the database'
            });
        }

        let dataSourceUserAccessWorking = this.dataSourceUserAccess;

        // Filter as needed
        if (datasourceID != -1) {
            dataSourceUserAccessWorking = dataSourceUserAccessWorking.filter( da =>
                da.datasourceID == datasourceID)
        };
        if (username != '*') {
            dataSourceUserAccessWorking = dataSourceUserAccessWorking.filter( da =>
                da.userName == username)
        };
        if (accessType != '*') {
            dataSourceUserAccessWorking = dataSourceUserAccessWorking.filter( da =>
                da.dataSourceUserAccessType == accessType)
        };

        // Return
        return dataSourceUserAccessWorking;
    }

    getDatasourceAccessedByUser(
            username: string,
            accessType: string = '*',
            include: boolean = true
        ): DataSource[] {
        // Return a list of Datasources accessed by a User
        // - username Optional filter
        // - accessType Optional filter ( Readonly, Update, Add, Delete, Full)
        // - include Optional filter: True = include, False = complement (NO access)
        this.globalFunctionService.printToConsole(this.constructor.name,'getDatasourceUserAccess', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataDataSourceUserAccess.getValue() == true) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'DatasourceUserAccess data is dirty / not up to date',
                detail:   'The DatasourceUserAccess data is being refreshed; request again to get the latest from the database'
            });
        }

        // Create list of Datasource IDs that are relevant
        let dataSourceIDs: number[] = [];

        // Filter as needed
        this.dataSourceUserAccess.forEach( da => {
                if ( (username == '*'    ||   da.userName == username)
                     &&
                     (accessType == '*'  ||  da.dataSourceUserAccessType == accessType)
                   ) {
                    dataSourceIDs.push(da.datasourceID)
                   }
        });

        // Return
        return this.datasources.filter(ds => {
            if (
                 (include   &&   dataSourceIDs.indexOf(ds.datasourceID) >= 0)
                 ||
                 (!include  &&   dataSourceIDs.indexOf(ds.datasourceID) < 0)
               ) {
                    return ds;
                 }
        });
    }

    getGroupDatasourceAccess(
        groupID: number = -1,
        datasourceID: number = -1
        ): GroupDatasourceAccess[] {
        // Return of list with group - datasource access
        // - groupID Optional filter, -1 = all
        // - datasourceID Optional filter,-1 = all
        this.globalFunctionService.printToConsole(this.constructor.name,'getGroupDatasourceAccess', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataGroupDatasourceAccess.getValue() == true) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'GroupDatasourceAccess data is dirty / not up to date',
                detail:   'The GroupDatasourceAccess data is being refreshed; request again to get the latest from the database'
            });
        }

        return this.groupDatasourceAccess.filter(gDS => (
            (groupID == -1  ||  gDS.groupID == groupID)
            &&
            (datasourceID == -1 || gDS.datasourceID == datasourceID)
        ));
    }

    addDatasourceUserAccess(datasourceID: number, username: string) {
        // Adds a Datasource - User record to the DB

        this.globalFunctionService.printToConsole(this.constructor.name,'addDatasourceUserAccess', '@Start');

        let found: boolean = false;
        for (var i = 0; i < this.dataSourceUserAccess.length; i++) {
            if (this.dataSourceUserAccess[i].datasourceID == datasourceID  &&
                this.dataSourceUserAccess[i].userName == username) {
                    found = true;
                    break;
                }
        }

        // Get current user
        let currentUser: string = this.globalFunctionService.currentUser();

        // Only add if not already there
        if (!found) {
            this.dataSourceUserAccess.push(
                {
                    datasourceID: datasourceID,
	                userName: username,
                    dataSourceUserAccessType: 'Readonly',
                    dataSourceUserAccessScope: 'All',
                datasourceUserAccessCreatedDateTime: this.canvasDate.now('standard'),
                datasourceUserAccessCreatedUserName: currentUser,
                datasourceUserAccessUpdatedDateTime: this.canvasDate.now('standard'),
                datasourceUserAccessUpdatedUserName: currentUser
                }
            )
        }

        // Mark the data as dirty
        this.globalVariableService.dirtyDataDataSourceUserAccess.next(true);
    }

    deleteDatasourceUserAccess(datasourceID: number, username: string) {
        // Deletes a Datasource - Group record from the DB
        this.globalFunctionService.printToConsole(this.constructor.name,'deleteDatasourceUserAccess', '@Start');

        this.dataSourceUserAccess = this.dataSourceUserAccess.filter(
            item => (!(item.datasourceID == datasourceID  &&  item.userName == username))
        );

        // Mark the data as dirty
        this.globalVariableService.dirtyDataDataSourceUserAccess.next(true);
    }

    getGroupsPerUser(username: string = '', include: boolean = true): Group[] {
        // Return a list of Groups to which a user belongs
        // - username Optional parameter to select ONE, else select ALL (if >= 0)
        // - include Optional parameter, true = include all for user, else group NOT for username
        this.globalFunctionService.printToConsole(this.constructor.name,'getGroupsPerUser', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataUserGroupMembership.getValue() == true) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'UserGroupMembership data is dirty / not up to date',
                detail:   'The UserGroupMembership data is being refreshed; request again to get the latest from the database'
            });
        }

        // TODO - from DB
        // Get Array of groups to in or ex clude
        let resultUsergroupMembership: number[] = [];

        // Return all if no username specified
        if (username == '') {
            return this.groups;
        }

        // Make an array of groupIDs to which this user belongs
        this.userGroupMembership.forEach(
            (usrgrp) => {
                            if (usrgrp.userName == username)
                            resultUsergroupMembership.push(usrgrp.groupID)
                        }
        )

        // Return necesary groups, selectively depending on in/exclude
        return this.groups.filter(
            grp => (include  &&  resultUsergroupMembership.indexOf(grp.groupID) >= 0)
                    ||
                    (!include && resultUsergroupMembership.indexOf(grp.groupID) < 0)
        )
    }

    getUsersPerGroup(groupID: number = -1, include: boolean = true): User[] {
        // Return a list of Users that belongs to a group
        // - groupID Optional parameter, -1 = include all
        // - include, True means to which belongs, False means complements (NOT)
        this.globalFunctionService.printToConsole(this.constructor.name,'getUsersPerGroup', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataUserGroupMembership.getValue() == true) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'UserGroupMembership data is dirty / not up to date',
                detail:   'The UserGroupMembership data is being refreshed; request again to get the latest from the database'
            });
        }

        // TODO - from DB
        // Get Array of users to in or ex clude
        let resultUsergroupMembership: string[] = [];

        // Return all if no username specified
        if (groupID == -1) {
            return this.users;
        }

        // Make an array of username that belongs to the Group
        this.userGroupMembership.forEach(
            (usrgrp) => {
                        if (usrgrp.groupID == groupID)
                        resultUsergroupMembership.push(usrgrp.userName)
                    }
        )

        // Return necesary groups, selectively depending on in/exclude

        return this.users.filter(
            u => (include  &&  resultUsergroupMembership.indexOf(u.username) >= 0)
                  ||
                 (!include &&  resultUsergroupMembership.indexOf(u.username) < 0)
        );
    }

    addUserGroupMembership(username: string, groupID: number) {
        // Adds a User - Group record to the User Group Membership

        this.globalFunctionService.printToConsole(this.constructor.name,'addUserGroupMembership', '@Start');

        let found: boolean = false;
        for (var i = 0; i < this.userGroupMembership.length; i++) {
            if (this.userGroupMembership[i].userName == username  &&
                this.userGroupMembership[i].groupID == groupID) {
                    found = true;
                    break;
                }
        }

        // Get current user
        let currentUser: string = this.globalFunctionService.currentUser();

        // Only add if not already there
        if (!found) {
            this.userGroupMembership.push(
                {
                    groupID: groupID,
                    userName: username,
                    userGroupMembershipCreatedDateTime: this.canvasDate.now('standard'),
                    userGroupMembershipCreatedUserName: currentUser,
                    userGroupMembershipUpdatedDateTime: this.canvasDate.now('standard'),
                    userGroupMembershipUpdatedUserName: currentUser
                }
            )
        }

        // Mark the data as dirty
        this.globalVariableService.dirtyDataUserGroupMembership.next(true);
    }

    deleteUserGroupMembership(username: string, groupID: number) {
        // Deletes a User - Group record to the User Group Membership
        this.globalFunctionService.printToConsole(this.constructor.name,'deleteUserGroupMembership', '@Start');

        this.userGroupMembership = this.userGroupMembership.filter(
            item => (!(item.userName == username  &&  item.groupID == groupID))
        );

        // Mark the data as dirty
        this.globalVariableService.dirtyDataUserGroupMembership.next(true);
    }

    addGroupDatasourceAccess(datasourceID: number, groupID: number) {
        // Adds a Datasource - Group record to the DB

        this.globalFunctionService.printToConsole(this.constructor.name,'addGroupDatasourceAccess', '@Start');

        let found: boolean = false;
        for (var i = 0; i < this.groupDatasourceAccess.length; i++) {
            if (this.groupDatasourceAccess[i].datasourceID == datasourceID  &&
                this.groupDatasourceAccess[i].groupID == groupID) {
                    found = true;
                    break;
                }
        }

        // Get current user
        let currentUser: string = this.globalFunctionService.currentUser();

        // Only add if not already there
        if (!found) {
            this.groupDatasourceAccess.push(
                {
                    groupID: groupID,
                    datasourceID: datasourceID,
                    groupDatasourceAccessAccessType: 'Read',
                    groupDatasourceAccessCreatedDateTime: this.canvasDate.now('standard'),
                    groupDatasourceAccessCreatedUserName: currentUser,
                    groupDatasourceAccessUpdatedDateTime: this.canvasDate.now('standard'),
                    groupDatasourceAccessUpdatedUserName: currentUser
                }
            )
        }

        // Mark the data as dirty
        this.globalVariableService.dirtyDataGroupDatasourceAccess.next(true);
    }

    deleteGroupDatasourceAccess(datasourceID: number, groupID: number) {
        // Deletes a Datasource - Group record from the DB
        this.globalFunctionService.printToConsole(this.constructor.name,'deleteGroupDatasourceAccess', '@Start');

        // Mark the data as dirty
        this.globalVariableService.dirtyDataGroupDatasourceAccess.next(true);

        this.groupDatasourceAccess = this.groupDatasourceAccess.filter(
            item => (!(item.datasourceID == datasourceID  &&  item.groupID == groupID))
        );

        // Mark the data as clean
        this.globalVariableService.dirtyDataGroupDatasourceAccess.next(false);
    }

    getDashboardGroupMembership(
            dashboardID:number = -1,
            include:boolean = true
        ): DashboardGroup[] {
        // Return a list of Dashboard - Group memberships
        // - dashboardID Optional parameter to select ONE (if >= 0), else select ALL (if = 0)
        // - include Optional parameter, true = include all for one, else
        //   group NOT for dashboardID
        this.globalFunctionService.printToConsole(this.constructor.name,'getDashboardGroupMembership', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataDashboardGroupMembership.getValue() == true) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'DashboardGroupMembership data is dirty / not up to date',
                detail:   'The DashboardGroupMembership data is being refreshed; request again to get the latest from the database'
            });
        }

        // TODO - from DB
        // Get Array of groups to in or ex clude
        let resultDashboardGroupMembership: number[] = [];

        // Return all if no dashboardID specified
        if (dashboardID == -1) {
            return this.dashboardGroups;
        }

        // Make an array of groupIDs to which this user belongs
        this.dashboardGroupMembership.forEach(
            (dashgrp) => {
                if (dashgrp.dashboardID == dashboardID)
                    resultDashboardGroupMembership.push(
                        dashgrp.dashboardGroupID
                )
            }
        );

        // Return necesary groups, selectively depending on in/exclude
        return this.dashboardGroups.filter(
            dashgrp => (
                    include  &&
                        resultDashboardGroupMembership.indexOf(
                            dashgrp.dashboardGroupID) >= 0
                    )
                    ||
                    (!include &&
                        resultDashboardGroupMembership.indexOf(
                            dashgrp.dashboardGroupID) < 0
                    )
        )
    }

    addDashboardGroupMembership(dashboardID: number, dashboardGroupID: number) {
        // Adds a Dashboard - Group record to the User Group Membership

        this.globalFunctionService.printToConsole(this.constructor.name,'addDashboardGroupMembership', '@Start');

        let found: boolean = false;
        for (var i = 0; i < this.dashboardGroupMembership.length; i++) {
            if (this.dashboardGroupMembership[i].dashboardID == dashboardID  &&
                this.dashboardGroupMembership[i].dashboardGroupID == dashboardGroupID) {
                    found = true;
                    break;
                }
        }

        // Get current Dashboard
        let currentUser: string = this.globalFunctionService.currentUser();

        // Only add if not already there
        if (!found) {
            this.dashboardGroupMembership.push(
                {

                    dashboardGroupID: dashboardGroupID,
                    dashboardID: dashboardID,
                    dashboardGroupMembershipCreatedDateTime: this.canvasDate.now('standard'),
                    dashboardGroupMembershipCreatedUserName: currentUser,
                    dashboardGroupMembershipUpdatedDateTime: this.canvasDate.now('standard'),
                    dashboardGroupMembershipUpdatedUserName: currentUser
                }
            )
        }

        // Mark the data as dirty
        this.globalVariableService.dirtyDataDashboardGroupMembership.next(true);
    }

    deleteDashboardGroupMembership(dashboardID: number, dashboardGroupID: number) {
        // Deletes a Dashboard - Group record to the Dashboard Group Membership
        this.globalFunctionService.printToConsole(this.constructor.name,'deleteDashboardGroupMembership', '@Start');

        // Mark the data as dirty
        this.globalVariableService.dirtyDataDashboardGroupMembership.next(true);

        this.dashboardGroupMembership = this.dashboardGroupMembership.filter(
            item => (!(item.dashboardID == dashboardID  &&
                       item.dashboardGroupID == dashboardGroupID))
        );

        // Mark the data as clean
        this.globalVariableService.dirtyDataDashboardGroupMembership.next(false);
    }

    getGroupsRelatedToDashboard(
            dashboardID: number,
            relationshipType: string,
            include: boolean = true,
            groupID: number = -1): Group[] {
        // Return Groups with a given relationship to any Dashboard
        // - dashboardID: string
        // - relationshipType: string
        // - include: True = related, False = complement (NOT related)
        // - groupID: Optional filter
        this.globalFunctionService.printToConsole(this.constructor.name, 'getGroupsRelatedToDashboard', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataDashboardGroupRelationship.getValue() == true) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'DashboardGroupRelationship data is dirty / not up to date',
                detail:   'The DashboardGroupRelationship data is being refreshed; request again to get the latest from the database'
            });
        }

        let groupIDs: number[] = [];
        this.dashboardGroupRelationship.forEach(gd => {
            if (gd.dashboardID == dashboardID
             &&
             gd.dashboardGroupRelationshipType == relationshipType
             &&
             (groupID == -1  ||  gd.groupID == groupID) ) {
                 groupIDs.push(gd.groupID)
             }
        })

        // Return necesary groups, selectively depending on in/exclude
        let resultGroups: User[];

        return this.groups.filter( g => {
            if ( (include   &&   groupIDs.indexOf(g.groupID) >= 0)
                 ||
                 (!include  &&   groupIDs.indexOf(g.groupID) < 0) ) {
                return g;
            }
        });
    }

    getUsersRelatedToDashboard(
            dashboardID: number,
            relationshipType: string,
            include: boolean = true,
            username: string = '*'
        ): User[] {
        // Return users with a given relationship to any Dashboard
        // - dashboardID for this Dashboard
        // - relationshipType for this Relationship
        // - include: True = include, False = give complement (NOT related)
        // - username Optional filter
        this.globalFunctionService.printToConsole(this.constructor.name, 'getUsersRelatedToDashboard', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataDashboardUserRelationship.getValue() == true) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'DataDashboardUserRelationship  data is dirty / not up to date',
                detail:   'The DataDashboardUserRelationship  data is being refreshed; request again to get the latest from the database'
            });
        }

        // Get Array of UserNames that are related to this Dashboard, or Not if include = false
        let userNames: string[] = [];
        this.dashboardUserRelationship.forEach(dur => {
            if (dur.dashboardID == dashboardID
                &&
                dur.dashboardUserRelationshipType == relationshipType
                &&
                (username == '*'  ||  dur.userName == username ) ) {
                    userNames.push(dur.userName);
            }
        });

        // Return necesary groups, selectively depending on in/exclude
        // Struggle Avoidance Technique: set as [] upfront, else .IndexOf undefined fails
        return this.users.filter(
            u => {
                    if ( (include  &&  userNames.indexOf(u.username) >= 0 )
                        ||
                        (!include  &&  userNames.indexOf(u.username) < 0) ) {
                        return u
                    }
            }
        );
    }

    addDashboardGroupRelationship(
        dashboardID: number,
        groupID: number,
        relationshipType: string) {
        // Removes user from a Dashboard Relationship
        this.globalFunctionService.printToConsole(this.constructor.name,'addDashboardGroupRelationship', '@Start');

        let currentUser: string = this.globalFunctionService.currentUser();

        let found: boolean = false;
        for (var i = 0; i < this.dashboardGroupRelationship.length; i++) {
            if (this.dashboardGroupRelationship[i].dashboardID == dashboardID
               &&
               this.dashboardGroupRelationship[i].groupID == groupID
               &&
               this.dashboardGroupRelationship[i].dashboardGroupRelationshipType ==
                relationshipType) {
                    found = true;
                    break;
                }
        }

        if (!found) {
            let currentUser: string = this.globalFunctionService.currentUser();

            this.dashboardGroupRelationship.push(
                {
                    dashboardGroupRelationshipID: 0,
                    dashboardID: dashboardID,
                    groupID: groupID,
                    dashboardGroupRelationshipType: relationshipType,
                    dashboardGroupRelationshipRating: 0,
                    dashboardGroupRelationshipCreatedDateTime:
                        this.canvasDate.now('standard'),
                    dashboardGroupRelationshipCreatedUserName: currentUser,
                    dashboardGroupRelationshipUpdatedDateTime:
                        this.canvasDate.now('standard'),
                    dashboardGroupRelationshipUpdatedUserName: currentUser
                });
        }

        // Mark the data as dirty
        this.globalVariableService.dirtyDataDashboardGroupRelationship.next(true);
    }

    deleteDashboardGroupRelationship(
        dashboardID: number,
        groupID: number,
        relationshipType: string) {
        // Removes Group from a Dashboard Relationship
        this.globalFunctionService.printToConsole(this.constructor.name,'deleteDashboardGroupRelationship', '@Start');

        // Mark the data as dirty
        this.globalVariableService.dirtyDataDashboardGroupRelationship.next(true);

        let currentUser: string = this.globalFunctionService.currentUser();

        for (var i = 0; i < this.dashboardGroupRelationship.length; i++) {
            if (this.dashboardGroupRelationship[i].dashboardID == dashboardID
               &&
               this.dashboardGroupRelationship[i].groupID == groupID
               &&
               this.dashboardGroupRelationship[i].dashboardGroupRelationshipType ==
                relationshipType) {
                this.dashboardGroupRelationship =
                    this.dashboardGroupRelationship.splice(i, 1);
                }
        }

        // Mark the data as clean
        this.globalVariableService.dirtyDataDashboardGroupRelationship.next(false);
    }

    addDashboardUserRelationship(
        dashboardID: number,
        username: string,
        relationshipType: string) {
        // Add user from a Dashboard Relationship
        this.globalFunctionService.printToConsole(this.constructor.name,'addDashboardUserRelationship', '@Start');

        let currentUser: string = this.globalFunctionService.currentUser();

        let found: boolean = false;
        for (var i = 0; i < this.dashboardUserRelationship.length; i++) {
            if (this.dashboardUserRelationship[i].dashboardID == dashboardID
               &&
               this.dashboardUserRelationship[i].userName == username
               &&
               this.dashboardUserRelationship[i].dashboardUserRelationshipType ==
                relationshipType) {
                    found = true;
                    break;
                }
        }

        if (!found) {
        let currentUser: string = this.globalFunctionService.currentUser();

            this.dashboardUserRelationship.push(
                {
                    dashboardUserRelationshipID: 0,
                    dashboardID: dashboardID,
                    userName: username,
                    dashboardUserRelationshipType: relationshipType,
                    dashboardUserRelationshipRating: 0,
                    dashboardUserRelationshipCreatedDateTime:
                        this.canvasDate.now('standard'),
                    dashboardUserRelationshipCreatedUserName: currentUser,
                    dashboardUserRelationshipUpdatedDateTime:
                        this.canvasDate.now('standard'),
                    dashboardUserRelationshipUpdatedUserName: currentUser
                });
        }

        // Mark the data as dirty
        this.globalVariableService.dirtyDataDashboardUserRelationship.next(true);
    }

    deleteDashboardUserRelationship(
        dashboardID: number,
        username: string,
        relationshipType: string) {
        // Removes user from a Dashboard Relationship
        this.globalFunctionService.printToConsole(this.constructor.name,'deleteDashboardUserRelationship', '@Start');

        // Mark the data as dirty
        this.globalVariableService.dirtyDataDashboardUserRelationship.next(true);

        let currentUser: string = this.globalFunctionService.currentUser();

        for (var i = 0; i < this.dashboardUserRelationship.length; i++) {
            if (this.dashboardUserRelationship[i].dashboardID == dashboardID
               &&
               this.dashboardUserRelationship[i].userName == username
               &&
               this.dashboardUserRelationship[i].dashboardUserRelationshipType ==
                relationshipType) {
                this.dashboardUserRelationship =
                    this.dashboardUserRelationship.splice(i, 1);
                }
        }

        // Mark the data as clean
        this.globalVariableService.dirtyDataDashboardUserRelationship.next(false);
    }

    getDataSources(dashboardID: number = -1): DataSource[] {
        // List of Data Sources
        // - dashboardID is optional Dashboard to filter on
        // Note: Dashboard <1-many> Widget <1-1> Report <1-1> DataSource
        // TODO - agree design to integrate with Overlay, and do in DB
        this.globalFunctionService.printToConsole(this.constructor.name,'getDataSources', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataDatasource.getValue() == true) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'Datasource data is dirty / not up to date',
                detail:   'The Datasource data is being refreshed; request again to get the latest from the database'
            });
        }

        // Return all if no filter
        if (dashboardID == -1) {
            return this.datasources;
        }

        // Get the ReportIDs from all the Widgets for the requested Dashboard
        let widgetReportIDs: number[] = [];
        for (var i = 0; i < this.widgets.length; i++) {
            if (this.widgets[i].properties.dashboardID == dashboardID) {
                    widgetReportIDs.push(this.widgets[i].properties.widgetReportID);
                }
        }

        // Return the DataSourceIDs from all the reports
        let reportIDs: number[] = [];
        for (var i = 0; i < this.reports.length; i++) {
            if (widgetReportIDs.indexOf(this.reports[i].reportID) >= 0) {
                    reportIDs.push(this.reports[i].dataSourceID);
                }
        }

        // Return those Datasources
        return this.datasources.filter(ds => (reportIDs.indexOf(ds.datasourceID) >= 0));
    }

    toggleDashboardIsLiked(dashboardID: number, username:string, isLikedNewState:boolean) {
        // Adds / Removes a user from the Dashboard:
        // - dashboardID
        // - username to add / remove
        // - isLikedNewState = new state, so true -> add user, else delete
        this.globalFunctionService.printToConsole(this.constructor.name,'toggleDashboardIsLiked', '@Start');

        for (var i = 0; i < this.dashboards.length; i++) {
            if (this.dashboards[i].dashboardID == dashboardID) {
                this.dashboards[i].dashboardIsLiked = isLikedNewState;
                if (isLikedNewState) {
                    this.addDashboardUserRelationship(
                        dashboardID,
                        username,
                        'Likes');
                } else {
                    this.deleteDashboardUserRelationship(
                        dashboardID,
                        username,
                        'Likes');
                }
            }
        }
    }

    getCanvasMessages(
        dashboardID: number = -1,
        reportID: number = -1,
        widgetID: number = -1
        ): CanvasMessage[] {
        // Returns CanvasMessages
        // - dashboardID Optional filter, -1 = all
        // - reportID Optional filter, -1 = all
        // - widgetID Optional filter, -1 = all
        this.globalFunctionService.printToConsole(this.constructor.name,'getCanvasMessages', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataCanvasMessage.getValue() == true) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'CanvasMessages data is dirty / not up to date',
                detail:   'The CanvasMessages data is being refreshed; request again to get the latest from the database'
            });
        }

        // Return the necessary
        let found: boolean = false;
        let myStatus: string = '';
        let username: string = '';
        if (this.globalVariableService.canvasUser.getValue() != null) {
            username = this.globalVariableService.canvasUser.getValue().username;
        }
        return this.canvasMessages.filter(cm => {
            if (
                (dashboardID == -1  || cm.canvasMessageDashboardID == dashboardID)
                &&
                (reportID == -1     || cm.canvasMessageReportID == reportID)
                &&
                (widgetID == -1     || cm.canvasMessageWidgetID == widgetID)
            ) {
                // Determine calced fields: messageSentToMe, messageMyStatus, etc
                for (var i = 0; i < this.canvasMessages.length; i++) {
                    found = false;
                    myStatus= '';

                    for (var j = 0; j < this.canvasMessages[i].canvasMessageRecipients.length; j++) {

                        if (this.canvasMessages[i].canvasMessageRecipients[j].canvasMessageRecipientUserName ==
                            username) {
                                found = true;
                                myStatus = this.canvasMessages[i].canvasMessageRecipients[j].
                                    canvasMessageRecipientStatus;
                            }
                    };

                    this.canvasMessages[i].canvasMessageMyStatus = myStatus
                    if (found) {
                        this.canvasMessages[i].canvasMessageSentToMe = true;
                    } else {
                        this.canvasMessages[i].canvasMessageSentToMe = false;
                    }

                }
                return cm;
            }
        })
    }

    canvasMessageToggleRead(messageID: number) {
        // Updates the status of the CanvasMessage for the current user
        // - messageID message to update
        this.globalFunctionService.printToConsole(this.constructor.name,'canvasMessageToggleRead', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataCanvasMessage.getValue() == true) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'CanvasMessages data is dirty / not up to date',
                detail:   'The CanvasMessages data is being refreshed; request again to get the latest from the database'
            });
        }

        // Return the necessary
        let username: string = '';
        if (this.globalVariableService.canvasUser.getValue() != null) {
            username = this.globalVariableService.canvasUser.getValue().username;
        }
        for (var i = 0; i < this.canvasMessages.length; i++) {
            if (this.canvasMessages[i].canvasMessageID == messageID) {
                for (var j = 0; j < this.canvasMessages[i].canvasMessageRecipients.length; j++) {
                    if (this.canvasMessages[i].canvasMessageRecipients[j].canvasMessageRecipientUserName ==
                            username) {
                                if (this.canvasMessages[i].canvasMessageRecipients[j].
                                    canvasMessageRecipientStatus == 'Read') {
                                        this.canvasMessages[i].canvasMessageRecipients[j].
                                            canvasMessageRecipientStatus = 'UnRead';
                                }
                                else {
                                    this.canvasMessages[i].canvasMessageRecipients[j].
                                        canvasMessageRecipientStatus = 'Read';
                                }
                    }
                }
            }
        }
    }

    getWidgetTypes(): WidgetType[] {
        // Return list of Grapy Types
        this.globalFunctionService.printToConsole(this.constructor.name,'getWidgetTypes', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataWidgetType.getValue() == true) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'WidgetType data is dirty / not up to date',
                detail:   'The WidgetType data is being refreshed; request again to get the latest from the database'
            });
        }

        return this.widgetTypes;
    }

    getGraphTypes(): GraphType[] {
        // Return list of Grapy Types
        this.globalFunctionService.printToConsole(this.constructor.name,'getGraphTypes', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataGraphType.getValue() == true) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'GraphType data is dirty / not up to date',
                detail:   'The GraphType data is being refreshed; request again to get the latest from the database'
            });
        }

        return this.graphTypes;
    }

    maxZindex(dashboardID: number): number {
        // Return the Max z-Index for a given dashboard
        // - dashboardID to filter on
        this.globalFunctionService.printToConsole(this.constructor.name,'getGraphTypes', '@Start');

        let maxZindex: number = 0;
        for (var i = 0; i < this.widgets.length; i++) {
            if (this.widgets[i].properties.dashboardID == dashboardID) {
                maxZindex = Math.max(maxZindex, this.widgets[i].properties.widgetIndex);
            }
        }
        return maxZindex;
    }

    getBorderDropdowns(): SelectItem[] {
        // Return list of dropdown options for Borders
        this.globalFunctionService.printToConsole(this.constructor.name,'getBorderDropdowns', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataBorderDropdown.getValue() == true) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'BorderDropdown data is dirty / not up to date',
                detail:   'The BorderDropdown data is being refreshed; request again to get the latest from the database'
            });
        }

        return this.borderDropdowns;
    }

    getBoxShadowDropdowns(): SelectItem[] {
        // Return list of dropdown options for Box Shadows
        this.globalFunctionService.printToConsole(this.constructor.name,'getBoxShadowDropdowns', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataBoxShadowDropdown.getValue() == true) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'BoxShadowDropdown data is dirty / not up to date',
                detail:   'The BoxShadowDropdown data is being refreshed; request again to get the latest from the database'
            });
        }

        return this.boxShadowDropdowns;
    }

    getFontSizeDropdowns(): SelectItem[] {
        // Return list of dropdown options for Font Size
        this.globalFunctionService.printToConsole(this.constructor.name,'getFontSizeDropdowns', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataFontSizeDropdown.getValue() == true) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'FontSizeDropdown data is dirty / not up to date',
                detail:   'The FontSizeDropdown data is being refreshed; request again to get the latest from the database'
            });
        }

        return this.fontSizeDropdowns;
    }

    getGridSizeDropdowns(): SelectItem[] {
        // Return list of dropdown options for Grid Sizes
        this.globalFunctionService.printToConsole(this.constructor.name,'getGridSizeDropdowns', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataGridSizeDropdown.getValue() == true) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'GridSizeDropdown data is dirty / not up to date',
                detail:   'The GridSizeDropdown data is being refreshed; request again to get the latest from the database'
            });
        }

        return this.gridSizeDropdowns;
    }

    getBackgroundImageDropdowns() {
        // Return list of dropdown options for Background Images
        this.globalFunctionService.printToConsole(this.constructor.name,'getBackgroundImageDropdowns', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataBackgroundImageDropdown.getValue() == true) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'BackgroundImageDropdown data is dirty / not up to date',
                detail:   'The BackgroundImageDropdown data is being refreshed; request again to get the latest from the database'
            });
        }

        return this.backgroundImageDropdowns;
    }

    getdashboardName(dashboardID: number): string {
        // Returns Name of a given dashboardID
        this.globalFunctionService.printToConsole(this.constructor.name,'getdashboardName', '@Start');

        let dashboardNameWorking: string = null;
        for (var i = 0; i < this.dashboards.length; i++) {
            if (this.dashboards[i].dashboardID == dashboardID) {
                dashboardNameWorking = this.dashboards[i].dashboardName;
            }
        }

        // Return
        return dashboardNameWorking;
    }

    getIsStaffDropdowns(): SelectItem[] {
        // Returns list of IsStaff dropdown options
        this.globalFunctionService.printToConsole(this.constructor.name,'getIsStaffDropdowns', '@Start');

        return this.isStaffDropdown;
    }

    getIsSuperuserDropdown(): SelectItem[] {
        // Returns list of IsSuperuser dropdown options
        this.globalFunctionService.printToConsole(this.constructor.name,'getIsSuperuserDropdown', '@Start');

        return this.isSuperuserDropdown;
    }

    getFontWeightDropdown(): SelectItem[] {
        // Returns list of IsSuperuser dropdown options
        this.globalFunctionService.printToConsole(this.constructor.name,'getFontWeightDropdown', '@Start');

        return this.fontWeightDropdown;
    }

    getTextMarginDropdowns(): SelectItem[] {
        // Returns list of Text Margin dropdown options
        this.globalFunctionService.printToConsole(this.constructor.name,'getTextMarginDropdowns', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataTextMarginDropdown.getValue() == true) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'TextMarginDropdown data is dirty / not up to date',
                detail:   'The TextMarginDropdown data is being refreshed; request again to get the latest from the database'
            });
        }
                return this.textMarginDropdowns;
    }

    getTextPaddingDropdowns(): SelectItem[] {
        // Returns list of Text Padding dropdown options
        this.globalFunctionService.printToConsole(this.constructor.name,'getTextPaddingDropdowns', '@Start');

        return this.textPaddingDropdowns;
    }

    getTextPositionDropdowns(): SelectItem[] {
        // Returns list of Text Position dropdown options
        this.globalFunctionService.printToConsole(this.constructor.name,'getTextPositionDropdowns', '@Start');

        return this.textPositionDropdowns;
    }

    getTextAlignDropdowns(): SelectItem[] {
        // Returns list of Text Alignment dropdown options
        this.globalFunctionService.printToConsole(this.constructor.name,'getTextAlignDropdowns', '@Start');

        return this.textAlignDropdowns;
    }

    getImageSourceDropdowns(): SelectItem[] {
        // Returns list of Image Source file dropdown options
        this.globalFunctionService.printToConsole(this.constructor.name,'getImageSourceDropdowns', '@Start');

        return this.imageSourceDropdowns;
    }

    cacheCanvasData(
            resetObject: string = 'all',
            resetAction: string = 'reset',
            resetID: number = -1
        ) {
        // Make a local cache of Canvas Data
        // - resetObject: all to reset all, else type like users
        // - resetAction: reset, add, delete, update
        // - resetID: id of single object if not all
        this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '@Start');

        // User
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'User') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset User');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataUser.next(true);

                // Get all the data via API
                let usersWorking: User[] = [];
                let nickNameWorking: string;
                let cellNumberWorking: string;
                let workTelephoneNumberWorking: string;
                let photoPathWorking: string;
                this.get<EazlUser>(`${this.route}`)
                    .subscribe(
                        (eazlUser) => {

                            // Loop on Array returned, convert to Canvas format into local Array
                            for (var i = 0; i < eazlUser.length; i++) {
                                let userSingle = new User;
                                userSingle = this.cdal.loadUser(eazlUser[i]);
                                usersWorking.push(userSingle);

                            }

                        // Replace
                        this.users = usersWorking;

                        // Mark the data as clean
                        this.globalVariableService.dirtyDataUser.next(false);
                        }
                    )
            }

            // Clear all
            if (resetAction.toLowerCase() == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear User');
                this.users = [];

                // Mark the data as dirty
                this.globalVariableService.dirtyDataUser.next(true);
            }

        }

        // Group
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'Group') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset Group');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataGroup.next(true);

                // Get all the data via API
                let groupsWorking: Group[] = [];
                this.get<EazlGroup>('groups')
                    .subscribe(
                        (eazlGroup) => {
                            for (var i = 0; i < eazlGroup.length; i++) {
                                let groupSingle = new Group();
                                groupSingle = this.cdal.loadGroup(eazlGroup[i]);
                                groupsWorking.push(groupSingle);
                            }

                        // Replace
                        this.groups = groupsWorking;

                        // Mark the data as clean
                        this.globalVariableService.dirtyDataGroup.next(false);
                        }
                    )
            }

            // Clear all
            if (resetAction == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear Group');
                this.groups = [];

                // Mark the data as dirty
                this.globalVariableService.dirtyDataGroup.next(true);
            }
        }

        // DashboardTab
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'DashboardTab') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset DashboardTab');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataDashboardTab.next(true);

                // Get all the data via API
                let dashboardTabWorking: DashboardTab[] = [];
                this.get<EazlDashboardTab>('dashboard-tabs')
                    .subscribe(
                        (eazlDasboardTab) => {
                            for (var i = 0; i < eazlDasboardTab.length; i++) {
                                let dashboardTabSingle = new DashboardTab();
                                dashboardTabSingle = this.cdal.loadDashboardTab(eazlDasboardTab[i]);
                                dashboardTabWorking.push(dashboardTabSingle);

                            }

                        // Replace
                        // TODO - replace local Array after Bradley's done initial upload
                        //  this.dashboardTabs = groupsWorking;

                // Mark the data as clean
                this.globalVariableService.dirtyDataDashboardTab.next(false);
                        }
                )
            }

            // Clear all
            if (resetAction.toLowerCase() == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear DashboardTab');
                this.dashboardTabs = [];

                // Mark the data as dirty
                this.globalVariableService.dirtyDataDashboardTab.next(true);
            }
        }

        // CanvasMessage
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'CanvasMessage') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset CanvasMessage');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataCanvasMessage.next(true);

                // Get all the data via API
                let canvasMessageWorking: CanvasMessage[] = [];
                this.get<EazlCanvasMessage>('canvas-messages')
                    .subscribe(
                        (eazlCanvasMessage) => {
                            for (var i = 0; i < eazlCanvasMessage.length; i++) {
                                let canvasMessageSingle = new CanvasMessage();
                                canvasMessageSingle = this.cdal.loadCanvasMessage(eazlCanvasMessage[i]);
                                canvasMessageWorking.push(canvasMessageSingle);

                            }

                        // Replace
                        // TODO - replace local Array after Bradley's done initial upload
                        //  this.canvasMessages = canvasMessageWorking;

                        // Mark the data as clean
                        this.globalVariableService.dirtyDataCanvasMessage.next(false);
                        }
                )
            }

            // Clear all
            if (resetAction.toLowerCase() == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear CanvasMessage');
                this.canvasMessages = [];

                // Mark the data as dirty
                this.globalVariableService.dirtyDataCanvasMessage.next(true);
            }
        }

        // CanvasMessageRecipient
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'CanvasMessageRecipient') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset CanvasMessageRecipient');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataCanvasMessageRecipient.next(true);

                // Get all the data via API
                let canvasMessageRecipientWorking: CanvasMessageRecipient[] = [];
                this.get<EazlCanvasMessageRecipient>('canvas-message-recipients')
                    .subscribe(
                        (eazlCanvasMessageRecipient) => {
                            for (var i = 0; i < eazlCanvasMessageRecipient.length; i++) {
                                let canvasMessageRecipientSingle = new CanvasMessageRecipient();
                                canvasMessageRecipientSingle = this.cdal.loadCanvasMessageRecipient(eazlCanvasMessageRecipient[i]);
                                canvasMessageRecipientWorking.push(canvasMessageRecipientSingle);

                            }

                        // Replace
                        // TODO - replace local Array after Bradley's done initial upload
                        //  this.canvasMessageRecipients = canvasMessageRecipientWorking;

                        // Mark the data as clean
                        this.globalVariableService.dirtyDataCanvasMessageRecipient.next(false);
                        }
                )
            }

            // Clear all
            if (resetAction.toLowerCase() == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear CanvasMessageRecipient');
                this.canvasMessageRecipients = [];

                // Mark the data as dirty
                this.globalVariableService.dirtyDataCanvasMessageRecipient.next(true);
            }
        }

        // DashboardGroup
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'DashboardGroup') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset DashboardGroup');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataDashboardGroup.next(true);

                // Get all the data via API
                let DashboardGroupWorking: DashboardGroup[] = [];
                this.get<EazlDashboardGroup>('dashboard-groups')
                    .subscribe(
                        (eazlDashboardGroup) => {
                            for (var i = 0; i < eazlDashboardGroup.length; i++) {
                                let DashboardGroupSingle = new DashboardGroup();
                                DashboardGroupSingle = this.cdal.loadDashboardGroup(eazlDashboardGroup[i]);
                                DashboardGroupWorking.push(DashboardGroupSingle);

                            }

                        // Replace
                        // TODO - replace local Array after Bradley's done initial upload
                        //  this.dashboardGroups = dashboardGroupWorking;

                        // Mark the data as clean
                        this.globalVariableService.dirtyDataDashboardGroup.next(false);
                        }
                )
            }

            // Clear all
            if (resetAction.toLowerCase() == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear DashboardGroup');
                this.dashboardGroups = [];

                // Mark the data as dirty
                this.globalVariableService.dirtyDataDashboardGroup.next(true);
            }
        }

        // DashboardGroupMembership
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'DashboardGroupMembership') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset DashboardGroupMembership');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataDashboardGroupMembership.next(true);

                // Get all the data via API
                let DashboardGroupMembershipWorking: DashboardGroupMembership[] = [];
                this.get<EazlDashboardGroupMembership>('dashboard-group-membership')
                    .subscribe(
                        (eazlDashboardGroupMembership) => {
                            for (var i = 0; i < eazlDashboardGroupMembership.length; i++) {
                                let DashboardGroupMembershipSingle = new DashboardGroupMembership();
                                DashboardGroupMembershipSingle = this.cdal.loadDashboardGroupMembership(eazlDashboardGroupMembership[i]);
                                DashboardGroupMembershipWorking.push(DashboardGroupMembershipSingle);

                            }

                        // Replace
                        // TODO - replace local Array after Bradley's done initial upload
                        //  this.dashboardGroupMembership = dashboardGroupMembershipWorking;

                        // Mark the data as clean
                        this.globalVariableService.dirtyDataDashboardGroupMembership.next(false);
                        }
                )
            }

            // Clear all
            if (resetAction.toLowerCase() == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear DashboardGroupMembership');
                this.dashboardGroupMembership = [];

                // Mark the data as dirty
                this.globalVariableService.dirtyDataDashboardGroupMembership.next(true);
            }
        }

        // DashboardGroupRelationship
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'DashboardGroupRelationship') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset DashboardGroupRelationship');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataDashboardGroupRelationship.next(true);

                // Get all the data via API
                let DashboardGroupRelationshipWorking: DashboardGroupRelationship[] = [];
                this.get<EazlDashboardGroupRelationship>('dashboard-group-relationship')
                    .subscribe(
                        (eazlDashboardGroupRelationship) => {
                            for (var i = 0; i < eazlDashboardGroupRelationship.length; i++) {
                                let DashboardGroupRelationshipSingle = new DashboardGroupRelationship();
                                DashboardGroupRelationshipSingle = this.cdal.loadDashboardGroupRelationship(eazlDashboardGroupRelationship[i]);
                                DashboardGroupRelationshipWorking.push(DashboardGroupRelationshipSingle);

                            }

                        // Replace
                        // TODO - replace local Array after Bradley's done initial upload
                        //  this.dashboardGroupRelationship = dashboardGroupRelationshipWorking;

                        // Mark the data as clean
                        this.globalVariableService.dirtyDataDashboardGroupRelationship.next(false);
                        }
                )
            }

            // Clear all
            if (resetAction.toLowerCase() == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear DashboardGroupRelationship');
                this.dashboardGroupRelationship = [];

                // Mark the data as dirty
                this.globalVariableService.dirtyDataDashboardGroupRelationship.next(true);
            }
        }

        // Dashboard
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'Dashboard') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset Dashboard');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataDashboard.next(true);

                // Get all the data via API
                let dashboardWorking: Dashboard[] = [];

                this.get<EazlDashboard>('dashboards')
                    .subscribe(
                        (eazlDashboard) => {
                            for (var i = 0; i < eazlDashboard.length; i++) {
                                let dashboardSingle = new Dashboard();
                                dashboardSingle = this.cdal.loadDashboard(eazlDashboard[i]);
                                dashboardWorking.push(dashboardSingle);

                            }
console.log('CDAL testing dashboardWorking', dashboardWorking)
                        // Replace
                        // TODO - replace local Array after Bradley's done initial upload
                        //  this.dashboards = dashboardWorking;

                        // Mark the data as clean
                        this.globalVariableService.dirtyDataDashboard.next(false);
                        }
                )
            }

            // Clear all
            if (resetAction.toLowerCase() == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear Dashboard');
                this.dashboards = [];

                // Mark the data as dirty
                this.globalVariableService.dirtyDataDashboard.next(true);
            }
        }

        // DashboardsPerUser
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'DashboardsPerUser') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset DashboardsPerUser');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataDashboardsPerUser.next(true);

                // Get all the data via API
                let DashboardsPerUserWorking: DashboardsPerUser[] = [];
                this.get<EazlDashboardsPerUser>('dashboards-per-user')
                    .subscribe(
                        (eazlDashboardsPerUser) => {
                            for (var i = 0; i < eazlDashboardsPerUser.length; i++) {
                                let DashboardsPerUserSingle = new DashboardsPerUser();
                                DashboardsPerUserSingle = this.cdal.loadDashboardsPerUser(eazlDashboardsPerUser[i]);
                                DashboardsPerUserWorking.push(DashboardsPerUserSingle);

                            }

                        // Replace
                        // TODO - replace local Array after Bradley's done initial upload
                        //  this.dashboardsPerUser = dashboardsPerUserWorking;

                        // Mark the data as clean
                        this.globalVariableService.dirtyDataDashboardsPerUser.next(false);
                        }
                )
            }

            // Clear all
            if (resetAction.toLowerCase() == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear DashboardsPerUser');
                this.dashboardsPerUser = [];

                // Mark the data as dirty
                this.globalVariableService.dirtyDataDashboardsPerUser.next(true);
            }
        }

        // DashboardUserRelationship
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'DashboardUserRelationship') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset DashboardUserRelationship');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataDashboardUserRelationship.next(true);

                // Get all the data via API
                let DashboardUserRelationshipWorking: DashboardUserRelationship[] = [];
                this.get<EazlDashboardUserRelationship>('dashboard-user-relationships')
                    .subscribe(
                        (eazlDashboardUserRelationship) => {
                            for (var i = 0; i < eazlDashboardUserRelationship.length; i++) {
                                let DashboardUserRelationshipSingle = new DashboardUserRelationship();
                                DashboardUserRelationshipSingle = this.cdal.loadDashboardUserRelationship(eazlDashboardUserRelationship[i]);
                                DashboardUserRelationshipWorking.push(DashboardUserRelationshipSingle);

                            }

                        // Replace
                        // TODO - replace local Array after Bradley's done initial upload
                        //  this.dashboardUserRelationship = dashboardUserRelationshipWorking;

                        // Mark the data as clean
                        this.globalVariableService.dirtyDataDashboardUserRelationship.next(false);
                        }
                )
            }

            // Clear all
            if (resetAction.toLowerCase() == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear DashboardUserRelationship');
                this.dashboardUserRelationship = [];

                // Mark the data as dirty
                this.globalVariableService.dirtyDataDashboardUserRelationship.next(true);
            }
        }

        // DatasourcesPerUser
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'DatasourcesPerUser') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset DatasourcesPerUser');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataDatasourcesPerUser.next(true);

                // Get all the data via API
                let DatasourcesPerUserWorking: DatasourcesPerUser[] = [];
                this.get<EazlDatasourcesPerUser>('datasources-per-user')
                    .subscribe(
                        (eazlDatasourcesPerUser) => {
                            for (var i = 0; i < eazlDatasourcesPerUser.length; i++) {
                                let DatasourcesPerUserSingle = new DatasourcesPerUser();
                                DatasourcesPerUserSingle = this.cdal.loadDatasourcesPerUser(eazlDatasourcesPerUser[i]);
                                DatasourcesPerUserWorking.push(DatasourcesPerUserSingle);

                            }

                        // Replace
                        // TODO - replace local Array after Bradley's done initial upload
                        //  this.datasourcesPerUser = datasourcesPerUserWorking;

                        // Mark the data as clean
                        this.globalVariableService.dirtyDataDatasourcesPerUser.next(false);
                        }
                )
            }

            // Clear all
            if (resetAction.toLowerCase() == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear DatasourcesPerUser');
                this.datasourcesPerUser = [];

                // Mark the data as dirty
                this.globalVariableService.dirtyDataDatasourcesPerUser.next(true);
            }
        }

        // DataSourceUserAccess
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'DataSourceUserAccess') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset DataSourceUserAccess');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataDataSourceUserAccess.next(true);

                // Get all the data via API
                let DataSourceUserAccessWorking: DataSourceUserAccess[] = [];
                this.get<EazlDataSourceUserAccess>('datasource-user-accesss')
                    .subscribe(
                        (eazlDataSourceUserAccess) => {
                            for (var i = 0; i < eazlDataSourceUserAccess.length; i++) {
                                let DataSourceUserAccessSingle = new DataSourceUserAccess();
                                DataSourceUserAccessSingle =
                                    this.cdal.loadDataSourceUserAccess(eazlDataSourceUserAccess[i]);
                                DataSourceUserAccessWorking.push(DataSourceUserAccessSingle);

                            }

                        // Replace
                        // TODO - replace local Array after Bradley's done initial upload
                        //  this.dataSourceUserAccess = dataSourceUserAccessWorking;

                        // Mark the data as clean
                        this.globalVariableService.dirtyDataDataSourceUserAccess.next(false);
                        }
                )
            }

            // Clear all
            if (resetAction.toLowerCase() == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear DataSourceUserAccess');
                this.dataSourceUserAccess = [];

                // Mark the data as dirty
                this.globalVariableService.dirtyDataDataSourceUserAccess.next(true);
            }
        }

        // Filter
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'Filter') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset Filter');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataFilter.next(true);

                // Get all the data via API
                let FilterWorking: Filter[] = [];
                this.get<EazlFilter>('filters')
                    .subscribe(
                        (eazlFilter) => {
                            for (var i = 0; i < eazlFilter.length; i++) {
                                let FilterSingle = new Filter();
                                FilterSingle = this.cdal.loadFilter(eazlFilter[i]);
                                FilterWorking.push(FilterSingle);

                            }

                        // Replace
                        // TODO - replace local Array after Bradley's done initial upload
                        //  this.filters = filterWorking;

                        // Mark the data as clean
                        this.globalVariableService.dirtyDataFilter.next(false);
                        }
                )
            }

            // Clear all
            if (resetAction.toLowerCase() == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear Filter');
                this.filters = [];

                // Mark the data as dirty
                this.globalVariableService.dirtyDataFilter.next(true);
            }
        }

        // GroupDatasourceAccess
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'GroupDatasourceAccess') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset GroupDatasourceAccess');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataGroupDatasourceAccess.next(true);

                // Get all the data via API
                let GroupDatasourceAccessWorking: GroupDatasourceAccess[] = [];
                this.get<EazlGroupDatasourceAccess>('group-datasource-accesss')
                    .subscribe(
                        (eazlGroupDatasourceAccess) => {
                            for (var i = 0; i < eazlGroupDatasourceAccess.length; i++) {
                                let GroupDatasourceAccessSingle = new GroupDatasourceAccess();
                                GroupDatasourceAccessSingle = this.cdal.loadGroupDatasourceAccess(eazlGroupDatasourceAccess[i]);
                                GroupDatasourceAccessWorking.push(GroupDatasourceAccessSingle);

                            }

                        // Replace
                        // TODO - replace local Array after Bradley's done initial upload
                        //  this.groupDatasourceAccess = groupDatasourceAccessWorking;

                        // Mark the data as clean
                        this.globalVariableService.dirtyDataGroupDatasourceAccess.next(false);
                        }
                )
            }

            // Clear all
            if (resetAction.toLowerCase() == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear GroupDatasourceAccess');
                this.groupDatasourceAccess = [];

                // Mark the data as dirty
                this.globalVariableService.dirtyDataGroupDatasourceAccess.next(true);
            }
        }

        // Notification
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'Notification') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset Notification');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataNotification.next(true);

                // Get all the data via API
                let NotificationWorking: Notification[] = [];
                this.get<EazlNotification>('notifications')
                    .subscribe(
                        (eazlNotification) => {
                            for (var i = 0; i < eazlNotification.length; i++) {
                                let NotificationSingle = new Notification();
                                NotificationSingle = this.cdal.loadNotification(eazlNotification[i]);
                                NotificationWorking.push(NotificationSingle);

                            }

                        // Replace
                        // TODO - replace local Array after Bradley's done initial upload
                        //  this.notifications = notificationWorking;

                        // Mark the data as clean
                        this.globalVariableService.dirtyDataNotification.next(false);
                        }
                )
            }

            // Clear all
            if (resetAction.toLowerCase() == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear Notification');
                this.notifications = [];

                // Mark the data as dirty
                this.globalVariableService.dirtyDataNotification.next(true);
            }
        }

        // PackageTask
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'PackageTask') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset PackageTask');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataPackageTask.next(true);

                // Get all the data via API
                let packageTaskWorking: PackageTask[] = [];
                this.get<EazlPackageTask>('package-tasks')
                    .subscribe(
                        (eazlPackageTask) => {
                            for (var i = 0; i < eazlPackageTask.length; i++) {
                                let packageTaskSingle = new PackageTask();
                                packageTaskSingle = this.cdal.loadPackageTask(eazlPackageTask[i]);
                                packageTaskWorking.push(packageTaskSingle);

                            }

                        // Replace
                        // TODO - replace local Array after Bradley's done initial upload
                            this.packageTask = packageTaskWorking;

                        // Mark the data as clean
                        this.globalVariableService.dirtyDataPackageTask.next(false);
                        }
                )
            }

            // Clear all
            if (resetAction.toLowerCase() == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear PackageTask');
                this.packageTask = [];

                // Mark the data as dirty
                this.globalVariableService.dirtyDataPackageTask.next(true);
            }
        }

        // Report
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'Report') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset Report');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataReport.next(true);

                // Get all the data via API
                let ReportWorking: Report[] = [];
                this.get<EazlReport>('reports')
                    .subscribe(
                        (eazlReport) => {
                            for (var i = 0; i < eazlReport.length; i++) {
                                let ReportSingle = new Report();
                                ReportSingle = this.cdal.loadReport(eazlReport[i]);
                                ReportWorking.push(ReportSingle);

                            }

                        // Replace
                        // TODO - replace local Array after Bradley's done initial upload
                        //  this.reports = reportWorking;

                        // Mark the data as clean
                        this.globalVariableService.dirtyDataReport.next(false);
                        }
                )
            }

            // Clear all
            if (resetAction.toLowerCase() == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear Report');
                this.reports = [];

                // Mark the data as dirty
                this.globalVariableService.dirtyDataReport.next(true);
            }
        }

        // ReportWidgetSet
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'ReportWidgetSet') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset ReportWidgetSet');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataReportWidgetSet.next(true);

                // Get all the data via API
                let ReportWidgetSetWorking: ReportWidgetSet[] = [];
                this.get<EazlReportWidgetSet>('report-widget-sets')
                    .subscribe(
                        (eazlReportWidgetSet) => {
                            for (var i = 0; i < eazlReportWidgetSet.length; i++) {
                                let ReportWidgetSetSingle = new ReportWidgetSet();
                                ReportWidgetSetSingle = this.cdal.loadReportWidgetSet(eazlReportWidgetSet[i]);
                                ReportWidgetSetWorking.push(ReportWidgetSetSingle);

                            }

                        // Replace
                        // TODO - replace local Array after Bradley's done initial upload
                        //  this.reportWidgetSet = ReportWidgetSetWorking;

                        // Mark the data as clean
                        this.globalVariableService.dirtyDataReportWidgetSet.next(false);
                        }
                )
            }

            // Clear all
            if (resetAction.toLowerCase() == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear ReportWidgetSet');
                this.reportWidgetSet = [];

                // Mark the data as dirty
                this.globalVariableService.dirtyDataReportWidgetSet.next(true);
            }
        }

        // ReportHistory
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'ReportHistory') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset ReportHistory');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataReportHistory.next(true);

                // Get all the data via API
                let ReportHistoryWorking: ReportHistory[] = [];
                this.get<EazlReportHistory>('report-history')
                    .subscribe(
                        (eazlReportHistory) => {
                            for (var i = 0; i < eazlReportHistory.length; i++) {
                                let ReportHistorySingle = new ReportHistory();
                                ReportHistorySingle = this.cdal.loadReportHistory(eazlReportHistory[i]);
                                ReportHistoryWorking.push(ReportHistorySingle);

                            }

                        // Replace
                        // TODO - replace local Array after Bradley's done initial upload
                        //  this.reportHistory = reportHistoryWorking;

                        // Mark the data as clean
                        this.globalVariableService.dirtyDataReportHistory.next(false);
                        }
                )
            }

            // Clear all
            if (resetAction.toLowerCase() == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear ReportHistory');
                this.reportHistory = [];

                // Mark the data as dirty
                this.globalVariableService.dirtyDataReportHistory.next(true);
            }
        }

        // ReportUserRelationship
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'ReportUserRelationship') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset ReportUserRelationship');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataReportUserRelationship.next(true);

                // Get all the data via API
                let ReportUserRelationshipWorking: ReportUserRelationship[] = [];
                this.get<EazlReportUserRelationship>('report-user-relationships')
                    .subscribe(
                        (eazlReportUserRelationship) => {
                            for (var i = 0; i < eazlReportUserRelationship.length; i++) {
                                let ReportUserRelationshipSingle = new ReportUserRelationship();
                                ReportUserRelationshipSingle = this.cdal.loadReportUserRelationship(eazlReportUserRelationship[i]);
                                ReportUserRelationshipWorking.push(ReportUserRelationshipSingle);

                            }

                        // Replace
                        // TODO - replace local Array after Bradley's done initial upload
                        //  this.reportUserRelationship = reportUserRelationshipWorking;

                        // Mark the data as clean
                        this.globalVariableService.dirtyDataReportUserRelationship.next(false);
                        }
                )
            }

            // Clear all
            if (resetAction.toLowerCase() == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear ReportUserRelationship');
                this.reportUserRelationship = [];

                // Mark the data as dirty
                this.globalVariableService.dirtyDataReportUserRelationship.next(true);
            }
        }

        // SystemConfiguration
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'SystemConfiguration') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset SystemConfiguration');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataSystemConfiguration.next(true);

                // Get all the data via API
                let systemConfigurationWorking: SystemConfiguration = null;
                this.get<EazlSystemConfiguration>('system-configuration')
                    .subscribe(
                        (eazlSystemConfiguration) => {
                            for (var i = 0; i < eazlSystemConfiguration.length; i++) {
                                let systemConfigurationSingle = new SystemConfiguration();
                                systemConfigurationSingle = this.cdal.loadSystemConfiguration(eazlSystemConfiguration[i]);
                                systemConfigurationWorking = systemConfigurationSingle;
                            }

                        // Replace
                        this.systemConfiguration = systemConfigurationWorking;

                        // Mark the data as clean
                        this.globalVariableService.dirtyDataSystemConfiguration.next(false);
                        }
                    )
            }

            // Clear all
            if (resetAction.toLowerCase() == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear SystemConfiguration');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataSystemConfiguration.next(true);

                this.systemConfiguration = null;
            }
        }

        // Personalisation
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'Personalisation') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset Personalisation');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataPersonalisation.next(true);

                // Get all the data via API
                let personalisationWorking: Personalisation = null;
                this.get<EazlPersonalisation>('personalisation')
                    .subscribe(
                        (eazlPersonalisation) => {
                            for (var i = 0; i < eazlPersonalisation.length; i++) {
                                let personalisationSingle = new Personalisation();
                                personalisationSingle = this.cdal.loadPersonalisation(eazlPersonalisation[i]);
                                personalisationWorking = personalisationSingle;
                            }

                        // Replace
                        this.personalisation = personalisationWorking;

                        // Mark the data as clean
                        this.globalVariableService.dirtyDataPersonalisation.next(false);
                        }
                    )
            }

            // Clear all
            if (resetAction.toLowerCase() == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear Personalisation');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataPersonalisation.next(true);

                this.personalisation = null;
            }
        }

        // UserGroupMembership
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'UserGroupMembership') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset UserGroupMembership');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataUserGroupMembership.next(true);

                // Get all the data via API
                let UserGroupMembershipWorking: UserGroupMembership[] = [];
            this.get<EazlUserGroupMembership>('user-group-membership')
                    .subscribe(
                        (eazlUserGroupMembership) => {
                            for (var i = 0; i < eazlUserGroupMembership.length; i++) {
                                let UserGroupMembershipSingle = new UserGroupMembership();
                                UserGroupMembershipSingle = this.cdal.loadUserGroupMembership(eazlUserGroupMembership[i]);
                                UserGroupMembershipWorking.push(UserGroupMembershipSingle);

                            }

                        // Replace
                        // TODO - replace local Array after Bradley's done initial upload
                        //  this.userGroupMembership = userGroupMembershipWorking;

                        // Mark the data as clean
                        this.globalVariableService.dirtyDataUserGroupMembership.next(false);
                        }
                )
            }

            // Clear all
            if (resetAction.toLowerCase() == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear UserGroupMembership');
                this.userGroupMembership = [];

                // Mark the data as dirty
                this.globalVariableService.dirtyDataUserGroupMembership.next(true);
            }
        }

        // WidgetComment
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'WidgetComment') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset WidgetComment');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataWidgetComment.next(true);

                // Get all the data via API
                let WidgetCommentWorking: WidgetComment[] = [];
                this.get<EazlWidgetComment>('widget-comments')
                    .subscribe(
                        (eazlWidgetComment) => {
                            for (var i = 0; i < eazlWidgetComment.length; i++) {
                                let WidgetCommentSingle = new WidgetComment();
                                WidgetCommentSingle = this.cdal.loadWidgetComment(eazlWidgetComment[i]);
                                WidgetCommentWorking.push(WidgetCommentSingle);

                            }

                        // Replace
                        // TODO - replace local Array after Bradley's done initial upload
                        //  this.widgetComments = widgetCommentWorking;

                        // Mark the data as clean
                        this.globalVariableService.dirtyDataWidgetComment.next(false);
                        }
                )
            }

            // Clear all
            if (resetAction.toLowerCase() == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear WidgetComment');
                this.widgetComments = [];

                // Mark the data as dirty
                this.globalVariableService.dirtyDataWidgetComment.next(true);
            }
        }

        // WidgetTemplate
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'WidgetTemplate') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset WidgetTemplate');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataWidgetTemplate.next(true);

                // Get all the data via API
                let WidgetTemplateWorking: WidgetTemplate[] = [];
                this.get<EazlWidgetTemplate>('widget-templates')
                    .subscribe(
                        (eazlWidgetTemplate) => {
                            for (var i = 0; i < eazlWidgetTemplate.length; i++) {
                                let WidgetTemplateSingle = new WidgetTemplate();
                                WidgetTemplateSingle = this.cdal.loadWidgetTemplate(eazlWidgetTemplate[i]);
                                WidgetTemplateWorking.push(WidgetTemplateSingle);

                            }

                        // Replace
                        // TODO - replace local Array after Bradley's done initial upload
                        //  this.widgetTemplates = widgetTemplateWorking;

                        // Mark the data as clean
                        this.globalVariableService.dirtyDataWidgetTemplate.next(false);
                        }
                )
            }

            // Clear all
            if (resetAction.toLowerCase() == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear WidgetTemplate');
                this.widgetTemplates = [];

                // Mark the data as dirty
                this.globalVariableService.dirtyDataWidgetTemplate.next(true);
            }
        }

        // Widget
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'Widget') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset Widget');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataWidget.next(true);

                // Get all the data via API
                let widgetsWorking: EazlWidget[] = [];
                this.get<EazlWidget>('widgets')
                    .subscribe(
                        (eazlWidget) => {
                            for (var i = 0; i < eazlWidget.length; i++) {

            // TODO - fix code here
                                // widgetsWorking.push({
                                //     id: eazlWidget[i].id,
                                //     name: eazlWidget[i].name,
                                //     query: eazlWidget[i].query,
                                //     widget_type: eazlWidget[i].widget_type,
                                //     specification: eazlWidget[i].specification
                                // });
                            }

                        // Replace
                        // this.widgets = widgetsWorking;

                        // Mark the data as clean
                        this.globalVariableService.dirtyDataWidget.next(false);
                        }
                    )
            }

            // Clear all
            if (resetAction.toLowerCase() == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear Widget');
                this.widgets = [];

                // Mark the data as dirty
                this.globalVariableService.dirtyDataWidget.next(true);
            }
        }

        // WidgetType
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'WidgetType') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset WidgetType');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataWidgetType.next(true);

                // Get all the data via API
                let widgetTypeWorking: WidgetType[] = [];
                this.get<EazlAppData>('appdata')
                    .subscribe(
                        (eazlAppData) => {
                            for (var i = 0; i < eazlAppData.length; i++) {
                                if (eazlAppData[i].entity == 'WidgetType') {
                                    widgetTypeWorking.push(
                                        this.cdal.loadWidgetTypes(eazlAppData[i])
                                    );
                                }
                            }

                        // Replace
                        this.widgetTypes = widgetTypeWorking;

                        // Mark the data as clean
                        this.globalVariableService.dirtyDataWidgetType.next(false);
                        }
                    )
            }

            // Clear all
            if (resetAction == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear WidgetType');
                this.widgetTypes = [];

                // Mark the data as dirty
                this.globalVariableService.dirtyDataWidgetType.next(true);
            }
        }

        // GraphType
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'GraphType') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset GraphType');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataGraphType.next(true);

                // Get all the data via API
                let graphTypeWorking: GraphType[] = [];
                this.get<EazlAppData>('appdata')
                    .subscribe(
                        (eazlAppData) => {
                            for (var i = 0; i < eazlAppData.length; i++) {
                                if (eazlAppData[i].entity == 'GraphType') {
                                    graphTypeWorking.push(
                                        this.cdal.loadGraphTypes(eazlAppData[i]));
                                }
                            }

                        // Replace
                        this.graphTypes = graphTypeWorking;

                        // Mark the data as clean
                        this.globalVariableService.dirtyDataGraphType.next(false);
                        }
                    )
            }

            // Clear all
            if (resetAction == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear GraphType');
                this.graphTypes = [];

                // Mark the data as dirty
                this.globalVariableService.dirtyDataGraphType.next(true);
            }
        }

        // BorderDropdown
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'BorderDropdown') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset BorderDropdown');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataBorderDropdown.next(true);

                // Get all the data via API
                let borderDropdownWorking: SelectItem[] = [];

                this.get<EazlAppData>('appdata')
                    .subscribe(
                        (eazlAppData) => {
                            for (var i = 0; i < eazlAppData.length; i++) {
                                if (eazlAppData[i].entity == 'BorderDropdown') {
                                    borderDropdownWorking.push(
                                        this.cdal.loadBorderDropdowns(eazlAppData[i])
                                    );
                                }
                            }

                        // Replace
                        this.borderDropdowns = borderDropdownWorking;

                        // Mark the data as clean
                        this.globalVariableService.dirtyDataBorderDropdown.next(false);
                        }
                    )
            }

            // Clear all
            if (resetAction == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear BorderDropdown');
                this.borderDropdowns = [];

                // Mark the data as dirty
                this.globalVariableService.dirtyDataBorderDropdown.next(true);
            }
        }

        // BoxShadowDropdown
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'BoxShadowDropdown') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset BoxShadowDropdown');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataBoxShadowDropdown.next(true);

                // Get all the data via API
                let boxShadowDropdownsWorking: SelectItem[] = [];

                this.get<EazlAppData>('appdata')
                    .subscribe(
                        (eazlAppData) => {
                            for (var i = 0; i < eazlAppData.length; i++) {
                                if (eazlAppData[i].entity == 'BoxShadowDropdown') {
                                    boxShadowDropdownsWorking.push(
                                        this.cdal.loadBoxShadowDropdowns(eazlAppData[i])
                                    );
                                }
                            }

                        // Replace
                        this.boxShadowDropdowns = boxShadowDropdownsWorking;

                        // Mark the data as clean
                        this.globalVariableService.dirtyDataBoxShadowDropdown.next(false);
                        }
                    )
            }

            // Clear all
            if (resetAction == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear BoxShadowDropdown');
                this.boxShadowDropdowns = [];

                // Mark the data as dirty
                this.globalVariableService.dirtyDataBoxShadowDropdown.next(true);
            }
        }

        // FontSizeDropdown
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'FontSizeDropdown') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset FontSizeDropdown');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataFontSizeDropdown.next(true);

                // Get all the data via API
                let fontSizeDropdownsWorking: SelectItem[] = [];

                this.get<EazlAppData>('appdata')
                    .subscribe(
                        (eazlAppData) => {
                            for (var i = 0; i < eazlAppData.length; i++) {
                                if (eazlAppData[i].entity == 'FontSizeDropdown') {
                                    fontSizeDropdownsWorking.push(
                                        this.cdal.loadFontSizeDropdowns(eazlAppData[i])
                                    );
                                }
                            }

                        // Replace
                        this.fontSizeDropdowns = fontSizeDropdownsWorking;

                        // Mark the data as clean
                        this.globalVariableService.dirtyDataFontSizeDropdown.next(false);
                        }
                    )
            }

            // Clear all
            if (resetAction == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear FontSizeDropdown');
                this.fontSizeDropdowns = [];

                // Mark the data as dirty
                this.globalVariableService.dirtyDataFontSizeDropdown.next(true);
            }
        }

        // GridSizeDropdown
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'GridSizeDropdown') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset GridSizeDropdown');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataGridSizeDropdown.next(true);

                // Get all the data via API
                let gridSizeDropdownsWorking: SelectItem[] = [];

                this.get<EazlAppData>('appdata')
                    .subscribe(
                        (eazlAppData) => {
                            for (var i = 0; i < eazlAppData.length; i++) {
                                if (eazlAppData[i].entity == 'GridSizeDropdown') {
                                    gridSizeDropdownsWorking.push(
                                        this.cdal.loadGridSizeDropdowns(eazlAppData[i])
                                    );
                                }
                            }

                        // Replace
                        this.gridSizeDropdowns = gridSizeDropdownsWorking;

                        // Mark the data as clean
                        this.globalVariableService.dirtyDataGridSizeDropdown.next(false);
                        }
                    )
            }

            // Clear all
            if (resetAction == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear GridSizeDropdown');
                this.gridSizeDropdowns = [];

                // Mark the data as dirty
                this.globalVariableService.dirtyDataGridSizeDropdown.next(true);
            }
        }

        // BackgroundImageDropdown
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'BackgroundImageDropdown') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset BackgroundImageDropdown');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataBackgroundImageDropdown.next(true);

                // Get all the data via API
                let backgroundImageDropdownsWorking: SelectItem[] = [];

                this.get<EazlAppData>('appdata')
                    .subscribe(
                        (eazlAppData) => {
                            for (var i = 0; i < eazlAppData.length; i++) {
                                if (eazlAppData[i].entity == 'BackgroundImageDropdown') {
                                    backgroundImageDropdownsWorking.push(this.cdal.loadBackgroundImageDropdowns(eazlAppData[i]));
                                }
                            }

                        // Replace
                        this.backgroundImageDropdowns = backgroundImageDropdownsWorking;

                        // Mark the data as clean
                        this.globalVariableService.dirtyDataBackgroundImageDropdown.next(false);
                        }
                    )
            }

            // Clear all
            if (resetAction == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear BackgroundImageDropdown');
                this.backgroundImageDropdowns = [];

                // Mark the data as dirty
                this.globalVariableService.dirtyDataBackgroundImageDropdown.next(true);
            }
        }




        // TextMarginDropdown
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'TextMarginDropdown') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset TextMarginDropdown');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataTextMarginDropdown.next(true);

                // Get all the data via API
                let textMarginDropdownWorking: WidgetType[] = [];
                this.get<EazlAppData>('appdata')
                    .subscribe(
                        (eazlAppData) => {
                            for (var i = 0; i < eazlAppData.length; i++) {
                                if (eazlAppData[i].entity == 'TextMarginDropdown') {
                                    textMarginDropdownWorking.push(
                                        this.cdal.loadTextMarginDropdown(eazlAppData[i])
                                    );
                                }
                            }

                        // Replace
                        this.textMarginDropdowns = textMarginDropdownWorking;

                        // Mark the data as clean
                        this.globalVariableService.dirtyDataTextMarginDropdown.next(false);
                        }
                    )
            }

            // Clear all
            if (resetAction == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear TextMarginDropdown');
                this.textMarginDropdowns = [];

                // Mark the data as dirty
                this.globalVariableService.dirtyDataTextMarginDropdown.next(true);
            }
        }




    }
}
