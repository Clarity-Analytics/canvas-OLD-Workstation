// Service that provides all data (from the DB)
import { Injectable }                 from '@angular/core';
import { Headers }                    from '@angular/http';
import { Http }                       from '@angular/http';
import { Observable }                 from 'rxjs/Observable';
import { OnInit }                     from '@angular/core';
import { Response }                   from '@angular/http';
import { RequestOptions }             from '@angular/http';

// Our Services
import { CanvasDate }                 from './date.services';
import { GlobalFunctionService }      from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';
 
// Our models
import { CanvasUser }                 from './model.user';
import { Dashboard }                  from './model.dashboards';
import { DashboardGroup }             from './model.dashboardGroup';
import { DashboardGroupMembership }   from './model.dashboardGroupMembership';
import { DashboardGroupRelationship } from './model.dashboardGroupRelationship';
import { DashboardsPerUser }          from './model.dashboardsPerUser';
import { DashboardUserRelationship }  from './model.dashboardUserRelationship';
import { DashboardTab }               from './model.dashboardTabs';
import { DataSource }                 from './model.datasource';
import { DatasourcesPerUser }         from './model.datasourcesPerUser';
import { DataSourceUserAccess }       from './model.datasourceUserAccess';
import { EazlUser }                   from './model.user';
import { Group }                      from './model.group';
import { GroupDatasourceAccess }      from './model.groupDSaccess';
import { CanvasMessage }              from './model.canvasMessage';
import { Report }                     from './model.report';
import { ReportHistory }              from './model.reportHistory';
import { ReportWidgetSet }            from './model.report.widgetSets';
import { ReportUserRelationship }     from './model.reportUserRelationship';
import { SystemConfiguration }        from './model.systemconfiguration';
import { User }                       from './model.user';
import { UserGroupMembership }        from './model.userGroupMembership';
import { Widget }                     from './model.widget';
import { WidgetComment }              from './model.widget.comment';
import { WidgetTemplate }             from './model.widgetTemplates';

// Token for RESTi
export interface Token {
	token: string;
}

var req = new XMLHttpRequest();

// TODO - use RESTi
export const SYSTEMCONFIGURATION: SystemConfiguration = 
{
    companyName: 'Clarity',
    companyLogo: '',
    backendUrl: 'localhost:8000',
    defaultDaysToKeepResultSet: 1,
    averageWarningRuntime: 3,
    maxRowsDataReturned: 1000000,
    maxRowsPerWidgetGraph: 15,
    keepDevLoggedIn: false,
    frontendColorScheme: '',
    defaultWidgetConfiguration: '',
    defaultReportFilters: '',
    growlSticky: false,
    growlLife: 3,
    gridSize: 3,
    snapToGrid: true 
}

export const DATASOURCEUSERACCESS: DataSourceUserAccess[] =
[
    {
        datasourceID: 0,
        userName: 'janniei',
        dataSourceUserAccessType: 'Readonly',         // Type = Readonly, Update, Add, Delete, Full
        dataSourceUserAccessScope: 'All'              // Applies to: All (records), context specific .. ?
    },
    {
        datasourceID: 1,
        userName: 'janniei',
        dataSourceUserAccessType: 'Full',             // Type = Readonly, Update, Add, Delete, Full
        dataSourceUserAccessScope: 'All'              // Applies to: All (records), context specific .. ?
    },
    {
        datasourceID: 0,
        userName: 'bradleyk',
        dataSourceUserAccessType: 'Readonly',         // Type = Readonly, Update, Add, Delete, Full
        dataSourceUserAccessScope: 'All'              // Applies to: All (records), context specific .. ?
    },
    {
        datasourceID: 1,
        userName: 'bradleyk',
        dataSourceUserAccessType: 'Add',              // Type = Readonly, Update, Add, Delete, Full
        dataSourceUserAccessScope: 'All'              // Applies to: All (records), context specific .. ?
    }
]

export const REPORTHISTORY: ReportHistory[] = 
[
    {
        reportHistoryID: 0,
        userName: 'janniei',
        reportID: 1,
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
        reportHistoryStartDateTime: '2017/05/01 08:21',
        reportHistoryEndDateTime: '2017/05/01 08:24',
        reportHistoryStatus: 'Succes',
        reportHistoryNrRowsReturned: 12,
        reportHistoryComments: ''
    },
]

export const REPORTUSERRELATIONSHIP: ReportUserRelationship[] = 
[
    {
        reportUserRelationshipID: 0,
        userName: 'janniei',
        reportID: 1,
        reportUserRelationshipType: 'Owns',
        reportUserRelationshipRating: 0,
        reportUserRelationshipCreatedDateTime: '2017/05/01 14:21',
        reportUserRelationshipCreatedUserID: 'janniei',
        reportUserRelationshipUpdatedDateTime: '2017/05/01 14:21',
        reportUserRelationshipUpdatedUserID: 'janniei'
    },
    {
        reportUserRelationshipID: 0,
        userName: 'bradleyk',
        reportID: 1,
        reportUserRelationshipType: 'Owns',
        reportUserRelationshipRating: 0,
        reportUserRelationshipCreatedDateTime: '2017/05/01 14:21',
        reportUserRelationshipCreatedUserID: 'janniei',
        reportUserRelationshipUpdatedDateTime: '2017/05/01 14:21',
        reportUserRelationshipUpdatedUserID: 'janniei'
    }
]

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
                    dataIssueCreatedUserID: '',
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
            datasourceCreatedUserID: '',
            datasourceUpdatedDateTime: '',
            datasourceUpdatedUserID: ''
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
                    dataIssueCreatedUserID: '',
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
            datasourceCreatedUserID: '',
            datasourceUpdatedDateTime: '',
            datasourceUpdatedUserID: ''
        }
    ]

export const DASHBOARDGROUPRELATIONSHIP: DashboardGroupRelationship[] = 
[
    {
        dashboardGroupRelationshipID: 0,
        dashboardID: 1,
        groupID: 0,
        dashboardGroupRelationshipType: 'SharedWith',
        dashboardGroupRelationshipRating: 0,
        dashboardGroupRelationshipCreatedDateTime: '2017/05/01 16:01',
        dashboardGroupRelationshipCreatedUserID: 'janniei',
        dashboardGroupRelationshipUpdatedDateTime: '2017/05/01 16:01',
        dashboardGroupRelationshipUpdatedUserID: 'janniei'
    }
]

export const DASHBOARDUSERRELATIONSHIP: DashboardUserRelationship[]  = 
[
    {
        dashboardUserRelationshipID: 0,
        dashboardID: 0,
        userName: 'janniei',
        dashboardUserRelationshipType: 'SharedWith',
        dashboardUserRelationshipRating: 0,
        dashboardUserRelationshipCreatedDateTime: '2017/05/01 16:01',
        dashboardUserRelationshipCreatedUserID: 'janniei',
        dashboardUserRelationshipUpdatedDateTime: '2017/05/01 16:01',
        dashboardUserRelationshipUpdatedUserID: 'janniei'
    },
    {
        dashboardUserRelationshipID: 1,
        dashboardID: 0,
        userName: 'janniei',
        dashboardUserRelationshipType: 'Likes',
        dashboardUserRelationshipRating: 0,
        dashboardUserRelationshipCreatedDateTime: '2017/05/01 16:01',
        dashboardUserRelationshipCreatedUserID: 'janniei',
        dashboardUserRelationshipUpdatedDateTime: '2017/05/01 16:01',
        dashboardUserRelationshipUpdatedUserID: 'janniei'
    },
    {
        dashboardUserRelationshipID: 2,
        dashboardID: 1,
        userName: 'bradleyk',
        dashboardUserRelationshipType: 'Likes',
        dashboardUserRelationshipRating: 0,
        dashboardUserRelationshipCreatedDateTime: '2017/05/01 16:01',
        dashboardUserRelationshipCreatedUserID: 'janniei',
        dashboardUserRelationshipUpdatedDateTime: '2017/05/01 16:01',
        dashboardUserRelationshipUpdatedUserID: 'janniei'
    },
    {
        dashboardUserRelationshipID: 3,
        dashboardID: 0,
        userName: 'bradleyk',
        dashboardUserRelationshipType: 'SharedWith',
        dashboardUserRelationshipRating: 0,
        dashboardUserRelationshipCreatedDateTime: '2017/05/01 16:01',
        dashboardUserRelationshipCreatedUserID: 'janniei',
        dashboardUserRelationshipUpdatedDateTime: '2017/05/01 16:01',
        dashboardUserRelationshipUpdatedUserID: 'janniei'
    },
    {
        dashboardUserRelationshipID: 4,
        dashboardID: 3,
        userName: 'bradleyk',
        dashboardUserRelationshipType: 'SharedWith',
        dashboardUserRelationshipRating: 0,
        dashboardUserRelationshipCreatedDateTime: '2017/05/01 16:01',
        dashboardUserRelationshipCreatedUserID: 'janniei',
        dashboardUserRelationshipUpdatedDateTime: '2017/05/01 16:01',
        dashboardUserRelationshipUpdatedUserID: 'janniei'
    },
    {
        dashboardUserRelationshipID: 5,
        dashboardID: 3,
        userName: 'janniei',
        dashboardUserRelationshipType: 'Owns',
        dashboardUserRelationshipRating: 0,
        dashboardUserRelationshipCreatedDateTime: '2017/05/01 16:01',
        dashboardUserRelationshipCreatedUserID: 'janniei',
        dashboardUserRelationshipUpdatedDateTime: '2017/05/01 16:01',
        dashboardUserRelationshipUpdatedUserID: 'janniei'
    }
]

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
            dashboardCreatedUserID: 'BenVdMark',
            dashboardDefaultExportFileType: 'PowerPoint',
            dashboardDescription: 'This is a unique and special dashboard, like all others',
            dashboardNrGroups: 0,
            dashboardIsLocked: false,
            dashboardIsLiked: false,
            dashboardOpenTabNr: 1,
            dashboardOwnerUserID: 'JohnH',
            dashboardPassword: 'StudeBaker',
            dashboardRefreshedDateTime: '',
            dashboardRefreshedUserID: '',
            dashboardRefreshMode: 'Manual',
            dashboardNrUsersSharedWith: 0,
            dashboardNrGroupsSharedWith: 0,
            dashboardSystemMessage: '',
            dashboardUpdatedDateTime: '2017/07/08',
            dashboardUpdatedUserID: 'GordenJ'
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
            dashboardCreatedUserID: 'GranalN',
            dashboardDefaultExportFileType: 'Excel',
            dashboardDescription: 'Just another Dashboard',
            dashboardNrGroups: 0,
            dashboardIsLocked: false,
            dashboardIsLiked: false,
            dashboardOpenTabNr: 0,
            dashboardOwnerUserID: 'AshR',
            dashboardPassword: '',
            dashboardRefreshedDateTime: '2016/08/07',
            dashboardRefreshedUserID: '',
            dashboardRefreshMode: 'Manual',
            dashboardNrUsersSharedWith: 0,
            dashboardNrGroupsSharedWith: 0,
            dashboardSystemMessage: '',
            dashboardUpdatedDateTime: '2016/09/08',
            dashboardUpdatedUserID: 'JerimiaA'
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
            dashboardCreatedUserID: 'GranalN',
            dashboardDefaultExportFileType: 'Excel',
            dashboardDescription: 'Just another Dashboard',
            dashboardNrGroups: 0,
            dashboardIsLocked: false,
            dashboardIsLiked: false,
            dashboardOpenTabNr: 0,
            dashboardOwnerUserID: 'AshR',
            dashboardPassword: '',
            dashboardRefreshedDateTime: '2016/08/07',
            dashboardRefreshedUserID: '',
            dashboardRefreshMode: 'Manual',
            dashboardNrUsersSharedWith: 0,
            dashboardNrGroupsSharedWith: 0,
            dashboardSystemMessage: '',
            dashboardUpdatedDateTime: '2016/09/08',
            dashboardUpdatedUserID: 'JerimiaA'
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
            dashboardCreatedUserID: 'GranalN',
            dashboardDefaultExportFileType: 'Excel',
            dashboardDescription: 'Just another Dashboard',
            dashboardNrGroups: 0,
            dashboardIsLocked: false,
            dashboardIsLiked: false,
            dashboardOpenTabNr: 0,
            dashboardOwnerUserID: 'AshR',
            dashboardPassword: '',
            dashboardRefreshedDateTime: '2016/08/07',
            dashboardRefreshedUserID: '',
            dashboardRefreshMode: 'Manual',
            dashboardNrUsersSharedWith: 0,
            dashboardNrGroupsSharedWith: 0,
            dashboardSystemMessage: '',
            dashboardUpdatedDateTime: '2016/09/08',
            dashboardUpdatedUserID: 'JerimiaA'
        },
        {
            dashboardID: 5,
            dashboardCode: 'Jobs timeseries',
            dashboardName: 'Stacked grap with jobs timeseries',
            isContainerHeaderDark: false,
            showContainerHeader: true,
            dashboardBackgroundColor: '',
            dashboardBackgroundImageSrc: '',
            dashboardComments: 'No Comment',
            dashboardCreatedDateTime: '2016/07/08',
            dashboardCreatedUserID: 'GranalN',
            dashboardDefaultExportFileType: 'Excel',
            dashboardDescription: 'Just another Dashboard',
            dashboardNrGroups: 0,
            dashboardIsLocked: false,
            dashboardIsLiked: false,
            dashboardOpenTabNr: 0,
            dashboardOwnerUserID: 'AshR',
            dashboardPassword: '',
            dashboardRefreshedDateTime: '2016/08/07',
            dashboardRefreshedUserID: '',
            dashboardRefreshMode: 'Manual',
            dashboardNrUsersSharedWith: 0,
            dashboardNrGroupsSharedWith: 0,
            dashboardSystemMessage: '',
            dashboardUpdatedDateTime: '2016/09/08',
            dashboardUpdatedUserID: 'JerimiaA'
        },
        {
            dashboardID: 6,
            dashboardCode: 'Another Dash',
            dashboardName: '',
            isContainerHeaderDark: true,
            showContainerHeader: true,
            dashboardBackgroundColor: '',
            dashboardBackgroundImageSrc: '',
            dashboardComments: 'No Comment',
            dashboardCreatedDateTime: '2016/07/08',
            dashboardCreatedUserID: 'GranalN',
            dashboardDefaultExportFileType: 'Excel',
            dashboardDescription: 'Just another Dashboard',
            dashboardNrGroups: 0,
            dashboardIsLocked: false,
            dashboardIsLiked: false,
            dashboardOpenTabNr: 0,
            dashboardOwnerUserID: 'AshR',
            dashboardPassword: '',
            dashboardRefreshedDateTime: '2016/08/07',
            dashboardRefreshedUserID: '',
            dashboardRefreshMode: 'Manual',
            dashboardNrUsersSharedWith: 0,
            dashboardNrGroupsSharedWith: 0,
            dashboardSystemMessage: '',
            dashboardUpdatedDateTime: '2016/09/08',
            dashboardUpdatedUserID: 'JerimiaA'
        }
    ];

export const DASHBOARDGROUPS: DashboardGroup[] = 
    [
        {
            dashboardGroupID: 0,
            dashboardGroupName: 'Admin',
            dashboardGroupDescription: 'Dashboards for Admin users',
            dashboardGroupCreatedDateTime: '2017/05/01',
            dashboardGroupCreatedUserID: 'JamesK',
            dashboardGroupUpdatedDateTime: '2017/05/01', 
            dashboardGroupUpdatedUserID: 'JamesK' 
        },
        {
            dashboardGroupID: 1,
            dashboardGroupName: 'Marketing',
            dashboardGroupDescription: 'Dashboards for Marketing Team',
            dashboardGroupCreatedDateTime: '2017/05/01',
            dashboardGroupCreatedUserID: 'JamesK',
            dashboardGroupUpdatedDateTime: '2017/05/01', 
            dashboardGroupUpdatedUserID: 'JamesK' 
        },
        {
            dashboardGroupID: 2,
            dashboardGroupName: 'BI Team',
            dashboardGroupDescription: 'Dashboards for BI Team',
            dashboardGroupCreatedDateTime: '2017/05/01',
            dashboardGroupCreatedUserID: 'JamesK',
            dashboardGroupUpdatedDateTime: '2017/05/01', 
            dashboardGroupUpdatedUserID: 'JamesK' 
        },
        {
            dashboardGroupID: 3,
            dashboardGroupName: 'HR',
            dashboardGroupDescription: 'Dashboards for Human Resources Department',
            dashboardGroupCreatedDateTime: '2017/05/01',
            dashboardGroupCreatedUserID: 'JamesK',
            dashboardGroupUpdatedDateTime: '2017/05/01', 
            dashboardGroupUpdatedUserID: 'JamesK' 
        },
        {
            dashboardGroupID: 4,
            dashboardGroupName: 'Finance',
            dashboardGroupDescription: 'Dashboards for Finance Department',
            dashboardGroupCreatedDateTime: '2017/05/01',
            dashboardGroupCreatedUserID: 'JamesK',
            dashboardGroupUpdatedDateTime: '2017/05/01', 
            dashboardGroupUpdatedUserID: 'JamesK' 
        },
        {
            dashboardGroupID: 5,
            dashboardGroupName: 'Sales',
            dashboardGroupDescription: 'Dashboards for Sales Department',
            dashboardGroupCreatedDateTime: '2017/05/01',
            dashboardGroupCreatedUserID: 'JamesK',
            dashboardGroupUpdatedDateTime: '2017/05/01', 
            dashboardGroupUpdatedUserID: 'JamesK' 
        },
        {
            dashboardGroupID: 6,
            dashboardGroupName: 'R&D',
            dashboardGroupDescription: 'Dashboards for Research and Development Department',
            dashboardGroupCreatedDateTime: '2017/05/01',
            dashboardGroupCreatedUserID: 'JamesK',
            dashboardGroupUpdatedDateTime: '2017/05/01', 
            dashboardGroupUpdatedUserID: 'JamesK' 
        },
        {
            dashboardGroupID: 7,
            dashboardGroupName: 'IT',
            dashboardGroupDescription: 'Dashboards for Information Technology Department',
            dashboardGroupCreatedDateTime: '2017/05/01',
            dashboardGroupCreatedUserID: 'JamesK',
            dashboardGroupUpdatedDateTime: '2017/05/01', 
            dashboardGroupUpdatedUserID: 'JamesK' 
        }
    ]

export const DASHBOARDGROUPMEMBERSHIP: DashboardGroupMembership[] =
    [
        {
            dashboardGroupID: 0,
            dashboardID: 0,
            dashboardGroupMembershipCreatedDateTime: '2017/05/01', 
            dashboardGroupMembershipCreatedUserID:  'JamesK',
            dashboardGroupMembershipUpdatedDateTime: '2017/05/01', 
            dashboardGroupMembershipUpdatedUserID: 'JamesK'
        },        
        {
            dashboardGroupID: 4,
            dashboardID: 0,
            dashboardGroupMembershipCreatedDateTime: '2017/05/01', 
            dashboardGroupMembershipCreatedUserID:  'JamesK',
            dashboardGroupMembershipUpdatedDateTime: '2017/05/01', 
            dashboardGroupMembershipUpdatedUserID: 'JamesK'
        },        
        {
            dashboardGroupID: 1,
            dashboardID: 1,
            dashboardGroupMembershipCreatedDateTime: '2017/05/01', 
            dashboardGroupMembershipCreatedUserID:  'JamesK',
            dashboardGroupMembershipUpdatedDateTime: '2017/05/01', 
            dashboardGroupMembershipUpdatedUserID: 'JamesK'
        },        
        {
            dashboardGroupID: 5,
            dashboardID: 1,
            dashboardGroupMembershipCreatedDateTime: '2017/05/01', 
            dashboardGroupMembershipCreatedUserID:  'JamesK',
            dashboardGroupMembershipUpdatedDateTime: '2017/05/01', 
            dashboardGroupMembershipUpdatedUserID: 'JamesK'
        },        
    ]

export const DASHBOARDTABS: DashboardTab[] =
    [
        {
            dashboardID: 0,
            dashboardTabID: 0,
            dashboardTabName: 'Value',
            dashboardTabDescription: '0-Value: Full and detailed desription of tab - purpose',
            dashboardCreatedDateTime: '2017/05/01',
            dashboardCreatedUserID: 'John Doe',
            dashboardTabUpdatedDateTime: '2017/05/01',
            dashboardTabUpdatedUserID: 'Leonard Cohen'   
        },
        {
            dashboardID: 0,
            dashboardTabID: 1,
            dashboardTabName: 'Volume',
            dashboardTabDescription: '0-Volume: Full and detailed desription of tab - purpose',
            dashboardCreatedDateTime: '2017/05/01',
            dashboardCreatedUserID: 'John Doe',
            dashboardTabUpdatedDateTime: '2017/05/01',
            dashboardTabUpdatedUserID: 'Leonard Cohen'   
        },        
        {
            dashboardID: 1,
            dashboardTabID: 2,
            dashboardTabName: 'Value',
            dashboardTabDescription: 'Full and detailed desription of tab - purpose',
            dashboardCreatedDateTime: '2017/05/01',
            dashboardCreatedUserID: 'John Doe',
            dashboardTabUpdatedDateTime: '2017/05/01',
            dashboardTabUpdatedUserID: 'Leonard Cohen'   
        },
        {
            dashboardID: 1,
            dashboardTabID: 3,
            dashboardTabName: 'Volume',
            dashboardTabDescription: '1-Value: Full and detailed desription of tab - purpose',
            dashboardCreatedDateTime: '2017/05/01',
            dashboardCreatedUserID: 'John Doe',
            dashboardTabUpdatedDateTime: '2017/05/01',
            dashboardTabUpdatedUserID: 'Leonard Cohen'   
        },
        {
            dashboardID: 3,
            dashboardTabID: 4,
            dashboardTabName: 'Value',
            dashboardTabDescription: '3-Value: Full and detailed desription of tab - purpose',
            dashboardCreatedDateTime: '2017/05/01',
            dashboardCreatedUserID: 'John Doe',
            dashboardTabUpdatedDateTime: '2017/05/01',
            dashboardTabUpdatedUserID: 'Leonard Cohen'   
        },
        {
            dashboardID: 4,
            dashboardTabID: 5,
            dashboardTabName: 'Value',
            dashboardTabDescription: '4-Value: Full and detailed desription of tab - purpose',
            dashboardCreatedDateTime: '2017/05/01',
            dashboardCreatedUserID: 'John Doe',
            dashboardTabUpdatedDateTime: '2017/05/01',
            dashboardTabUpdatedUserID: 'Leonard Cohen'   
        },
        {
            dashboardID: 5,
            dashboardTabID: 6,
            dashboardTabName: 'Value',
            dashboardTabDescription: '5-Value: Full and detailed desription of tab - purpose',
            dashboardCreatedDateTime: '2017/05/01',
            dashboardCreatedUserID: 'John Doe',
            dashboardTabUpdatedDateTime: '2017/05/01',
            dashboardTabUpdatedUserID: 'Leonard Cohen'   
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
                textFontSize: 16,
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
                dashboardTabID: 0,
                dashboardTabName: "Value",
                widgetCode: 'FirstBar',
                widgetName: 'Bar Chart 1',
                widgetAddRestRow: true,
                widgetCreatedDateTime: '',
                widgetCreatedUserID: '',
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
                        widgetLikedUserID: 'JessyB'
                    },
                    {
                        widgetLikedUserID: 'JonnyC'
                    }
                ],
                widgetPassword: '***',
                widgetRefreshedDateTime: '',
                widgetRefreshedUserID: '',
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
                widgetUpdatedUserID: ''
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
                textFontSize: 16,
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
                dashboardTabID: 0,
                dashboardTabName: "Value",
                widgetCode: 'SecondBar',
                widgetName: 'Bar Chart 2',

                widgetAddRestRow: true,
                widgetCreatedDateTime: '',
                widgetCreatedUserID: '',
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
                        widgetLikedUserID: 'janniei',
                    }
                ],
                widgetPassword: '',
                widgetRefreshedDateTime: '',
                widgetRefreshedUserID: '',
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
                widgetUpdatedUserID: ''
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
                textFontSize: 16,
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
                dashboardTabID: 0,
                dashboardTabName: "Value",
                widgetCode: 'ThirdBar',
                widgetName: 'Bar Chart 3',

                widgetAddRestRow: true,
                widgetCreatedDateTime: '',
                widgetCreatedUserID: '',
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
                        widgetLikedUserID: '',
                    }
                ],
                widgetPassword: '',
                widgetRefreshedDateTime: '',
                widgetRefreshedUserID: '',
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
                widgetUpdatedUserID: ''
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
                textFontSize: 16,
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
                dashboardTabID: 1,
                dashboardTabName: "Volume",
                widgetCode: 'FourthBar',
                widgetName: 'Bar Chart 4',

                widgetAddRestRow: true,
                widgetCreatedDateTime: '',
                widgetCreatedUserID: '',
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
                        widgetLikedUserID: '',
                    }
                ],
                widgetPassword: '',
                widgetRefreshedDateTime: '',
                widgetRefreshedUserID: '',
                widgetRefreshFrequency: 3,
                widgetRefreshMode: '',
                widgetReportID: -1,
                widgetReportName: '',
                widgetReportParameters: '',
                widgetShowLimitedRows: 0,
                widgetSize: '',
                widgetSystemMessage: '',
                widgetTypeID: 0,
                widgetType: '',
                widgetUpdatedDateTime: '',
                widgetUpdatedUserID: ''
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
                textFontSize: 16,
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
                        "url": "../assets/vega/vega-datasets/data/population.json"
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
                dashboardTabID: 1,
                dashboardTabName: "Volume",
                widgetCode: 'FifthBar',
                widgetName: 'Bar Chart 5',

                widgetAddRestRow: true,
                widgetCreatedDateTime: '',
                widgetCreatedUserID: '',
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
                        widgetLikedUserID: '',
                    }
                ],
                widgetPassword: '',
                widgetRefreshedDateTime: '',
                widgetRefreshedUserID: '',
                widgetRefreshFrequency: 3,
                widgetRefreshMode: '',
                widgetReportID: -1,
                widgetReportName: '',
                widgetReportParameters: '',
                widgetShowLimitedRows: 0,
                widgetSize: '',
                widgetSystemMessage: '',
                widgetTypeID: 0,
                widgetType: '',
                widgetUpdatedDateTime: '',
                widgetUpdatedUserID: ''
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
                textFontSize: 16,
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
                dashboardTabID: 2,
                dashboardTabName: "Value",
                widgetCode: 'FirstPie',
                widgetName: 'Pie contracts per Broker 2',

                widgetAddRestRow: true,
                widgetCreatedDateTime: '',
                widgetCreatedUserID: '',
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
                        widgetLikedUserID: '',
                    }
                ],
                widgetPassword: '',
                widgetRefreshedDateTime: '',
                widgetRefreshedUserID: '',
                widgetRefreshFrequency: 3,
                widgetRefreshMode: '',
                widgetReportID: -1,
                widgetReportName: '',
                widgetReportParameters: '',
                widgetShowLimitedRows: 0,
                widgetSize: '',
                widgetSystemMessage: '',
                widgetTypeID: 0,
                widgetType: '',
                widgetUpdatedDateTime: '',
                widgetUpdatedUserID: ''
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
                textFontSize: 16,
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
                dashboardTabID: 3,
                dashboardTabName: "Volume",
                widgetCode: 'SecondBar',
                widgetName: 'Line Volume 1',

                widgetAddRestRow: true,
                widgetCreatedDateTime: '',
                widgetCreatedUserID: '',
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
                        widgetLikedUserID: '',
                    }
                ],
                widgetPassword: '',
                widgetRefreshedDateTime: '',
                widgetRefreshedUserID: '',
                widgetRefreshFrequency: 3,
                widgetRefreshMode: '',
                widgetReportID: -1,
                widgetReportName: '',
                widgetReportParameters: '',
                widgetShowLimitedRows: 0,
                widgetSize: '',
                widgetSystemMessage: '',
                widgetTypeID: 0,
                widgetType: '',
                widgetUpdatedDateTime: '',
                widgetUpdatedUserID: ''
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
                textFontSize: 16,
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
                        "url": "../assets/vega/vega-datasets/data/unemployment.tsv",
                        "format": {"type": "tsv", "parse": "auto"}
                        },
                        {
                        "name": "counties",
                        "url": "../assets/vega/vega-datasets/data/us-10m.json",
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
                dashboardTabID: 4,
                dashboardTabName: "Value",
                widgetCode: 'FirstPie',
                widgetName: 'Pie contracts per Broker 2',

                widgetAddRestRow: true,
                widgetCreatedDateTime: '',
                widgetCreatedUserID: '',
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
                        widgetLikedUserID: '',
                    }
                ],
                widgetPassword: '',
                widgetRefreshedDateTime: '',
                widgetRefreshedUserID: '',
                widgetRefreshFrequency: 3,
                widgetRefreshMode: '',
                widgetReportID: -1,
                widgetReportName: '',
                widgetReportParameters: '',
                widgetShowLimitedRows: 0,
                widgetSize: '',
                widgetSystemMessage: '',
                widgetTypeID: 0,
                widgetType: '',
                widgetUpdatedDateTime: '',
                widgetUpdatedUserID: ''
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
                textFontSize: 16,
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
                        "url": "../assets/vega/vega-datasets/data/flare.json",
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
                dashboardTabID: 4,
                dashboardTabName: "Value",
                widgetCode: 'FirstPie',
                widgetName: 'Pie contracts per Broker 2',

                widgetAddRestRow: true,
                widgetCreatedDateTime: '',
                widgetCreatedUserID: '',
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
                        widgetLikedUserID: '',
                    }
                ],
                widgetPassword: '',
                widgetRefreshedDateTime: '',
                widgetRefreshedUserID: '',
                widgetRefreshFrequency: 3,
                widgetRefreshMode: '',
                widgetReportID: -1,
                widgetReportName: '',
                widgetReportParameters: '',
                widgetShowLimitedRows: 0,
                widgetSize: '',
                widgetSystemMessage: '',
                widgetTypeID: 0,
                widgetType: '',
                widgetUpdatedDateTime: '',
                widgetUpdatedUserID: ''
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
                textFontSize: 16,
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
                dashboardTabID: 5,
                dashboardTabName: "Value",
                widgetCode: 'FirstPie',
                widgetName: 'Pie contracts per Broker 2',

                widgetAddRestRow: true,
                widgetCreatedDateTime: '',
                widgetCreatedUserID: '',
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
                        widgetLikedUserID: '',
                    }
                ],
                widgetPassword: '',
                widgetRefreshedDateTime: '',
                widgetRefreshedUserID: '',
                widgetRefreshFrequency: 3,
                widgetRefreshMode: '',
                widgetReportID: -1,
                widgetReportName: '',
                widgetReportParameters: '',
                widgetShowLimitedRows: 0,
                widgetSize: '',
                widgetSystemMessage: '',
                widgetTypeID: 0,
                widgetType: '',
                widgetUpdatedDateTime: '',
                widgetUpdatedUserID: ''
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
                textFontSize: 16,
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
                        "url": "../assets/vega/vega-datasets/data/jobs.json",
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
                dashboardTabID: 6,
                dashboardTabName: "Value",
                widgetCode: 'FirstPie',
                widgetName: 'Pie contracts per Broker 2',

                widgetAddRestRow: true,
                widgetCreatedDateTime: '',
                widgetCreatedUserID: '',
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
                        widgetLikedUserID: '',
                    }
                ],
                widgetPassword: '',
                widgetRefreshedDateTime: '',
                widgetRefreshedUserID: '',
                widgetRefreshFrequency: 3,
                widgetRefreshMode: '',
                widgetReportID: -1,
                widgetReportName: '',
                widgetReportParameters: '',
                widgetShowLimitedRows: 0,
                widgetSize: '',
                widgetSystemMessage: '',
                widgetTypeID: 0,
                widgetType: '',
                widgetUpdatedDateTime: '',
                widgetUpdatedUserID: ''
            }
        }
    ];

export const WIDGETCOMMENTS: WidgetComment[] =
    [
        {
            widgetCommentID: 1,
            widgetID: 1,
            widgetCommentThreadID: 1,
            widgetCommentCreateDateTime: '2017/02/14 13:01',
            widgetCommentCreatorUserID: 'JohnS',
            widgetCommentHeading: 'Data Accuracy',
            widgetCommentBody: 'Is the Nov data correct?'
        },
        {
            widgetCommentID: 2,
            widgetID: 1,
            widgetCommentThreadID: 1,
            widgetCommentCreateDateTime: '2017/02/14 13:15',
            widgetCommentCreatorUserID: 'SandyB',
            widgetCommentHeading: 'Data Accuracy',
            widgetCommentBody: 'Yip, checked against external source'
        },
        {
            widgetCommentID: 3,
            widgetID: 1,
            widgetCommentThreadID: 1,
            widgetCommentCreateDateTime: '2017/02/14 14:03',
            widgetCommentCreatorUserID: 'JohnS',
            widgetCommentHeading: 'Data Accuracy',
            widgetCommentBody: 'Thanx'
        },
        {
            widgetCommentID: 4,
            widgetID: 1,
            widgetCommentThreadID: 2,
            widgetCommentCreateDateTime: '2017/02/17 07:50',
            widgetCommentCreatorUserID: 'DonnaD',
            widgetCommentHeading: 'Congrats',
            widgetCommentBody: 'Excellent sales, keep going!'
        },
        {
            widgetCommentID: 5,
            widgetID: 1,
            widgetCommentThreadID: 14,
            widgetCommentCreateDateTime: '2017/04/14',
            widgetCommentCreatorUserID: 'HenriD',
            widgetCommentHeading: 'More research required on incidents',
            widgetCommentBody: ''
        },
    ];

export const REPORTS: Report[] =
    [
        {
            reportID: 1,
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
                ]
        },
        {
            reportID: 2,
            reportName: 'Bond monthly Values',
            description: 'Description ...  etc',
            reportParameters: '',
            dataSourceID: 143,
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
                ]
        }
    ]

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
                    }
        }
    ]

export const GROUPS: Group[] = 
    [
        {
            groupID: 0,
            groupName: 'Admin',
            groupDescription: 'Admin group has full rights to the whole system',
            groupCreatedDateTime: '2017/05/01',
            groupCreatedUserID: 'JamesK',
            groupUpdatedDateTime: '2017/05/01', 
            groupUpdatedUserID: 'JamesK' 
        },
        {
            groupID: 1,
            groupName: 'Guest',
            groupDescription: 'Guest group has no rights',
            groupCreatedDateTime: '2017/05/01',
            groupCreatedUserID: 'JamesK',
            groupUpdatedDateTime: '2017/05/01', 
            groupUpdatedUserID: 'JamesK' 
        },
        {
            groupID: 2,
            groupName: 'BI Team',
            groupDescription: 'BI Team',
            groupCreatedDateTime: '2017/05/01',
            groupCreatedUserID: 'JamesK',
            groupUpdatedDateTime: '2017/05/01', 
            groupUpdatedUserID: 'JamesK' 
        },
        {
            groupID: 3,
            groupName: 'HR',
            groupDescription: 'Human Resources Department',
            groupCreatedDateTime: '2017/05/01',
            groupCreatedUserID: 'JamesK',
            groupUpdatedDateTime: '2017/05/01', 
            groupUpdatedUserID: 'JamesK' 
        },
        {
            groupID: 4,
            groupName: 'Finance',
            groupDescription: 'Finance Department',
            groupCreatedDateTime: '2017/05/01',
            groupCreatedUserID: 'JamesK',
            groupUpdatedDateTime: '2017/05/01', 
            groupUpdatedUserID: 'JamesK' 
        },
        {
            groupID: 5,
            groupName: 'Sales',
            groupDescription: 'Sales Department',
            groupCreatedDateTime: '2017/05/01',
            groupCreatedUserID: 'JamesK',
            groupUpdatedDateTime: '2017/05/01', 
            groupUpdatedUserID: 'JamesK' 
        },
        {
            groupID: 6,
            groupName: 'R&D',
            groupDescription: 'Research and Development Department',
            groupCreatedDateTime: '2017/05/01',
            groupCreatedUserID: 'JamesK',
            groupUpdatedDateTime: '2017/05/01', 
            groupUpdatedUserID: 'JamesK' 
        },
        {
            groupID: 7,
            groupName: 'IT',
            groupDescription: 'Information Technology Department',
            groupCreatedDateTime: '2017/05/01',
            groupCreatedUserID: 'JamesK',
            groupUpdatedDateTime: '2017/05/01', 
            groupUpdatedUserID: 'JamesK' 
        }
    ]

export const GROUPDATASOURCEACCESS: GroupDatasourceAccess[] =
    [
        {
            groupID: 0,
            datasourceID: 0,
            groupDatasourceAccessAccessType: 'Read',
            groupDatasourceAccessCreatedDateTime: '2017/05/01',
            groupDatasourceAccessCreatedUserID: 'PatricOS',
            groupDatasourceAccessUpdatedDateTime: '2017/05/01',
            groupDatasourceAccessUpdatedUserID: 'PatricOS' 
        }
    ]

export const USERGROUPMEMBERSHIP: UserGroupMembership[] =
    [
        {
            groupID: 0,
            userName: 'janniei',
            userGroupMembershipCreatedDateTime: '2017/05/01', 
            userGroupMembershipCreatedUserID:  'JamesK',
            userGroupMembershipUpdatedDateTime: '2017/05/01', 
            userGroupMembershipUpdatedUserID: 'JamesK'
        },        
        {
            groupID: 4,
            userName: 'janniei',
            userGroupMembershipCreatedDateTime: '2017/05/01', 
            userGroupMembershipCreatedUserID:  'JamesK',
            userGroupMembershipUpdatedDateTime: '2017/05/01', 
            userGroupMembershipUpdatedUserID: 'JamesK'
        },        
        {
            groupID: 1,
            userName: 'bradleyk',
            userGroupMembershipCreatedDateTime: '2017/05/01', 
            userGroupMembershipCreatedUserID:  'JamesK',
            userGroupMembershipUpdatedDateTime: '2017/05/01', 
            userGroupMembershipUpdatedUserID: 'JamesK'
        },        
        {
            groupID: 5,
            userName: 'bradleyk',
            userGroupMembershipCreatedDateTime: '2017/05/01', 
            userGroupMembershipCreatedUserID:  'JamesK',
            userGroupMembershipUpdatedDateTime: '2017/05/01', 
            userGroupMembershipUpdatedUserID: 'JamesK'
        },        
    ]

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
            }
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
            }
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
            }
        }
    ]

export const CANVASMESSAGES: CanvasMessage[] = 
    [
        {
            messageConversationID: 0,
            messageID: 0,
            messageSenderUserID: 'janniei',
            messageSentDateTime: '2017/05/01 09:10',
            messageIsSystemGenerated: false,
            messageDashboardID: 0,
            messageReportID: 1,
            messageWidgetID: -1,
            messageSubject: 'Value looks too low',
            messageBody: 'Please look at value for May, particularly in Bonds',
            messageSentToMe: false,
            messageMyStatus: 'UnRead',
            messageRecipients: [
                {
                    messageRecipientUserID: 'bradleyk',
                    messageRecipientStatus: 'Read',
                    messageReadDateTime: '2017/05/01 09:11',
                }
            ]
        },
        {
            messageConversationID: 0,
            messageID: 1,
            messageSenderUserID: 'bradleyk',
            messageSentDateTime: '2017/05/01 10:17',
            messageIsSystemGenerated: false,
            messageDashboardID: 0,
            messageReportID: 1,
            messageWidgetID: -1,
            messageSubject: 'Value looks too low',
            messageBody: 'Checked, all good',
            messageSentToMe: true,
            messageMyStatus: 'Read',
            messageRecipients: [
                {
                    messageRecipientUserID: 'janniei',
                    messageRecipientStatus: 'Read',
                    messageReadDateTime: '2017/05/01 11:50',
                }
            ]
        },
        {
            messageConversationID: 0,
            messageID: 2,
            messageSenderUserID: 'janniei',
            messageSentDateTime: '2017/05/01 11:51',
            messageIsSystemGenerated: false,
            messageDashboardID: 0,
            messageReportID: 1,
            messageWidgetID: -1,
            messageSubject: 'Value looks too low',
            messageBody: 'Thank you',
            messageSentToMe: false,
            messageMyStatus: 'UnRead',
            messageRecipients: [
                {
                    messageRecipientUserID: 'bradleyk',
                    messageRecipientStatus: 'UnRead',
                    messageReadDateTime: '',
                }
            ]
        },
        {
            messageConversationID: 1,
            messageID: 3,
            messageSenderUserID: 'janniei',
            messageSentDateTime: '2017/05/02 13:47',
            messageIsSystemGenerated: false,
            messageDashboardID: -1,
            messageReportID: 2,
            messageWidgetID: 3,
            messageSubject: 'Snacks available @ coffee machine',
            messageBody: 'Enjoy!',
            messageSentToMe: false,
            messageMyStatus: 'UnRead',
            messageRecipients: [
                {
                    messageRecipientUserID: 'jamesv',
                    messageRecipientStatus: 'UnRead',
                    messageReadDateTime: '',
                },
                {
                    messageRecipientUserID: 'bradleyk',
                    messageRecipientStatus: 'Read',
                    messageReadDateTime: '2017/05/02 14:23',
                },
                {
                    messageRecipientUserID: 'veronicas',
                    messageRecipientStatus: 'UnRead',
                    messageReadDateTime: '',
                }
            ]
        }
    ]


@Injectable()
export class EazlService implements OnInit {
    httpBaseUri: string;                                    // url for the RESTi
    httpHeaders: Headers;                                   // Header for http
    httpOptions: RequestOptions;                            // Options for http
    route: string = 'users';                                // Route to RESTi - users/authen...

    // Local Arrays to keep data for the rest of the Application
    canvasMessages: CanvasMessage[] = CANVASMESSAGES;       // List of CanvasMessages 
    dashboards: Dashboard[] = DASHBOARDS;                   // List of Dashboards
    dashboardGroupMembership: DashboardGroupMembership[] = DASHBOARDGROUPMEMBERSHIP; //List of Dashboard-Group
    dashboardGroupRelationship: DashboardGroupRelationship[] = DASHBOARDGROUPRELATIONSHIP; // Dashboard-Group relationships
    dashboardUserRelationship: DashboardUserRelationship[] = DASHBOARDUSERRELATIONSHIP; // Dashboard-Group relationships
    dashboardGroups: DashboardGroup[] = DASHBOARDGROUPS;    //List of Dashboard-Group
    dashboardTabs: DashboardTab[] = DASHBOARDTABS;          // List of Dashboard Tabs
    datasources: DataSource[] = DATASOURCES;                // List of Data Sources
    dataSourceUserAccess: DataSourceUserAccess[] = DATASOURCEUSERACCESS;   // List of users with Access to a Datasource
    groups: Group[] = GROUPS;                               // List of Groups
    groupDatasourceAccess: GroupDatasourceAccess[] = GROUPDATASOURCEACCESS;     // List of group access to DS
    reports: Report[] = REPORTS;                            // List of Reports
    reportHistory: ReportHistory[] = REPORTHISTORY;         // List of Report History (ran)
    reportUserRelationship: ReportUserRelationship[] = REPORTUSERRELATIONSHIP; // List of relationships
    reportWidgetSet: ReportWidgetSet[] = REPORTWIDGETSET;   // List of WidgetSets per Report
    systemConfiguration: SystemConfiguration = SYSTEMCONFIGURATION; // System wide settings
    users: User[] = [];                                     // List of Users
    usergroupMembership: UserGroupMembership[] = USERGROUPMEMBERSHIP;  // List of User-Group                               // List of Groups
    widgetComments: WidgetComment[] = WIDGETCOMMENTS;       // List of Widget Comments
    widgetTemplates: WidgetTemplate[] = WIDGETTEMPLATES     // List of Widget Templates
    widgets: Widget[] = WIDGETS;                            // List of Widgets for a selected Dashboard

    constructor(
        private canvasDate: CanvasDate,
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private http: Http,
        ) {
            this.httpBaseUri = `${window.location.protocol}//${window.location.hostname}:8000/api/`
            this.httpHeaders = new Headers({'Content-Type': 'application/json'});
            this.httpOptions = new RequestOptions({headers: this.httpHeaders});
    }

    ngOnInit() {
        // Starters
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');
    }

    getSystemConfiguration() {
        // Returns SystemConfiguration
        this.globalFunctionService.printToConsole(this.constructor.name,'getSystemConfiguration', '@Start');

        return this.systemConfiguration;
    }

    updateSystemConfiguration(systemConfiguration: SystemConfiguration) {
        // Updates SystemConfiguration
        // - systemConfiguration New data
        this.globalFunctionService.printToConsole(this.constructor.name,'updateSystemConfiguration', '@Start');

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
        if (systemConfiguration.averageWarningRuntime != this.systemConfiguration.averageWarningRuntime) {
            this.globalVariableService.averageWarningRuntime.next(systemConfiguration.averageWarningRuntime);
        }
        if (systemConfiguration.maxRowsDataReturned != this.systemConfiguration.maxRowsDataReturned) {
            this.globalVariableService.maxRowsDataReturned.next(systemConfiguration.maxRowsDataReturned);
        }
        if (systemConfiguration.maxRowsPerWidgetGraph != this.systemConfiguration.maxRowsPerWidgetGraph) {
            this.globalVariableService.maxRowsPerWidgetGraph.next(systemConfiguration.maxRowsPerWidgetGraph);
        }
        if (systemConfiguration.keepDevLoggedIn != this.systemConfiguration.keepDevLoggedIn) {
            this.globalVariableService.keepDevLoggedIn.next(systemConfiguration.keepDevLoggedIn);
        }
        if (systemConfiguration.frontendColorScheme != this.systemConfiguration.frontendColorScheme) {
            this.globalVariableService.frontendColorScheme.next(systemConfiguration.frontendColorScheme);
        }
        if (systemConfiguration.defaultWidgetConfiguration != this.systemConfiguration.defaultWidgetConfiguration) {
            this.globalVariableService.defaultWidgetConfiguration.next(systemConfiguration.defaultWidgetConfiguration);
        }
        if (systemConfiguration.defaultReportFilters != this.systemConfiguration.defaultReportFilters) {
            this.globalVariableService.defaultReportFilters.next(systemConfiguration.defaultReportFilters);
        }
        if (systemConfiguration.growlSticky != this.systemConfiguration.growlSticky) {
            this.globalVariableService.growlSticky.next(systemConfiguration.growlSticky);
        }
        if (systemConfiguration.growlLife != this.systemConfiguration.growlLife) {
            this.globalVariableService.growlLife.next(systemConfiguration.growlLife);
        }
        if (systemConfiguration.gridSize != this.systemConfiguration.gridSize) {
            this.globalVariableService.gridSize.next(systemConfiguration.gridSize);
        }
        if (systemConfiguration.snapToGrid != this.systemConfiguration.snapToGrid) {
            this.globalVariableService.snapToGrid.next(systemConfiguration.snapToGrid);
        }
        
        this.systemConfiguration = systemConfiguration;
    }

    logout(username: string) {
        // Logout user from backend
        this.globalFunctionService.printToConsole(this.constructor.name,'logout', '@Start');

        this.globalVariableService.canvasUser.next(new CanvasUser);
        this.globalVariableService.isAuthenticatedOnEazl.next(false);
        window.sessionStorage.removeItem('canvas-token');

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
		        window.sessionStorage.setItem('canvas-token', authToken.token);
                this.httpHeaders.set('Authorization', `token ${authToken.token}`);
                return this.get<EazlUser>(`${this.route}/authenticated-user`)
                .toPromise()
                .then(
                    eazlUser => {
                        // Set global Canvas user & that is authenticated on Eazl

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
                            last_login: eazlUser.last_login
                        });
                        this.globalVariableService.isAuthenticatedOnEazl.next(true);

                        // Inform the user
                        this.globalVariableService.growlGlobalMessage.next({
                            severity: 'info',
                            summary:  'Succes',
                            detail:   'Login successful for ' + eazlUser.username
                        });

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

		window.sessionStorage.removeItem('canvas-token');
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
        this.globalFunctionService.printToConsole(this.constructor.name,'post', '@Start');
        
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
        this.globalFunctionService.printToConsole(this.constructor.name,'post', '@Start');

        var error: string = '';
         // Do some logging one day
        if (response instanceof Response) {
            var payload = response.json() || '';
             error = payload.body || JSON.stringify(payload);
        } else {
            error = response.message ? response.message : response.toString();
        }
         return Observable.throw(error);
    }

    get<T>(route: string, data?: Object): Observable<any> {
        // Get from http
        this.globalFunctionService.printToConsole(this.constructor.name,'get', '@Start');

        return this.http.get(this.prepareRoute(route), this.httpOptions)
            .map(this.parseResponse)
            .catch(this.handleError);
    }
 
    post<T>(route: string, data: Object): Observable<any> {
        // Post to http
        this.globalFunctionService.printToConsole(this.constructor.name,'post', '@Start');

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
            username: user.userName,
            first_name: user.firstName,
            last_name: user.lastName,
            email: user.emailAddress,
            password: 'canvas100*',
            is_superuser: false,        //ro
            is_staff: user.isStaff, //ro
            is_active: true,
            last_login: null
        }

        return this.post<EazlUser>('users',workingUser)
                .toPromise()
                .then( eazlUser => {    
                    // Update local store
                    this.users.push(user);

                    // TODO - reGet the local => always in sync
                    // Not dirty any longer
                    this.globalVariableService.isDirtyUsers.next(false);

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
 
    getUsers(): Promise<User[]> {
        // Return a list of Users
        this.globalFunctionService.printToConsole(this.constructor.name,'getUsers', '@Start');

        // Determine if the users are dirty, else present existing Array
        let isDirtyUsers: boolean = this.globalVariableService.isDirtyUsers.getValue();
        
        if (isDirtyUsers) {
            
            // Clear out what we have, for now
            // let workingUsers: User[] = [];
            this.users = [];
            return this.get<EazlUser>(`${this.route}`)
                    .toPromise()
                    .then( eazlUser => {    

                        for (var i = 0; i < eazlUser.length; i++) {
                            this.users.push({
                                userName: eazlUser[i].username,
                                firstName: eazlUser[i].first_name,
                                lastName: eazlUser[i].last_name,
                                nickName: eazlUser[i].first_name,
                                photoPath: 'pic',
                                lastDatetimeLoggedIn: eazlUser[i].last_login,
                                lastDatetimeReportWasRun: '',
                                emailAddress: eazlUser[i].email,
                                cellNumber: '082-011-1234',
                                workTelephoneNumber: '011-222-3456',
                                activeFromDate: '2017/05/01',
                                inactiveDate: '',
                                dateCreated: eazlUser[i].date_joined,
                                userIDLastUpdated: '',
                                isStaff: eazlUser[i].is_staff,
                            });
                        }

                        // Not dirty any longer
                        this.globalVariableService.isDirtyUsers.next(false);

                        // Return the data
                        return this.users;
                    } )
                    .catch(error => {
                        this.globalVariableService.growlGlobalMessage.next({
                            severity: 'warn',
                            summary:  'GetUsers',
                            detail:   'Unsuccessful in getting users from the database'
                        });
                        error.message || error
                    })
        } else {
            // Just return what we have got, as its clean
            return Promise.resolve(this.users);
        }
    }

    updateDashboardContainerHeader(
        dashboardID: number,
        isContainerHeaderDark: boolean){
        // Update isContainerHeaderDark for given dashboard
        // - dashboardID: ID of Dashboard to update
        // - isContainerHeaderDark: new value of isContainerHeaderDark field

        // TODO - update for real in DB
    }

    updateDashboardshowContainerHeader(
        dashboardID: number,
        showContainerHeader: boolean){
        // Update showContainerHeader for given dashboard
        // - dashboardID: ID of Dashboard to update
        // - showContainerHeader: new value of showContainerHeader field

        // TODO - update for real in DB
    }

    updateDashboardBackgroundColor(
        dashboardID: number,
        dashboardBackgroundColor: string){
        // Update dashboardBackgroundColor for given dashboard
        // - dashboardID: ID of Dashboard to update
        // - dashboardBackgroundColor: new value of dashboardBackgroundColor field

        // TODO - update for real in DB
    }

    updateDashboardBackgroundImageSrc(
        dashboardID: number,
        dashboardBackgroundImageSrc: string){
        // Update dashboardBackgroundImageSrc for given dashboard
        // - dashboardID: ID of Dashboard to update
        // - dashboardBackgroundImageSrc: new value of dashboardBackgroundImageSrc field

        // TODO - update for real in DB
    }

    getDashboards(
        dashboardID: number = -1, 
        relatedUsername: string = '*', 
        relationshipType: string = '') {
        // Return a list of Dashboards, with optional filters
        // - dashboardID Optional parameter to select ONE, else select ALL (if >= 0)
        // - relatedUsername Optional username
        // - relationshipType Optional type, ie SharedWith
        this.globalFunctionService.printToConsole(this.constructor.name,'getDashboards', '@Start');

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
        let currentUser: string = '';
        if (this.globalVariableService.canvasUser.getValue() != null) {
            currentUser = this.globalVariableService.canvasUser.getValue().username;
        }

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

    getDashboardTabs(selectedDashboardID: number, selectedDashboardTabID?: number): DashboardTab[] {
        // Return a list of Dashboard Tabs for a given DashboardID,
        //   and Optionally if a DashboardTabID was given
        this.globalFunctionService.printToConsole(this.constructor.name,'getDashboardTabs', '@Start');

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

    updateDashboardTab(dashboardID: number, 
        dashboardTabID: number, 
        dashboardTabDescription: string
        ): boolean {
        // Update the details (like description) for a Dashboard Tab)
        this.globalFunctionService.printToConsole(this.constructor.name,'updateDashboardTab', '@Start');

        // Get the Tab
        let workingDashboardTabs: DashboardTab[] = [];
        workingDashboardTabs = this.getDashboardTabs(dashboardID, dashboardTabID)

        // Update detail
        if (workingDashboardTabs.length > 0) {
            workingDashboardTabs[0].dashboardTabDescription = dashboardTabDescription;
            return true;
        } else {
            return false;
        }
    }

    getWidgetsForDashboard(selectedDashboardID: number, selectedDashboarTabName: string) {
        // Return a list of Dashboards
        this.globalFunctionService.printToConsole(this.constructor.name,'getWidgetsForDashboard', '@Start');

        // Calc WIDGET certain fields, as it is easy to use in *ngIf or *ngFor
        // TODO - this is impure - do better
        let username: string = ''; 
        if (this.globalVariableService.canvasUser.getValue() != null) {
            username = this.globalVariableService.canvasUser.getValue().username;
        }

        for (var i = 0, len = this.widgets.length; i < len; i++) {
 
            // Set properties.widgetIsLiked if there are users who liked it
            for (var j = 0, len = this.widgets[i].properties.widgetLiked.length; j < len; j++) {

                if (this.widgets[i].properties.widgetLiked[j].widgetLikedUserID == username) {
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
        inputWidgetCommentCreateDateTime: string,
        inputWidgetCommentCreatorUserID: string,
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
                widgetCommentCreateDateTime: inputWidgetCommentCreateDateTime,
                widgetCommentCreatorUserID: inputWidgetCommentCreatorUserID,
                widgetCommentHeading: inputWidgetCommentHeading,
                widgetCommentBody: inputWidgetCommentBody
            }
        )
    }

    getWidgetsComments(selectedWidgetID: number) {
        // Return a list of Widget Comments
        this.globalFunctionService.printToConsole(this.constructor.name,'getWidgetsComments', '@Start');

        return this.widgetComments.filter(widgetComment =>
            widgetComment.widgetID == selectedWidgetID
        );
    }

    addWidget (widget: Widget) {
        // Add a new Widget
        this.globalFunctionService.printToConsole(this.constructor.name,'addWidget', '@Start');
        this.widgets.push(widget)
    }

    getDefaultWidgetConfig (): Widget {
        // Set default config for a new Widget
        this.globalFunctionService.printToConsole(this.constructor.name,'getDefaultWidgetConfig', '@Start');

        let DefaultWidgetConfig: Widget = {
            container: {
                backgroundColor: 'white',
                border: '1px solid white',
                boxShadow: 'none',
                color: 'black',
                fontSize: 1,
                height: 310,
                left: 240,
                widgetTitle: '',
                top: 80,
                width: 380,
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
                textFontSize: 16,
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
                dashboardTabID: 0,
                dashboardTabName: '',
                widgetCode: '',
                widgetName: '',
                widgetAddRestRow: false,
                widgetCreatedDateTime: '',
                widgetCreatedUserID: '',
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
                        widgetLikedUserID: ''
                    }
                ],
                widgetPassword: '',
                widgetRefreshedDateTime: '',
                widgetRefreshedUserID: '',
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
                widgetUpdatedUserID: ''
            }
        }

        return DefaultWidgetConfig;
    }

    getReports(
        dashboardID: number = -1, 
        username: string = '*', 
        relationship: string = '*'
        ): Report[] {
        // Return a list of Reports
        // - dashboardID Optional parameter to filter on
        // - username Optional filter on relationships for this username
        // - relationship Optiona filter of Type of relationship IF username: Likes, Rates, Owns
        this.globalFunctionService.printToConsole(this.constructor.name,'getReports', '@Start');

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

        // Return the (filtered) Reports
        return reportsWorking;
    }

    getReport(reportID: number): Report {
        // Return a single Report
        this.globalFunctionService.printToConsole(this.constructor.name,'getReport', '@Start');

        for (var i = 0; i < this.reports.length; i++) {
            if (this.reports[i].reportID == reportID) {
                return this.reports[i];
            }
        }
    }

    getReportFields(reportID: number): string[] {
        // Return a list of Reports
        this.globalFunctionService.printToConsole(this.constructor.name,'getReportFieldss', '@Start');

        for (var i = 0; i < this.reports.length; i++) {
            if (this.reports[i].reportID == reportID) {
                return this.reports[i].reportFields;
            }
        }
    }

    getReportData(reportID: number): string[] {
        // Return a list of Reports
        this.globalFunctionService.printToConsole(this.constructor.name,'getReportData', '@Start');

        for (var i = 0; i < this.reports.length; i++) {
            if (this.reports[i].reportID == reportID) {
                return this.reports[i].reportData;
            }
        }
    }

    getReportWidgetSets(reportID: number): ReportWidgetSet[] {
        // Return a list of WidgetSets per Report
        this.globalFunctionService.printToConsole(this.constructor.name,'getReportWidgetSets', '@Start');

        return this.reportWidgetSet.filter(wset => wset.reportID == reportID);
    }

    getReportHistory(userName: string ='*',reportID: number = -1){
        // Return history of reports run, optionally filtered
        this.globalFunctionService.printToConsole(this.constructor.name,'deleteUserGroupMembership', '@Start');
                
        return this.reportHistory.filter(rh =>
            (userName == '*'   ||   rh.userName == userName)
            &&
            (reportID == -1    ||   rh.reportID == reportID)
        )
        
    }

    getWidgetTemplates(widgetTemplateName: string): WidgetTemplate {
        // Return a list of WidgetSets per Report
        this.globalFunctionService.printToConsole(this.constructor.name,'getWidgetTemplates', '@Start');

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

        let foundUser: boolean = false;

        // Add
        if (isLikedNewState) {
            for (var i = 0; i < this.widgets.length; i++) {
                if (this.widgets[i].properties.widgetID == widgetID) {
                    this.widgets[i].properties.widgetIsLiked = isLikedNewState;
                    for (var j = 0; j < this.widgets[i].properties.widgetLiked.length; j++) {
                        if (this.widgets[i].properties.widgetLiked[j].widgetLikedUserID ==
                            username) { 
                                 foundUser = true;
                            }
                    }
                    if (!foundUser) {
                        this.widgets[i].properties.widgetLiked.push(
                            {
                                widgetLikedUserID: username
                            });
                    }
                }
            }
        } else  {
            for (var i = 0; i < this.widgets.length; i++) {
                if (this.widgets[i].properties.widgetID = widgetID) {
                    this.widgets[i].properties.widgetIsLiked == isLikedNewState;
                    for (var j = 0; j < this.widgets[i].properties.widgetLiked.length; j++) {
                        if (this.widgets[i].properties.widgetLiked[j].widgetLikedUserID ==
                            username) {
                                this.widgets[i].properties.widgetLiked.splice(j);
                            }
                    }
                }
            }
        }
    }

    getUsersResti() {
            this.users = [];
            return this.get<any>('widgets')
                    .toPromise()
                    .then( user => {    

                        // for (var i = 0; i < eazlUser.length; i++) {
                        //     this.users.push({
                        //         userName: eazlUser[i].username,
                        //         firstName: eazlUser[i].first_name,
                        //         lastName: eazlUser[i].last_name,
                        //         nickName: eazlUser[i].first_name,
                        //         photoPath: 'pic',
                        //         lastDatetimeLoggedIn: eazlUser[i].last_login,
                        //         lastDatetimeReportWasRun: '',
                        //         emailAddress: eazlUser[i].email,
                        //         cellNumber: '082-011-1234',
                        //         workTelephoneNumber: '011-222-3456',
                        //         activeFromDate: '2017/05/01',
                        //         inactiveDate: '',
                        //         dateCreated: eazlUser[i].date_joined,
                        //         userIDLastUpdated: '',
                        //         isStaff: eazlUser[i].is_staff,
                        //     });
                        // }

                        // Not dirty any longer
                        this.globalVariableService.isDirtyUsers.next(false);

                        // Return the data
                        return this.users;
                    } )
                    .catch(error => {
                    //     this.globalVariableService.growlGlobalMessage.next({
                    //         severity: 'warn',
                    //         summary:  'GetUsers',
                    //         detail:   'Unsuccessful in getting users from the database'
                    //     });
                    //     error.message || error
                    // })

    console.log('getUsersResti',error)        
                    })
    }

    getGroups(groupID: number = -1): Promise<Group[]> {
        // Return a list of Groups
        // - groupID Optional parameter to select ONE, else select ALL (if >= 0)
        this.globalFunctionService.printToConsole(this.constructor.name,'getGroups', '@Start');

        // TODO - from DB
        let resultGroups: Group[] = [];
        if (groupID == -1) {
            resultGroups = this.groups;
        }
        else {
            resultGroups = this.groups.filter(
                grp => grp.groupID == groupID
            )
        }

        return Promise.resolve(resultGroups);
    }

    addGroup(groupName: string, groupDescription: string) {
        // Add a new Group
        this.globalFunctionService.printToConsole(this.constructor.name,'addGroup', '@Start');

        let currentUser: string = '';
        if (this.globalVariableService.canvasUser.getValue() != null) {
            currentUser = this.globalVariableService.canvasUser.getValue().username;
        }

        this.groups.push({
            groupID: 0,
            groupName: groupName,
            groupDescription: groupDescription,
            groupCreatedDateTime: this.canvasDate.now('standard'),
            groupCreatedUserID: currentUser,
            groupUpdatedDateTime:this.canvasDate.now('standard'),
            groupUpdatedUserID: currentUser
        })
    }

    updateGroup(groupID: number, groupName: string, groupDescription: string) {
        // Update a given Group
        this.globalFunctionService.printToConsole(this.constructor.name,'updateGroup', '@Start');

        let currentUser: string = '';
        if (this.globalVariableService.canvasUser.getValue() != null) {
            currentUser = this.globalVariableService.canvasUser.getValue().username;
        }

        // Update data
        for (var i = 0; i < this.groups.length; i++) {
            if (this.groups[i].groupID == groupID) {
                this.groups[i].groupName = groupName;
                this.groups[i].groupDescription = groupDescription;
                this.groups[i].groupUpdatedDateTime = this.canvasDate.now('standard'),
                this.groups[i].groupUpdatedUserID = currentUser
            }
        };
    }

    deleteGroup(groupID: number) {
        // Delete a given Group
        this.globalFunctionService.printToConsole(this.constructor.name,'deleteGroup', '@Start');

        // Delete the data
        for (var i = 0; i < this.groups.length; i++) {
            if (this.groups[i].groupID == groupID) {
                this.groups.splice(i,1);
            }
        };
    }

    getUsersWhoCanAccessDatasource(datasourceID: number): Promise<User[]> {
        // Return list of Users who has access to a given DataSource
        // - username filter
        this.globalFunctionService.printToConsole(this.constructor.name,'getUsersWhoCanAccessDatasource', '@Start');
        
        // Get list of usernames with access
        // TODO - when from DB, add access type as I think this will be useful
        let userNames: string[] = [];
        this.dataSourceUserAccess.forEach(du => {
            if (du.datasourceID == datasourceID) {
                userNames.push(du.userName)
            };
        });

        return Promise.resolve(
            this.getUsers()
            .then( usr => {
                return usr.filter(
                    u => (userNames.indexOf(u.userName) >= 0) 
                );   
            })
            .catch(error => console.log (error) )
        );
    }

    getDatasourcesPerUser(username: string): DatasourcesPerUser[] {
        // Return list of DataSource for a given user (via Username & Groups)
        // - username filter
        this.globalFunctionService.printToConsole(this.constructor.name,'getDatasourcesPerUser', '@Start');

        let datasourceWorking: DataSource[] = [];
        let datasourceName: string = '';

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
                    username: username,
                    datasourceName: datasourceName,
                    datasourcesPerUserAccessVia: 'User: ' + username,
                    datasourcesPerUserAccessType: du.dataSourceUserAccessType
                })
            }
        })

        // Get list of GroupIDs that the User belongs to
        let groupIDs: number[] = [];
        this.usergroupMembership.forEach((usrgrp) => { 
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
                datasourcesPerUserWorking.push( {
                    datasourceID: gd.datasourceID,
                    username: username,
                    datasourceName: datasourceName,
                    datasourcesPerUserAccessVia: 'Group: ' + groupWorking[0].groupName,
                    datasourcesPerUserAccessType: gd.groupDatasourceAccessAccessType
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
        this.usergroupMembership.forEach((usrgrp) => { 
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
            accessType: string = '*') {
        // Return a list of Datasource-User and their access
        // - datasourceID Optional filter, 
        // - username Optional filter
        // - accessType Optional filter ( Readonly, Update, Add, Delete, Full)
        this.globalFunctionService.printToConsole(this.constructor.name,'getDatasourceUserAccess', '@Start');

        let dataSourceUserAccessWorking = this.dataSourceUserAccess;

        // Filter as needed
        if (datasourceID != -1) {
            dataSourceUserAccessWorking = dataSourceUserAccessWorking.filter( da =>
                da.datasourceID = datasourceID)
        };
        if (username != '*') {
            dataSourceUserAccessWorking = dataSourceUserAccessWorking.filter( da =>
                da.userName = username)
        };
        if (accessType != '*') {
            dataSourceUserAccessWorking = dataSourceUserAccessWorking.filter( da =>
                da.dataSourceUserAccessType = accessType)
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

    getGroupDatasourceAccess(groupID: number = -1, datasourceID: number = -1) {
        // Return of list with group - datasource acces
        // - groupID Optional filter, -1 = all
        // - datasourceID Optional filter,-1 = all
        this.globalFunctionService.printToConsole(this.constructor.name,'getGroupDatasourceAccess', '@Start');

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
        let currentUser: string = '';
        if (this.globalVariableService.canvasUser.getValue() != null) {
            currentUser = this.globalVariableService.canvasUser.getValue().username;
        }

        // Only add if not already there
        if (!found) {
            this.dataSourceUserAccess.push(
                {
                    datasourceID: datasourceID,
	                userName: username,
                    dataSourceUserAccessType: 'Readonly',
                    dataSourceUserAccessScope: 'All'
                }        
            )
        }
    }

    deleteDatasourceUserAccess(datasourceID: number, username: string) {
        // Deletes a Datasource - Group record from the DB
        this.globalFunctionService.printToConsole(this.constructor.name,'deleteDatasourceUserAccess', '@Start');

        this.dataSourceUserAccess = this.dataSourceUserAccess.filter(
            item => (!(item.datasourceID == datasourceID  &&  item.userName == username))
        );
    }

    getGroupsPerUser(username: string = '', include: boolean = true): Promise<Group[]> {
        // Return a list of Groups to which a user belongs
        // - username Optional parameter to select ONE, else select ALL (if >= 0)
        // - include Optional parameter, true = include all for user, else group NOT for username
        this.globalFunctionService.printToConsole(this.constructor.name,'getGroupsPerUser', '@Start');

        // TODO - from DB
        // Get Array of groups to in or ex clude
        let resultUsergroupMembership: number[] = [];

        // Return all if no username specified
        if (username == '') {
            return Promise.resolve(this.groups);
        }

        // Make an array of groupIDs to which this user belongs
        else {
            this.usergroupMembership.forEach(
                (usrgrp) => { 
                                if (usrgrp.userName == username) 
                                resultUsergroupMembership.push(usrgrp.groupID)  
                            }
            )   
        }

        // Return necesary groups, selectively depending on in/exclude
        let resultGroups: Group[];
        resultGroups = this.groups.filter(
            grp => (include  &&  resultUsergroupMembership.indexOf(grp.groupID) >= 0) 
                    ||
                    (!include && resultUsergroupMembership.indexOf(grp.groupID) < 0) 
        )
        return Promise.resolve(resultGroups);
    }

    getUsersPerGroup(groupID: number = -1, include: boolean = true): Promise<User[]> {
        // Return a list of Users that belongs to a group
        // - groupID Optional parameter, -1 = include all
        // - include, True means to which belongs, False means complements (NOT)
        this.globalFunctionService.printToConsole(this.constructor.name,'getGroupsPerUser', '@Start');

        // TODO - from DB
        // Get Array of users to in or ex clude
        let resultUsergroupMembership: string[] = [];

        // Return all if no username specified
        if (groupID == -1) {
            return Promise.resolve(this.users);
        }

        // Make an array of username that belongs to the Group
        else {
            this.usergroupMembership.forEach(
                (usrgrp) => { 
                                if (usrgrp.groupID == groupID) 
                                resultUsergroupMembership.push(usrgrp.userName)  
                            }
            )   
        }

        // Return necesary groups, selectively depending on in/exclude
        let resultUsers: User[];

        return Promise.resolve(
            this.getUsers()
                .then( usr => {
                    resultUsers = usr.filter(
                        u => (include  &&  resultUsergroupMembership.indexOf(u.userName) >= 0) 
                              ||
                             (!include &&  resultUsergroupMembership.indexOf(u.userName) < 0) 
                    );   
                    return Promise.resolve(resultUsers);
                })
            .catch(error => console.log (error) )
        )
    }

    addUserGroupMembership(username: string, groupID: number) {
        // Adds a User - Group record to the User Group Membership

        this.globalFunctionService.printToConsole(this.constructor.name,'addUserGroupMembership', '@Start');

        let found: boolean = false;
        for (var i = 0; i < this.usergroupMembership.length; i++) {
            if (this.usergroupMembership[i].userName == username  &&
                this.usergroupMembership[i].groupID == groupID) {
                    found = true;
                    break;
                }
        }

        // Get current user
        let currentUser: string = '';
        if (this.globalVariableService.canvasUser.getValue() != null) {
            currentUser = this.globalVariableService.canvasUser.getValue().username;
        }

        // Only add if not already there
        if (!found) {
            this.usergroupMembership.push(
                {
                    groupID: groupID,
                    userName: username,
                    userGroupMembershipCreatedDateTime: this.canvasDate.now('standard'),
                    userGroupMembershipCreatedUserID: currentUser,
                    userGroupMembershipUpdatedDateTime: this.canvasDate.now('standard'),
                    userGroupMembershipUpdatedUserID: currentUser
                }        
            )
        }
    }

    deleteUserGroupMembership(username: string, groupID: number) {
        // Deletes a User - Group record to the User Group Membership
        this.globalFunctionService.printToConsole(this.constructor.name,'deleteUserGroupMembership', '@Start');

        this.usergroupMembership = this.usergroupMembership.filter(
            item => (!(item.userName == username  &&  item.groupID == groupID))
        );
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
        let currentUser: string = '';
        if (this.globalVariableService.canvasUser.getValue() != null) {
            currentUser = this.globalVariableService.canvasUser.getValue().username;
        }

        // Only add if not already there
        if (!found) {
            this.groupDatasourceAccess.push(
                {
                    groupID: groupID,
                    datasourceID: datasourceID,
                    groupDatasourceAccessAccessType: 'Read',
                    groupDatasourceAccessCreatedDateTime: this.canvasDate.now('standard'),
                    groupDatasourceAccessCreatedUserID: currentUser,
                    groupDatasourceAccessUpdatedDateTime: this.canvasDate.now('standard'),
                    groupDatasourceAccessUpdatedUserID: currentUser
                }        
            )
        }
    }

    deleteGroupDatasourceAccess(datasourceID: number, groupID: number) {
        // Deletes a Datasource - Group record from the DB
        this.globalFunctionService.printToConsole(this.constructor.name,'deleteGroupDatasourceAccess', '@Start');

        this.groupDatasourceAccess = this.groupDatasourceAccess.filter(
            item => (!(item.datasourceID == datasourceID  &&  item.groupID == groupID))
        );
    }

    getDashboardGroupMembership(dashboardID:number = -1, include:boolean = true): Promise<DashboardGroup[]> {
        // Return a list of Dashboard - Group memberships
        // - dashboardID Optional parameter to select ONE (if >= 0), else select ALL (if = 0)
        // - include Optional parameter, true = include all for one, else 
        //   group NOT for dashboardID

        this.globalFunctionService.printToConsole(this.constructor.name,'getDashboardGroupMembership', '@Start');

        // TODO - from DB
        // Get Array of groups to in or ex clude
        let resultDashboardGroupMembership: number[] = [];

        // Return all if no dashboardID specified
        if (dashboardID == -1) {
            return Promise.resolve(this.dashboardGroups);
        }

        // Make an array of groupIDs to which this user belongs
        else {
            this.dashboardGroupMembership.forEach(
                (dashgrp) => { 
                                if (dashgrp.dashboardID == dashboardID) 
                                    resultDashboardGroupMembership.push(
                                        dashgrp.dashboardGroupID
                                )  
                             }
            )   
        }

        // Return necesary groups, selectively depending on in/exclude
        let resultDashboardGroups: DashboardGroup[];
        resultDashboardGroups = this.dashboardGroups.filter(
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
        return Promise.resolve(resultDashboardGroups);
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
        let currentUser: string = '';
        if (this.globalVariableService.canvasUser.getValue() != null) {
            currentUser = this.globalVariableService.canvasUser.getValue().username;
        }

        // Only add if not already there
        if (!found) {
            this.dashboardGroupMembership.push(
                {

                    dashboardGroupID: dashboardGroupID,
                    dashboardID: dashboardID,
                    dashboardGroupMembershipCreatedDateTime: this.canvasDate.now('standard'),
                    dashboardGroupMembershipCreatedUserID: currentUser,
                    dashboardGroupMembershipUpdatedDateTime: this.canvasDate.now('standard'),
                    dashboardGroupMembershipUpdatedUserID: currentUser
                }        
            )
        }
    }

    deleteDashboardGroupMembership(dashboardID: number, dashboardGroupID: number) {
        // Deletes a Dashboard - Group record to the Dashboard Group Membership
        this.globalFunctionService.printToConsole(this.constructor.name,'deleteDashboardGroupMembership', '@Start');

        this.dashboardGroupMembership = this.dashboardGroupMembership.filter(
            item => (!(item.dashboardID == dashboardID  &&  
                       item.dashboardGroupID == dashboardGroupID))
        );
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
        ): Promise<User[]> { 
        // Return users with a given relationship to any Dashboard
        // - dashboardID for this Dashboard
        // - relationshipType for this Relationship
        // - include: True = include, False = give complement (NOT related)
        // - username Optional filter
        this.globalFunctionService.printToConsole(this.constructor.name, 'getUsersRelatedToDashboard', '@Start');

        // Get Array of UserIDs that are related to this Dashboard, or Not if include = false
        let userIDs: string[] = [];
        this.dashboardUserRelationship.forEach(dur => {
            if (dur.dashboardID == dashboardID 
                &&  
                dur.dashboardUserRelationshipType == relationshipType
                &&
                (username == '*'  ||  dur.userName == username ) ) {
                    userIDs.push(dur.userName);
            }
        });

        // Return necesary groups, selectively depending on in/exclude
        // Struggle Avoidance Technique: set as [] upfront, else .IndexOf undefined fails
        let resultUsers: User[] = [];
        return this.getUsers()
                .then( usr => {
                    resultUsers = usr.filter(
                        u => {
                                if ( (include  &&  userIDs.indexOf(u.userName) >= 0 ) 
                                    ||
                                   (!include  &&  userIDs.indexOf(u.userName) < 0) ) {
                                    return u
                                }
                        }
                    );   
                    return resultUsers;
                })
            .catch(error => console.log (error) )
    }

    addDashboardGroupRelationship(
        dashboardID: number, 
        groupID: number, 
        relationshipType: string) {
        // Removes user from a Dashboard Relationship
        this.globalFunctionService.printToConsole(this.constructor.name,'addDashboardGroupRelationship', '@Start');

        let currentUser: string = '';
        if (this.globalVariableService.canvasUser.getValue() != null) {
            currentUser = this.globalVariableService.canvasUser.getValue().username;
        }

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
            let currentUser: string = '';
            if (this.globalVariableService.canvasUser.getValue() != null) {
                currentUser = this.globalVariableService.canvasUser.getValue().username;
            }
            this.dashboardGroupRelationship.push(
                {
                    dashboardGroupRelationshipID: 0,
                    dashboardID: dashboardID,
                    groupID: groupID,
                    dashboardGroupRelationshipType: relationshipType,
                    dashboardGroupRelationshipRating: 0,
                    dashboardGroupRelationshipCreatedDateTime: 
                        this.canvasDate.now('standard'),
                    dashboardGroupRelationshipCreatedUserID: currentUser,
                    dashboardGroupRelationshipUpdatedDateTime: 
                        this.canvasDate.now('standard'),
                    dashboardGroupRelationshipUpdatedUserID: currentUser
                });
        }
    }

    deleteDashboardGroupRelationship(
        dashboardID: number, 
        groupID: number, 
        relationshipType: string) {
        // Removes Group from a Dashboard Relationship
        this.globalFunctionService.printToConsole(this.constructor.name,'deleteDashboardGroupRelationship', '@Start');

        let currentUser: string = '';
        if (this.globalVariableService.canvasUser.getValue() != null) {
            currentUser = this.globalVariableService.canvasUser.getValue().username;
        }
        
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
    }

    addDashboardUserRelationship(
        dashboardID: number, 
        username: string, 
        relationshipType: string) {
        // Add user from a Dashboard Relationship
        this.globalFunctionService.printToConsole(this.constructor.name,'addDashboardUserRelationship', '@Start');

        let currentUser: string = '';
        if (this.globalVariableService.canvasUser.getValue() != null) {
            currentUser = this.globalVariableService.canvasUser.getValue().username;
        }

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
            let currentUser: string = '';
            if (this.globalVariableService.canvasUser.getValue() != null) {
                currentUser = this.globalVariableService.canvasUser.getValue().username;
            }
            this.dashboardUserRelationship.push(
                {
                    dashboardUserRelationshipID: 0,
                    dashboardID: dashboardID,
                    userName: username,
                    dashboardUserRelationshipType: relationshipType,
                    dashboardUserRelationshipRating: 0,
                    dashboardUserRelationshipCreatedDateTime: 
                        this.canvasDate.now('standard'),
                    dashboardUserRelationshipCreatedUserID: currentUser,
                    dashboardUserRelationshipUpdatedDateTime: 
                        this.canvasDate.now('standard'),
                    dashboardUserRelationshipUpdatedUserID: currentUser
                });
        }
    }

    deleteDashboardUserRelationship(
        dashboardID: number, 
        username: string, 
        relationshipType: string) {
        // Removes user from a Dashboard Relationship
        this.globalFunctionService.printToConsole(this.constructor.name,'deleteDashboardUserRelationship', '@Start');

        let currentUser: string = '';
        if (this.globalVariableService.canvasUser.getValue() != null) {
            currentUser = this.globalVariableService.canvasUser.getValue().username;
        }
        
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
    }

    getDataSources(dashboardID: number = -1) {
        // List of Data Sources
        // - dashboardID is optional Dashboard to filter on
        // Note: Dashboard <1-many> Widget <1-1> Report <1-1> DataSource
        // TODO - agree design to integrate with Overlay, and do in DB
        this.globalFunctionService.printToConsole(this.constructor.name,'getDataSources', '@Start');

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

    getCanvasMessages(dashboardID: number = -1, reportID: number = -1, widgetID: number = -1) {
        // Returns CanvasMessages
        // - dashboardID Optional filter, -1 = all
        // - reportID Optional filter, -1 = all
        // - widgetID Optional filter, -1 = all
        this.globalFunctionService.printToConsole(this.constructor.name,'getCanvasMessages', '@Start');

        // Return the necessary
        let found: boolean = false;
        let myStatus: string = '';
        let username: string = ''; 
        if (this.globalVariableService.canvasUser.getValue() != null) {
            username = this.globalVariableService.canvasUser.getValue().username;
        }
        return this.canvasMessages.filter(cm => {
            if (
                (dashboardID == -1  || cm.messageDashboardID == dashboardID)  
                &&
                (reportID == -1     || cm.messageReportID == reportID)
                &&
                (widgetID == -1     || cm.messageWidgetID == widgetID)
            ) {
                // Determine calced fields: messageSentToMe, messageMyStatus, etc
                for (var i = 0; i < this.canvasMessages.length; i++) {
                    found = false;
                    myStatus= '';

                    for (var j = 0; j < this.canvasMessages[i].messageRecipients.length; j++) {

                        if (this.canvasMessages[i].messageRecipients[j].messageRecipientUserID == 
                            username) {
                                found = true;
                                myStatus = this.canvasMessages[i].messageRecipients[j].
                                    messageRecipientStatus;
                            }
                    };

                    this.canvasMessages[i].messageMyStatus = myStatus
                    if (found) {
                        this.canvasMessages[i].messageSentToMe = true;
                    } else {
                        this.canvasMessages[i].messageSentToMe = false;
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

        // Return the necessary
        let username: string = ''; 
        if (this.globalVariableService.canvasUser.getValue() != null) {
            username = this.globalVariableService.canvasUser.getValue().username;
        }
        for (var i = 0; i < this.canvasMessages.length; i++) {
            if (this.canvasMessages[i].messageID == messageID) {
                for (var j = 0; j < this.canvasMessages[i].messageRecipients.length; j++) {
                    if (this.canvasMessages[i].messageRecipients[j].messageRecipientUserID == 
                            username) {
                                if (this.canvasMessages[i].messageRecipients[j].
                                    messageRecipientStatus == 'Read') {
                                        this.canvasMessages[i].messageRecipients[j].
                                            messageRecipientStatus = 'UnRead';
                                }
                                else {
                                    this.canvasMessages[i].messageRecipients[j].
                                        messageRecipientStatus = 'Read';
                                }
                    }
                }
            }
        }
    }

}
