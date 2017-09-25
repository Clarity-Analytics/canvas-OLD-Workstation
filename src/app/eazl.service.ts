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
// The End
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
import { CanvasMessageFlat }          from './model.canvasMessage';
import { CanvasMessageRecipient }     from './model.canvasMessageRecipient';
import { CanvasUser }                 from './model.user';
import { Dashboard }                  from './model.dashboards';
import { DashboardGroupPermissions }  from './model.dashboards';
import { DashboardTagMembership }     from './model.dashboardTagMembership';
import { DashboardTab }               from './model.dashboardTabs';
import { DashboardUserPermissions }   from './model.dashboards';
import { DataSource }                 from './model.datasource';
import { DataSourceGroupPermissions}  from './model.datasource';
import { DataSourceUserPermissions}   from './model.datasource';
import { EazlAppData }                from './model.appdata';
import { EazlCanvasMessage }          from './model.canvasMessage';
import { EazlCanvasMessageRecipient } from './model.canvasMessageRecipient';
import { EazlDashboardGroupPermissions }    from './model.dashboards';
import { EazlDashboardUserPermissions }     from './model.dashboards';
import { EazlDataSourceGroupPermissions}    from './model.datasource';
import { EazlDataSourceUserPermissions}     from './model.datasource';
import { EazlDashboard }              from './model.dashboards';
import { EazlDashboardTagMembership } from './model.dashboardTagMembership';
import { EazlDashboardTab }           from './model.dashboardTabs';
import { EazlDataSource }             from './model.datasource';
import { EazlFilter }                 from './model.filter';
import { EazlGroup }                  from './model.group';
import { EazlGroupDatasourceAccess }  from './model.groupDSaccess';
import { EazlPackageTask }            from './model.package.task';
import { EazlReport }                 from './model.report';
import { EazlReportHistory }          from './model.reportHistory';
import { EazlReportWidgetSet }        from './model.report.widgetSets';
import { EazlSystemConfiguration }    from './model.systemconfiguration';
import { EazlUser }                   from './model.user';
import { EazlUserModelPermission }    from './model.userModelPermissions';
import { EazlWidget }                 from './model.widget';
import { EazlWidgetTemplate }         from './model.widgetTemplates';
import { Filter }                     from './model.filter';
import { GraphType }                  from './model.graph.type';
import { Group }                      from './model.group';
import { GroupDatasourceAccess }      from './model.groupDSaccess';
import { PackageTask }                from './model.package.task';
import { Report }                     from './model.report';
import { ReportHistory }              from './model.reportHistory';
import { ReportWidgetSet }            from './model.report.widgetSets';
import { SelectedItem }               from './model.selectedItem';
import { SystemConfiguration }        from './model.systemconfiguration';
import { User }                       from './model.user';
import { UserModelPermission }        from './model.userModelPermissions';
import { WebSocketRefDataMessage }    from './model.notification';
import { WebSocketBasicMessage }      from './model.notification';
import { WebSocketCanvasMessage }     from './model.notification';

import { Widget }                     from './model.widget';
import { WidgetTemplate }             from './model.widgetTemplates';
import { WidgetType }                 from './model.widget.type';

// Token for RESTi
export interface Token {
	token: string;
}

var req = new XMLHttpRequest();

// Constants
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

//const DATASOURCES
    // export const DATASOURCES: DataSource[] =[]
    // [
    //     {
    //         datasourceID: 0,
    //         datasourceName: 'Overlay Packages',
    //         datasourceDescription: 'Complete list of packages on Overlay',
    //         datasourceDBname: '',
    //         datasourceSource: '',
    //         datasourceDBType: '',
    //         datasourceDBconnectionProd: '',
    //         datasourceDBconnectionTest: '',
    //         datasourceEnvironment: '',
    //         datasourceDataQuality: '',
    //         datasourceDataIssues: [
    //             {
    //                 dataIssueCreatedDate: '',
    //                 dataIssueCreatedUserName: '',
    //                 dataIssueDescription: '',
    //                 dataIssueStatus: '',
    //             }
    //         ],
    //         datasourceMaxRowsReturned: 0,
    //         datasourceDefaultReturnFormat: '',
    //         datasourceUserEditable: false,
    //         packagePk: 0,
    //         packageName: '',
    //         packageRepository: '',
    //         packageCompiled: false,
    //         datasourceParameters:
    //         [
    //             {
    //                 name: '',
    //                 value: '',
    //                 parser: '',
    //             }
    //         ],
    //         datasourceFields: [                     // Array of Django fields
    //             {
    //                 name: '',
    //                 dtype: '',
    //             }
    //         ],
    //         datasourceQueries: [
    //             {
    //                 name : '',
    //                 parameters : '',
    //             }
    //         ],
    //         datasourceDateLastSynced: '',
    //         datasourceLastSyncSuccessful: false,
    //         datasourceLastSyncError: '',
    //         datasourceLastRuntimeError: '',
    //         datasourceExecuteURL: '',
    //         datasourceUrl: '',
    //         datasourceSQL: '',
    //         datasourceCreatedDateTime: '',
    //         datasourceCreatedUserName: '',
    //         datasourceUpdatedDateTime: '',
    //         datasourceUpdatedUserName: ''
    //     },
    //     {
    //         datasourceID: 1,
    //         datasourceName: 'Overlay Reports',
    //         datasourceDescription: 'Complete list of reports on Overlay',
    //         datasourceDBname: '',
    //         datasourceSource: '',
    //         datasourceDBType: '',
    //         datasourceDBconnectionProd: '',
    //         datasourceDBconnectionTest: '',
    //         datasourceEnvironment: '',
    //         datasourceDataQuality: '',
    //         datasourceDataIssues: [
    //             {
    //                 dataIssueCreatedDate: '',
    //                 dataIssueCreatedUserName: '',
    //                 dataIssueDescription: '',
    //                 dataIssueStatus: '',
    //             }
    //         ],
    //         datasourceMaxRowsReturned: 0,
    //         datasourceDefaultReturnFormat: '',
    //         datasourceUserEditable: false,
    //         packagePk: 0,
    //         packageName: '',
    //         packageRepository: '',
    //         packageCompiled: false,
    //         datasourceParameters:
    //         [
    //             {
    //                 name: '',
    //                 value: '',
    //                 parser: '',
    //             }
    //         ],
    //         datasourceFields: [                     // Array of Django fields
    //             {
    //                 name: '',
    //                 dtype: '',
    //             }
    //         ],
    //         datasourceQueries: [
    //             {
    //                 name : '',
    //                 parameters : '',
    //             }
    //         ],
    //         datasourceDateLastSynced: '',
    //         datasourceLastSyncSuccessful: false,
    //         datasourceLastSyncError: '',
    //         datasourceLastRuntimeError: '',
    //         datasourceExecuteURL: '',
    //         datasourceUrl: '',
    //         datasourceSQL: '',
    //         datasourceCreatedDateTime: '',
    //         datasourceCreatedUserName: '',
    //         datasourceUpdatedDateTime: '',
    //         datasourceUpdatedUserName: ''
    //     }
    // ];

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
                dashboardTabID: 1,
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
                color: 'gray',
                fontSize: 1,
                height: 360,
                left: 650,
                widgetTitle: 'Weather forecast',
                top: 80,
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
                            {"x": 10, "y": 28, "c":0}, {"x": 10, "y": 55, "c":1},
                            {"x": 11, "y": 43, "c":0}, {"x": 11, "y": 91, "c":1},
                            {"x": 12, "y": 81, "c":0}, {"x": 12, "y": 53, "c":1},
                            {"x": 13, "y": 19, "c":0}, {"x": 13, "y": 87, "c":1},
                            {"x": 14, "y": 52, "c":0}, {"x": 14, "y": 48, "c":1},
                            {"x": 15, "y": 24, "c":0}, {"x": 15, "y": 49, "c":1},
                            {"x": 16, "y": 87, "c":0}, {"x": 16, "y": 66, "c":1},
                            {"x": 17, "y": 17, "c":0}, {"x": 17, "y": 27, "c":1},
                            {"x": 18, "y": 68, "c":0}, {"x": 18, "y": 16, "c":1},
                            {"x": 19, "y": 49, "c":0}, {"x": 19, "y": 15, "c":1}
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
                widgetID: 2,
                dashboardID: 0,
                dashboardName: 'Collection of Bar charts',
                dashboardTabID: 1,
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
                backgroundColor: 'transparent',
                border: '1px solid black',
                boxShadow: '',
                color: 'brown',
                fontSize: 1,
                height: 360,
                left: 240,
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
                dashboardTabID: 1,
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
                dashboardID: 2,
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
                dashboardID: 2,
                dashboardName: 'Collection of Pie charts',
                dashboardTabID: 3,
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
                dashboardID: 2,
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
// const REPORTS
    // export const REPORTS: Report[] =
    //     [
    //         {
    //             "reportID": 1,
    //             "reportCode": 'EDM Val',
    //             "reportName": "EDM weekly Values",
    //             "reportDescription": 'Description ...  etc arranged by Date',
    //             "dataSourceID": 0,
    //             "reportPackagePermissions": [
    //                 {"package_permission": "add_package"},
    //                 {"package_permission": "assign_permission_package"},
    //                 {"package_permission": "change_package"},
    //                 {"package_permission": "delete_package"},
    //                 {"package_permission": "execute_package"},
    //                 {"package_permission": "package_owned_access"},
    //                 {"package_permission": "package_shared_access"},
    //                 {"package_permission": "remove_permission_package"},
    //                 {"package_permission": "view_package"}
    //             ],
    //             "reportSpecification": '',
    //             "reportFields": [
    //                 {
    //                     "name": "category",
    //                     "alias": "category",
    //                     "aggfunc": null,
    //                     "scalarfunc": null
    //                 },
    //                 {
    //                     "name": "amount",
    //                     "alias": "amount",
    //                     "aggfunc": "sum",
    //                     "scalarfunc": null
    //                 }
    //             ],
    //             "reportFieldsString": "InvoiceDate Total ",
    //             "reportExecute": "http://localhost:8000/api/queries/2/execute-query/",
    //             "reportPermissions": [
    //                 {"permission": "add_query"},
    //                 {"permission": "assign_permission_query"},
    //                 {"permission": "change_query"},
    //                 {"permission": "delete_query"},
    //                 {"permission": "remove_permission_query"},
    //                 {"permission": "view_query"}
    //             ],
    //             "reportChecksum": '',
    //             "reportVersion": '',
    //             "reportFetch": '',
    //             "reportCreatedUserName": 'janniei',
    //             "reportCreatedDateTime": '2017/05/01',
    //             "reportUpdatedUserName": 'janniei',
    //             "reportUpdatedDateTime": '2017/05/01',
    //             "reportUrl": "http://localhost:8000/api/queries/2/",
    //             "reportData":
    //                     [
    //                         {"category": "A0", "amount": 38},
    //                         {"category": "B0", "amount": 45},
    //                         {"category": "C0", "amount": 53},
    //                         {"category": "D0", "amount": 61},
    //                         {"category": "E0", "amount": 71},
    //                         {"category": "F0", "amount": 83},
    //                         {"category": "G0", "amount": 99},
    //                         {"category": "H0", "amount": 107}
    //                     ],
    //         },
    //         {
    //             "reportID": 2,
    //             "reportCode": 'Bond Val',
    //             "reportName": "Bond monthly Values",
    //             "reportDescription": 'Description ...  etc arranged by Date',
    //             "dataSourceID": 1,
    //             "reportPackagePermissions": [
    //                 {"package_permission": "add_package"},
    //                 {"package_permission": "assign_permission_package"},
    //                 {"package_permission": "change_package"},
    //                 {"package_permission": "delete_package"},
    //                 {"package_permission": "execute_package"},
    //                 {"package_permission": "package_owned_access"},
    //                 {"package_permission": "package_shared_access"},
    //                 {"package_permission": "remove_permission_package"},
    //                 {"package_permission": "view_package"}
    //             ],
    //             "reportSpecification": '',
    //             "reportFields": [
    //                 {
    //                     "name": "category",
    //                     "alias": "category",
    //                     "aggfunc": null,
    //                     "scalarfunc": null
    //                 },
    //                 {
    //                     "name": "amount",
    //                     "alias": "amount",
    //                     "aggfunc": "sum",
    //                     "scalarfunc": null
    //                 }
    //             ],
    //             "reportFieldsString": "InvoiceDate Total ",
    //             "reportExecute": "http://localhost:8000/api/queries/2/execute-query/",
    //             "reportPermissions": [
    //                 {"permission": "add_query"},
    //                 {"permission": "assign_permission_query"},
    //                 {"permission": "change_query"},
    //                 {"permission": "delete_query"},
    //                 {"permission": "remove_permission_query"},
    //                 {"permission": "view_query"}
    //             ],
    //             "reportChecksum": '',
    //             "reportVersion": '',
    //             "reportFetch": '',
    //             "reportCreatedUserName": 'janniei',
    //             "reportCreatedDateTime": '2017/05/01',
    //             "reportUpdatedUserName": 'janniei',
    //             "reportUpdatedDateTime": '2017/05/01',
    //             "reportUrl": "http://localhost:8000/api/queries/2/",
    //             "reportData":
    //                     [
    //                         {"category": "A0", "amount": 38},
    //                         {"category": "B0", "amount": 45},
    //                         {"category": "C0", "amount": 53},
    //                         {"category": "D0", "amount": 61},
    //                         {"category": "E0", "amount": 71},
    //                         {"category": "F0", "amount": 83},
    //                         {"category": "G0", "amount": 99},
    //                         {"category": "H0", "amount": 107}
    //                     ],
    //         }

    //         // {
    //         //     reportID: 1,
    //         //     reportCode: 'EDM Val',
    //         //     reportName: 'EDM weekly Values',
    //         //     description: 'Description ...  etc',
    //         //     reportParameters: '',
    //         //     dataSourceID: 0,
    //         //     dataSourceParameters: '',
    //         //     reportFields:
    //         //         [ "category", "amount"],
    //         //     reportData:
    //         //         [
    //         //             {"category": "A0", "amount": 38},
    //         //             {"category": "B0", "amount": 45},
    //         //             {"category": "C0", "amount": 53},
    //         //             {"category": "D0", "amount": 61},
    //         //             {"category": "E0", "amount": 71},
    //         //             {"category": "F0", "amount": 83},
    //         //             {"category": "G0", "amount": 99},
    //         //             {"category": "H0", "amount": 107}
    //         //         ],
    //         //     reportCreatedDateTime: '2017/05/01',
    //         //     reportCreatedUserName: 'jannie'
    //         // },
    //         // {
    //         //     reportID: 2,
    //         //     reportCode: 'Bond Val',
    //         //     reportName: 'Bond monthly Values',
    //         //     description: 'Description ...  etc',
    //         //     reportParameters: '',
    //         //     dataSourceID: 1,
    //         //     dataSourceParameters: '',
    //         //     reportFields:
    //         //         [ "category", "amount"],
    //         //     reportData:
    //         //         [
    //         //             {"category": "A22", "amount": 108},
    //         //             {"category": "B22", "amount": 115},
    //         //             {"category": "C22", "amount": 123},
    //         //             {"category": "D22", "amount": 131},
    //         //             {"category": "E22", "amount": 144},
    //         //             {"category": "F22", "amount": 153},
    //         //             {"category": "G22", "amount": 169},
    //         //             {"category": "H22", "amount": 177}
    //         //         ],
    //         //     reportCreatedDateTime: '2017/05/01',
    //         //     reportCreatedUserName: 'jannie'
    //         // }
    //     ];
// Need to fix groups/model-permissions for this ...
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
    fontWeightDropdown: SelectItem[];                       // List of FontWeight dropwdown options
    gridSizeDropdowns: SelectItem[];                        // List of Grid Size dropdown options
    textMarginDropdowns: SelectItem[];                      // List of Margins for text box dropdown options
    textPaddingDropdowns: SelectItem[];                     // List of Text Padding dropdown options
    textPositionDropdowns: SelectItem[];                    // List of Text Position dropdown options
    textAlignDropdowns: SelectItem[];                       // List of Text alignment options
    imageSourceDropdowns: SelectItem[];                     // List of Image Source file dropdown options
    backgroundImageDropdowns: SelectItem[];                 // List of backgrounds for dropdown options
    canvasMessages: CanvasMessage[] = [];                   // List of CanvasMessages
    canvasMessageRecipients: CanvasMessageRecipient[] = []; // List of canvasMessageRecipients
    dashboards: Dashboard[];                                // List of Dashboards
    dashboardTagMembership: DashboardTagMembership[];       //List of Dashboard-Group
    dashboardTabs: DashboardTab[];                          // List of Dashboard Tabs
    datasources: DataSource[];                // List of Data Sources
    graphTypes: GraphType[];                                // List of Graph Types
    groups: Group[];                                        // List of Groups
    groupDatasourceAccess: GroupDatasourceAccess[] = GROUPDATASOURCEACCESS;     // List of group access to DS
    isStaffDropdown: SelectItem[] = ISSTAFFDROPDOWN;        // List of IsStaff dropdown options
    packageTask: PackageTask[] = [];                        // List of PackageTask
    reports: Report[];                                      // List of Reports
    reportHistory: ReportHistory[];                         // List of Report History (ran)
    reportWidgetSet: ReportWidgetSet[] = REPORTWIDGETSET;   // List of WidgetSets per Report
    storage: Storage = isDevMode() ? window.localStorage: window.sessionStorage;
    isSuperuserDropdown: SelectItem[] = ISSUPERUSERDROPDOWN;// List of IsSuperUser options for Dropdown
    systemConfiguration: SystemConfiguration;               // System wide settings
    userModelPermissions: UserModelPermission[];            // List of model permissions per user
    users: User[] = [];                                     // List of Users
    widgets: Widget[] = WIDGETS;                            // List of Widgets for a selected Dashboard
    widgetTemplates: WidgetTemplate[] = []                  // List of Widget Templates
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
        if (this.globalVariableService.dirtyDataSystemConfiguration) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'SystemConfiguration is dirty / not up to date',
                detail:   'The SystemConfiguration data is being refreshed; request again to get the latest from the database'
            });
        }

        this.globalFunctionService.printToConsole(this.constructor.name,'getSystemConfiguration', '@Start');

        return this.systemConfiguration;
    }

    updateSystemConfiguration(systemConfiguration: SystemConfiguration) {
        // Updates SystemConfiguration, and also refresh (.next) global variables
        // - systemConfiguration New data
        this.globalFunctionService.printToConsole(this.constructor.name,'updateSystemConfiguration', '@Start');

        // Mark as dirty
        this.globalVariableService.dirtyDataSystemConfiguration = true;

        return this.put<EazlSystemConfiguration>(
            'system-configuration/' + systemConfiguration.systemConfigurationID.toString() + '/',
            this.cdal.saveSystemConfiguration(systemConfiguration)
            )
                .toPromise()
                .then(eazSystemConfiguration => {

                    // Update Global Variables
                    this.globalVariablesSystemConfiguration(systemConfiguration);

                    // Store in DB
                    this.cdal.saveSystemConfiguration(systemConfiguration);

                    // Update local array
                    this.systemConfiguration = systemConfiguration;

                    // Mark as clean
                    this.globalVariableService.dirtyDataSystemConfiguration = false;

                    this.globalVariableService.growlGlobalMessage.next({
                        severity: 'info',
                        summary:  'Update SystemConfig',
                        detail:   'Successfully updated SystemConfiguration in the database'
                    });

                    // Return the data
                    return this.systemConfiguration;
                } )
                .catch(error => {
                    this.globalVariableService.growlGlobalMessage.next({
                        severity: 'warn',
                        summary:  'Update SystemConfig',
                        detail:   'Unsuccessful in updating SystemConfiguration to the database'
                    });
                    error.message || error
                })

    }

    globalVariablesSystemConfiguration(systemConfiguration: SystemConfiguration) {
        //  Refresh (.next) global variables
        // - systemConfiguration New data
        this.globalFunctionService.printToConsole(this.constructor.name,'globalVariablesSystemConfiguration', '@Start');

        // Update local values that have changed
        this.globalVariableService.systemConfigurationID = systemConfiguration.systemConfigurationID;

        if (systemConfiguration.companyName != this.systemConfiguration.companyName) {
            this.globalVariableService.companyName = this.systemConfiguration.companyName;
        }
        if (systemConfiguration.companyLogo != this.systemConfiguration.companyLogo) {
            this.globalVariableService.companyLogo = systemConfiguration.companyLogo;
        }
        if (systemConfiguration.backendUrl != this.systemConfiguration.backendUrl) {
            this.globalVariableService.backendUrl = systemConfiguration.backendUrl
        }
        if (systemConfiguration.defaultDaysToKeepResultSet != this.systemConfiguration.defaultDaysToKeepResultSet) {
            this.globalVariableService.defaultDaysToKeepResultSet = systemConfiguration.defaultDaysToKeepResultSet;
        }
        if (systemConfiguration.maxRowsDataReturned != this.systemConfiguration.maxRowsDataReturned) {
            this.globalVariableService.maxRowsDataReturned = systemConfiguration.maxRowsDataReturned;
        }
        if (systemConfiguration.maxRowsPerWidgetGraph != this.systemConfiguration.maxRowsPerWidgetGraph) {
            this.globalVariableService.maxRowsPerWidgetGraph = systemConfiguration.maxRowsPerWidgetGraph;
        }

    }

    logout(username: string) {
        // Logout user from backend
        this.globalFunctionService.printToConsole(this.constructor.name,'logout', '@Start');

        this.globalVariableService.canvasUser.next(new CanvasUser);
        this.globalVariableService.isAuthenticatedOnEazl = false;
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
                        let average_warning_runtime: number = 0;
                        let dashboard_id_at_startup: number = -1;
                        let dashboard_tab_id_at_startup: number = -1;
                        let environment: string = '';
                        let frontend_color_scheme: string = '';
                        let default_report_filters: string = '';
                        let default_widget_configuration: string = '';
                        let grid_size: number = 3;
                        let growl_life: number = 3;
                        let growl_sticky: boolean = false;
                        let snap_to_grid: boolean = false;

                        if (eazlUser.profile != null) {
                            nick_name = eazlUser.profile.nick_name;
                            cell_number = eazlUser.profile.cell_number;
                            work_number = eazlUser.profile.work_number;
                            profile_picture = eazlUser.profile.profile_picture;
                            average_warning_runtime = eazlUser.average_warning_runtime;
                            dashboard_id_at_startup = eazlUser.dashboard_id_at_startup;
                            dashboard_tab_id_at_startup = eazlUser.dashboard_tab_id_at_startup;
                            environment = eazlUser.environment;
                            frontend_color_scheme = eazlUser.frontend_color_scheme;
                            default_report_filters = eazlUser.default_report_filters;
                            default_widget_configuration = eazlUser.default_widget_configuration;
                            grid_size = eazlUser.grid_size;
                            growl_life = eazlUser.growl_life;
                            growl_sticky = eazlUser.growl_sticky;
                            snap_to_grid = eazlUser.snap_to_grid;
                        } else {
                            nick_name = '';
                            cell_number = '';
                            work_number = '';
                            profile_picture = '';
                            average_warning_runtime = 3;
                            dashboard_id_at_startup = -1;
                            dashboard_tab_id_at_startup = -1;
                            environment = '';
                            frontend_color_scheme = '';
                            default_report_filters = '';
                            default_widget_configuration = '';
                            grid_size = 3;
                            growl_life = 3;
                            growl_sticky = false;
                            snap_to_grid = false;
                        }
                        this.globalVariableService.canvasUser.next({
                            id: eazlUser.id,
                            username: eazlUser.username,
                            first_name: eazlUser.first_name,
                            last_name: eazlUser.last_name,
                            email: eazlUser.email,
                            password: eazlUser.password,
                            is_superuser: eazlUser.is_superuser,
                            is_staff: eazlUser.is_staff,
                            is_active: eazlUser.is_active,
                            date_joined: eazlUser.date_joined,
                            groups: eazlUser.groups,
                            last_login: eazlUser.last_login,
                            profile:
                                {
                                    nick_name:  nick_name,
                                    cell_number: cell_number,
                                    work_number: work_number,
                                    profile_picture: profile_picture,
                                    query_runtime_warning : average_warning_runtime,
                                    startup_dashboard_id : dashboard_id_at_startup,
                                    startup_dashboard_tab_id: dashboard_tab_id_at_startup,
                                    environment : environment,
                                    color_scheme : frontend_color_scheme,
                                    default_report_filters : default_report_filters,
                                    default_widget_configuration : default_widget_configuration,
                                    grid_size : grid_size,
                                    growl_life : growl_life,
                                    growl_sticky : growl_sticky,
                                    snap_to_grid : snap_to_grid
                                }
                        });

                        // Refresh global variables
                        this.globalVariableService.isAuthenticatedOnEazl = true;
                        this.globalVariablesUsers(this.cdal.loadUser(eazlUser));

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
        this.globalVariableService.isAuthenticatedOnEazl = false;
        return Promise.reject(error.message || error);
    }

    changePassword(username: string, newPassword: string): string {
        // Change the password for a user
        // Return '' if good, else return error message
        this.globalFunctionService.printToConsole(this.constructor.name,'changePassword', '@Start');

        // TODO - this must be done in DB. Finalise this with Bradley
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
        // TODO - Error Handling: figure out why this guy errors when there is an http-error - finalise this with Bradley
        // this.globalFunctionService.printToConsole(this.constructor.name,'handleError', '@Start');

        var error: string = '';
         // Do some logging one day
        if (response instanceof Response) {
            // TODO - Error Handling: this must be sorted IF return is html - since it errors (in the error) - finalise this with Bradley
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

    put<T>(route: string, data: Object): Observable<any> {
        // Post to http
        this.globalFunctionService.printToConsole(this.constructor.name,'put-http', '@Start');

        return this.http.put(this.prepareRoute(route), JSON.stringify(data), this.httpOptions)
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

    delete<T>(route: string): Observable<any> {
        // Post to http
        this.globalFunctionService.printToConsole(this.constructor.name,'delete-http', '@Start');

        return this.http.delete(this.prepareRoute(route), this.httpOptions)
            .map(this.parseResponse)
            .catch(this.handleError);
    }

    addUser(user: User) {
        // Adds a new User to the DB
        this.globalFunctionService.printToConsole(this.constructor.name,'addUser', '@Start');

        // Mark as dirty
        this.globalVariableService.dirtyDataUser = true;

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
                    nick_name: user.profile.nickName,
                    cell_number: user.profile.cellNumber,
                    work_number: user.profile.workTelephoneNumber,
                    profile_picture: user.profile.photoPath
                }
        }

        return this.post<EazlUser>('users',workingUser)
                .toPromise()
                .then( eazlUser => {

                    // Update local store
                    user.id = eazlUser.id
                    this.users.push(user);

                    // Not dirty any longer
                    this.globalVariableService.dirtyDataUser = false;

                    this.globalVariableService.growlGlobalMessage.next({
                        severity: 'info',
                        summary:  'Add User',
                        detail:   'Successfully added user to the database'
                    });

                    // Return the data
                    return this.users;
                } )
                .catch(error => {
                    this.globalVariableService.growlGlobalMessage.next({
                        severity: 'warn',
                        summary:  'Add User',
                        detail:   'Unsuccessful in adding user to the database'
                    });
                    error.message || error
                })
    }

    updateUser(user: User) {
        // Updates a single User, and also refresh (.next) global variables
        // - user = data to replace
        this.globalFunctionService.printToConsole(this.constructor.name,'updateUser', '@Start');

        // Mark as dirty
        this.globalVariableService.dirtyDataUser = true;

        return this.put<EazlUser>(
            'users/' + user.id.toString() + '/',
            this.cdal.saveUser(user)
            )
                .toPromise()
                .then(eazlUser => {

                    // Get the index in the users array for the current user
                    let index: number = -1;
                    for (var i = 0; i < this.users.length; i++) {
                        if (user.id == this.users[i].id) {
                            index = i;
                            break;
                        }
                    }
                    if (index == -1) {
                        alert ("Error - current user id in canvasUser not in users object !")
                    }

                    // Update local array
                    this.users[i] = user;

                    // Refresh global variables
                    this.globalVariablesUsers(user);

                    // Mark as clean
                    this.globalVariableService.dirtyDataUser = false;

                    this.globalVariableService.growlGlobalMessage.next({
                        severity: 'warn',
                        summary:  'Update User',
                        detail:   'Successfully updated user in the database'
                    });

                    // Return the data
                    return eazlUser;
                } )
                .catch(error => {
                    this.globalVariableService.growlGlobalMessage.next({
                        severity: 'warn',
                        summary:  'Update User',
                        detail:   'Unsuccessful in updating your User info to the database'
                    });
                    error.message || error
                })
    }

    deleteUser(user: User) {
        // Deletes a User, and also refresh (.next) global variables
        // - user = user to delete
        this.globalFunctionService.printToConsole(this.constructor.name,'deleteUser', '@Start');

        // TODO - finalise this with Bradley
        // Mark as dirty
        this.globalVariableService.dirtyDataUser = true;

        return this.delete<EazlUser>(
            'users/' + user.id.toString() + '/'
            )
                .toPromise()
                .then(response => {

                    // - User: currently selected row
                    let index = -1;
                    for(let i = 0; i < this.users.length; i++) {
                        if(this.users[i].username == user.firstName) {
                            index = i;
                            break;
                        }
                    }
                    this.users.splice(index, 1);

                    this.globalVariableService.growlGlobalMessage.next({
                        severity: 'info',
                        summary:  'Delete User',
                        detail:   'Successfully deleted user from the database'
                    });

                    // Mark as clean
                    this.globalVariableService.dirtyDataUser = false;
                } )
                .catch(error => {
                    this.globalVariableService.growlGlobalMessage.next({
                        severity: 'warn',
                        summary:  'Delete User',
                        detail:   'Unsuccessful in deleting your User info to the database'
                    });
                    error.message || error
                })
    }

    usernameFromUserID(userID: number): string {
        // Return the username for a given userID (blank string if ID not found)
        // - userID to search
        this.globalFunctionService.printToConsole(this.constructor.name,'usernameFromUserID', '@Start');

        let usernameWorking: string = '';

        for (var i = 0; i < this.users.length; i++) {
            if (this.users[i].id == userID) {
                usernameWorking = this.users[i].username;
                break;
            }
        }

        // Return answer
        return usernameWorking;
    }

    userIDfromUserName(username: string): number {
        // Return the userID for a given username (-1 if username not found)
        // - username to search
        this.globalFunctionService.printToConsole(this.constructor.name,'userIDfromUserName', '@Start');

        let userIDWorking: number = -1;

        for (var i = 0; i < this.users.length; i++) {
            if (this.users[i].username == username) {
                userIDWorking = this.users[i].id;
                break;
            }
        }

        // Return answer
        return userIDWorking;
    }

    globalVariablesUsers(user: User) {
        // Refresh (.next) global variables
        // - userthat has changed
        this.globalFunctionService.printToConsole(this.constructor.name,'globalVariablesUsers', '@Start');

        // Update local values that have changed
        this.globalVariableService.averageWarningRuntime = user.profile.averageWarningRuntime;
        this.globalVariableService.startupDashboardID = user.profile.dashboardIDStartup;
        this.globalVariableService.startupDashboardTabID = user.profile.dashboardTabIDStartup;
        this.globalVariableService.environment = user.profile.environment;
        this.globalVariableService.frontendColorScheme = user.profile.frontendColorScheme;
        this.globalVariableService.defaultWidgetConfiguration = user.profile.defaultWidgetConfiguration;
        this.globalVariableService.defaultReportFilters = user.profile.defaultReportFilters;
        this.globalVariableService.growlSticky = user.profile.growlSticky;
        this.globalVariableService.growlLife = user.profile.growlLife;
        this.globalVariableService.gridSize = user.profile.gridSize;
        this.globalVariableService.snapToGrid = user.profile.snapToGrid;
    }

    getUsers(): User[] {
        // Return a list of Users
        this.globalFunctionService.printToConsole(this.constructor.name,'getUsers', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataUser) {
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
        this.globalVariableService.dirtyDataDashboard = true;

        // Update local array
        let index: number = -1;
        for (var i = 0; i < this.dashboards.length; i++) {
            if (this.dashboards[i].dashboardID == dashboardID) {
                this.dashboards[i].isContainerHeaderDark = isContainerHeaderDark;
                index = i;
                break;
            }
        }

        if (index == -1) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'Update Dashboard',
                detail:   'Unsuccessful in updating message in the database for dashboardID: ' 
                 + dashboardID.toString()
            });
            return;
        }

        return this.put<EazlDashboard>(
            'dashboards/' + dashboardID + '/', this.dashboards[index]
            )
                .toPromise()
                .then(eazlDashboard => {

                    // Mark as clean
                    this.globalVariableService.dirtyDataDashboard = false;

                    this.globalVariableService.growlGlobalMessage.next({
                        severity: 'info',
                        summary:  'Update Dashboard',
                        detail:   'Successfully updated dashboard in the database'
                    });

                    // Return the data
                    return eazlDashboard;
                } )
                .catch(error => {
                    this.globalVariableService.growlGlobalMessage.next({
                        severity: 'warn',
                        summary:  'Update Dashboard',
                        detail:   'Unsuccessful in updating dashboard in the database'
                    });
                    error.message || error
                })
    }

    updateDashboardshowContainerHeader(
        dashboardID: number,
        showContainerHeader: boolean){
        // Update showContainerHeader for given dashboard
        // - dashboardID: ID of Dashboard to update
        // - showContainerHeader: new value of showContainerHeader field

        // Mark the data as dirty
        this.globalVariableService.dirtyDataDashboard = true;

        // Update local array
        let index: number = -1;
        for (var i = 0; i < this.dashboards.length; i++) {
            if (this.dashboards[i].dashboardID == dashboardID) {
                this.dashboards[i].showContainerHeader = showContainerHeader;
            }
            index = i;
            break;
        }

        if (index == -1) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'Update Dashboard',
                detail:   'Unsuccessful in updating message in the database for dashboardID: ' 
                + dashboardID.toString()
            });
            return;
        }

        return this.put<EazlDashboard>(
            'dashboards/' + dashboardID + '/', this.dashboards[index]
            )
                .toPromise()
                .then(eazlDashboard => {

                    // Mark as clean
                    this.globalVariableService.dirtyDataDashboard = false;

                    this.globalVariableService.growlGlobalMessage.next({
                        severity: 'info',
                        summary:  'Update Dashboard',
                        detail:   'Successfully updated dashboard in the database'
                    });

                    // Return the data
                    return eazlDashboard;
                } )
                .catch(error => {
                    this.globalVariableService.growlGlobalMessage.next({
                        severity: 'warn',
                        summary:  'Update Dashboard',
                        detail:   'Unsuccessful in updating dashboard in the database'
                    });
                    error.message || error
                })
}

    updateDashboardBackgroundColor(
        dashboardID: number,
        dashboardBackgroundColor: string){
        // Update dashboardBackgroundColor for given dashboard
        // - dashboardID: ID of Dashboard to update
        // - dashboardBackgroundColor: new value of dashboardBackgroundColor field

        // Mark the data as dirty
        this.globalVariableService.dirtyDataDashboard = true;

        // Udpdate local array
        let index: number = -1;
        for (var i = 0; i < this.dashboards.length; i++) {
            if (this.dashboards[i].dashboardID == dashboardID) {
                this.dashboards[i].dashboardBackgroundColor = dashboardBackgroundColor;
                index = i;
                break;
            }
        }

        if (index == -1) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'Update Dashboard',
                detail:   'Unsuccessful in updating message in the database for dashboardID: ' 
                + dashboardID.toString()
            });
            return;
        }

        return this.put<EazlDashboard>(
            'dashboards/' + dashboardID + '/', this.dashboards[index]
            )
                .toPromise()
                .then(eazlDashboard => {

                    // Mark as clean
                    this.globalVariableService.dirtyDataDashboard = false;

                    this.globalVariableService.growlGlobalMessage.next({
                        severity: 'info',
                        summary:  'Update Dashboard',
                        detail:   'Successfully updated dashboard in the database'
                    });

                    // Return the data
                    return eazlDashboard;
                } )
                .catch(error => {
                    this.globalVariableService.growlGlobalMessage.next({
                        severity: 'warn',
                        summary:  'Update Dashboard',
                        detail:   'Unsuccessful in updating dashboard in the database'
                    });
                    error.message || error
                })
    
    }

    updateDashboardBackgroundImageSrc(
        dashboardID: number,
        dashboardBackgroundImageSrc: string){
        // Update dashboardBackgroundImageSrc for given dashboard
        // - dashboardID: ID of Dashboard to update
        // - dashboardBackgroundImageSrc: new value of dashboardBackgroundImageSrc fieldp

        // Mark the data as dirty
        this.globalVariableService.dirtyDataDashboard = true;

        // Update local array
        let index: number = -1;
        for (var i = 0; i < this.dashboards.length; i++) {
            if (this.dashboards[i].dashboardID == dashboardID) {
                this.dashboards[i].dashboardBackgroundImageSrc = dashboardBackgroundImageSrc;
                index = i;
                break;
            }
        }

        if (index == -1) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'Update Dashboard',
                detail:   'Unsuccessful in updating message in the database for dashboardID: ' 
                + dashboardID.toString()
            });
            return;
        }

        return this.put<EazlDashboard>(
            'dashboards/' + dashboardID + '/', this.dashboards[index]
            )
                .toPromise()
                .then(eazlDashboard => {

                    // Mark as clean
                    this.globalVariableService.dirtyDataDashboard = false;

                    this.globalVariableService.growlGlobalMessage.next({
                        severity: 'info',
                        summary:  'Update Dashboard',
                        detail:   'Successfully updated dashboard in the database'
                    });

                    // Return the data
                    return eazlDashboard;
                } )
                .catch(error => {
                    this.globalVariableService.growlGlobalMessage.next({
                        severity: 'warn',
                        summary:  'Update Dashboard',
                        detail:   'Unsuccessful in updating dashboard in the database'
                    });
                    error.message || error
                })
    
    }

    getDashboards(
        dashboardID: number = -1): Dashboard[] {
        // Return a list of Dashboards, with optional filters
        // - dashboardID Optional parameter to select ONE, else select ALL (if >= 0)
        this.globalFunctionService.printToConsole(this.constructor.name,'getDashboards', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataDashboard) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'Dashboard data is dirty / not up to date',
                detail:   'The Dashboard data is being refreshed; request again to get the latest from the database'
            });
        }

        // TODO - when from DB, fill the properties.widgetComments field with the latest
        //        comment from the widgetComments table.  This is used in *ngIf

        // Start with all
        let dashboardsWorking: Dashboard[] = this.dashboards;
        if (this.dashboardTagMembership == null) {
            this.dashboardTagMembership = [];
        }

        // Get current user
        let currentUser: string = this.globalFunctionService.currentUser();

        // Return the filtered result
        if (dashboardsWorking != null) {
            return dashboardsWorking.filter(d =>
                (dashboardID == -1  ||  d.dashboardID == dashboardID))
        } else {
            return dashboardsWorking
        };
    }

    addDashboard(dashboard: Dashboard) {
        // Adds a new Dashboard to the DB
        this.globalFunctionService.printToConsole(this.constructor.name,'addDashboard', '@Start');

        // Mark as dirty
        this.globalVariableService.dirtyDataDashboard = true;
        
        return this.post<EazlDashboard>('dashboards',this.cdal.saveDashboard(dashboard))
            .toPromise()
            .then( eazlDashboard => {

                // Update local store
                dashboard.dashboardID = eazlDashboard.id;
                this.dashboards.push(dashboard);

                // Not dirty any longer
                this.globalVariableService.dirtyDataDashboard = false;

                this.globalVariableService.growlGlobalMessage.next({
                    severity: 'info',
                    summary:  'Add Dashboard',
                    detail:   'Successfully added dashboard to the database'
                });

                // Return the data
                return this.dashboards;
            } )
            .catch(error => {
                this.globalVariableService.growlGlobalMessage.next({
                    severity: 'warn',
                    summary:  'Add Dashboard',
                    detail:   'Unsuccessful in adding dashboard to the database'
                });
                error.message || error
            })

    }

    updateDashboard(dashboard: Dashboard) {
        // Update a given Dashboard
        this.globalFunctionService.printToConsole(this.constructor.name,'updateDashboard', '@Start');

        // Mark the data as dirty
        this.globalVariableService.dirtyDataDashboard = true;

        return this.put<EazlDashboard>(
            'dashboards/' + dashboard.dashboardID.toString() + '/',
            this.cdal.saveDashboard(dashboard)
            )
                .toPromise()
                .then(eazlDashboard => {

                    // Get the index in the Dashboard array
                    let index: number = -1;
                    for (var i = 0; i < this.dashboards.length; i++) {
                        if (dashboard.dashboardID == this.dashboards[i].dashboardID) {
                            index = i;
                            break;
                        }
                    }
                    if (index == -1) {
                        alert ("Error - dashboard id does not exist in the local dashboard object !")
                    }

                    // Update local array
                    this.dashboards[i] = dashboard;

                    // Mark as clean
                    this.globalVariableService.dirtyDataDashboard = false;

                    this.globalVariableService.growlGlobalMessage.next({
                        severity: 'info',
                        summary:  'Update Dashboard',
                        detail:   'Successfully updated dashboard in the database'
                    });

                    // Return the data
                    return eazlDashboard;
                } )
                .catch(error => {
                    this.globalVariableService.growlGlobalMessage.next({
                        severity: 'warn',
                        summary:  'Update Dashboard',
                        detail:   'Unsuccessful in updating your dashboard info to the database'
                    });
                    error.message || error
                })
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
        if (this.globalVariableService.dirtyDataDashboard) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'Dashboard data is dirty / not up to date',
                detail:   'The Dashboard data is being refreshed; request again to get the latest from the database'
            });
        }

        // Get a list of Dashboards
        let dashboardsWorking: Dashboard[] = this.getDashboards(dashboardID);

        // Fill the dropdown format
        let dashboardsSelectItemsWorking: SelectItem[] = [];
        if (dashboardsWorking != null) {
            for (var i = 0; i < dashboardsWorking.length; i++) {
                dashboardsSelectItemsWorking.push({
                    label: dashboardsWorking[i].dashboardName,
                    value: {
                        id: dashboardsWorking[i].dashboardID,
                        name: dashboardsWorking[i].dashboardName
                    }
                });
            };
        };

        return dashboardsSelectItemsWorking;
    }

    getDashboardTabs(selectedDashboardID: number, selectedDashboardTabID?: number): DashboardTab[] {
        // Return a list of Dashboard Tabs for a given DashboardID,
        //   and Optionally if a DashboardTabID was given
        this.globalFunctionService.printToConsole(this.constructor.name,'getDashboardTabs', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataDashboardTab) {
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

    getdashboardTabName(dashboardTabID: number): string {
        // Returns Tab Name of a given dashboardTabID
        this.globalFunctionService.printToConsole(this.constructor.name,'getdashboardTabName', '@Start');

        let dashboardTabNameWorking: string = null;
        for (var i = 0; i < this.dashboardTabs.length; i++) {
            if (this.dashboardTabs[i].dashboardTabID == dashboardTabID) {
                dashboardTabNameWorking = this.dashboardTabs[i].dashboardTabName;
            }
        }

        // Return
        return dashboardTabNameWorking;
    }

    // TODO - cater for multiple models later
    getUserModelPermissions(
        userID: number,
        model: string
        ): Promise<any> {
        // Returns model permissions per given user.  This is at a model level, or a
        // row (object) level
        // - userID to filter on
        // - model to filter on, ie query or dashboard
        this.globalFunctionService.printToConsole(this.constructor.name,'getUserModelPermissions', '@Start');

        let userModelPermissionsWorking: UserModelPermission[] = [
            {
                model: '',
                modelPermissions: [],
                objectPermissions: [
                    {
                        permission: '',
                        objectID: []
                    }
                ]
            }
        ];

        return this.get<EazlDashboardUserPermissions>(
            'users/' + userID.toString() +
                '/model-permissions/'
        )
            .toPromise()
            .then(eazlUsrMdlPerm => {

                for (var i = 0; i < eazlUsrMdlPerm.length; i++) {
                    if(eazlUsrMdlPerm[i].model == model) {
                        userModelPermissionsWorking[0] = this.cdal.loadModelPermission(eazlUsrMdlPerm[i]);
console.log('EAZL before new call', eazlUsrMdlPerm)                        
                        userModelPermissionsWorking[0] = this.cdal.loadDataPermission(eazlUsrMdlPerm[i]);
                        
                    }
                }

                // Replace
                this.userModelPermissions = userModelPermissionsWorking;

                // Return
                return this.userModelPermissions;
            })
            .catch(error => {
                this.globalVariableService.growlGlobalMessage.next({
                    severity: 'warn',
                    summary:  'User Permissions',
                    detail:   'Unsuccessful in reading user permissions from the database'
                });
                error.message || error
            })
    }

    getdashboardUserPermissions(
        dashboardID: number,
        includeGroup:string = 'true'
        ): Promise<any> {
        // Returns an array of ALL users.  Each row shows booleans (T/F) wrt each permission
        // that the user has.  So, a user with no permissions with have a row of False
        this.globalFunctionService.printToConsole(this.constructor.name,'getdashboardUserPermissions', '@Start');

        // Default to true if not correctly set to false
        if (includeGroup != 'false') {
            includeGroup = 'true';
        };

        let dashboardUserPermissionsWorking: DashboardUserPermissions[] = [];
        return this.get<EazlDashboardUserPermissions>(
            'dashboards/' + dashboardID.toString() +
                '/user-permissions/?include-group-permissions=' + includeGroup
        )
            .toPromise()
            .then(eazlUsrPerm => {
                let found: boolean = false;
                for (var i = 0; i < this.users.length; i++) {

                    found = false;
                    for (var j = 0; j < eazlUsrPerm.length; j++) {
                        if (eazlUsrPerm[j].username == this.users[i].username) {
                            dashboardUserPermissionsWorking.push(
                                this.cdal.loadDashboardUserPermissions(eazlUsrPerm[j])
                            );
                            found = true;
                        }
                    }

                    if (!found) {
                        dashboardUserPermissionsWorking.push(
                            {
                                username: this.users[i].username,
                                canAddDashboard: false,
                                canAssignPermissionDashboard: false,
                                canChangeDashboard: false,
                                canDeleteDashboard: false,
                                canRemovePermissionDashboard: false,
                                canViewDashboard: false
                            }
                        )
                    }
                };

                // Return
                return dashboardUserPermissionsWorking;
            })
            .catch(error => {
                this.globalVariableService.growlGlobalMessage.next({
                    severity: 'warn',
                    summary:  'User Permissions',
                    detail:   'Unsuccessful in reading user permissions from the database'
                });
                error.message || error
            })
    }

    getdashboardGroupPermissions(dashboardID: number): Promise<any> {
        // Returns an array of ALL groups.  Each row shows booleans (T/F) wrt each permission
        // that the group has.  So, a user with no permissions with have a row of False
        this.globalFunctionService.printToConsole(this.constructor.name,'getdashboardGroupPermissions', '@Start');

        let dashboardGroupPermissionsWorking: DashboardGroupPermissions[] = [];
        return this.get<EazlDashboardGroupPermissions>(
            'dashboards/' + dashboardID.toString() + '/group-permissions/'
        )
            .toPromise()
            .then(eazlGrpPerm => {
                let found: boolean = false;
                for (var i = 0; i < this.groups.length; i++) {

                    found = false;
                    for (var j = 0; j < eazlGrpPerm.length; j++) {
                        if (eazlGrpPerm[j].groupName == this.groups[i].groupName) {
                            dashboardGroupPermissionsWorking.push(
                                this.cdal.loadDashboardGroupPermissions(eazlGrpPerm[j])
                            );
                            found = true;
                        }
                    }

                    if (!found) {
                        dashboardGroupPermissionsWorking.push(
                            {
                                groupName: this.groups[i].groupName,
                                canAddDashboard: false,
                                canAssignPermissionDashboard: false,
                                canChangeDashboard: false,
                                canDeleteDashboard: false,
                                canRemovePermissionDashboard: false,
                                canViewDashboard: false
                            }
                        )
                    }
                };

                // Return
                return dashboardGroupPermissionsWorking;
            })
            .catch(error => {
                this.globalVariableService.growlGlobalMessage.next({
                    severity: 'warn',
                    summary:  'Group permissions',
                    detail:   'Unsuccessful in reading group permissions from the database'
                });
                error.message || error
            })

    }

    updateModelPermissions(
        url: string,
        id: number,
        name: string,
        model_name: string,
        assignPermissions: string[],
        removePermissions: string[]) {
        // Adds or Remove permissions for a given model
        //  url - url of model to add share to
        //  id - DB id for record / object to add share, ie 0
        //  name - user or group name, ie Admin
        //  model_name - user or group, ie group
        //  assignPermissions - list of permissions to add, ie ['view_package', 'execute_package']
        //  removePermissions - list of permissions to remove, ie ['view_package']
        this.globalFunctionService.printToConsole(this.constructor.name,'updateModelPermissions', '@Start');

        this.post<any>(
            url + '/' + id.toString() + '/share/',
            {
                name: name,
                model_name: model_name,
                assign:assignPermissions,
                remove: removePermissions
            })

            .toPromise()
            .then(element => {

                this.globalVariableService.growlGlobalMessage.next({
                    severity: 'info',
                    summary:  'Update Permisions',
                    detail:   'Successfully updated permission to the database'
                });

                // Return the data
                return element;
            } )
            .catch(error => {
                this.globalVariableService.growlGlobalMessage.next({
                    severity: 'warn',
                    summary:  'Update Permisions',
                    detail:   'Unsuccessful in updating permissions info to the database'
                });
                error.message || error
            })

    }

    getDashboardTabsSelectItems(selectedDashboardID: number): SelectItem[] {
        // Return a list of Dashboard Tabs for a given DashboardID as SelectItem Array
        // - selectedDashboardID = filter
        this.globalFunctionService.printToConsole(this.constructor.name,'getDashboardTabsSelectItem', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataDashboardTab) {
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
        this.globalVariableService.dirtyDataDashboardTab = true;

        // Get the Tab
        let workingDashboardTabs: DashboardTab[] = [];
        workingDashboardTabs = this.getDashboardTabs(dashboardID, dashboardTabID)

        // Update detail
        if (workingDashboardTabs.length > 0) {

            // Replace description
            workingDashboardTabs[0].dashboardTabDescription = dashboardTabDescription;

            return this.put<EazlDashboardTab>(
                'dashboard-tabs/' + workingDashboardTabs[0].dashboardTabID.toString() + '/',
                this.cdal.saveDashboardTab(workingDashboardTabs[0])
                )
                    .toPromise()
                    .then(eazlDashboardTab => {

                        // Update local array
                        workingDashboardTabs[0].dashboardTabDescription =
                            dashboardTabDescription;

                        // Mark as clean
                        this.globalVariableService.dirtyDataDashboardTab = false;

                        this.globalVariableService.growlGlobalMessage.next({
                            severity: 'info',
                            summary:  'Update Dashboard Tab',
                            detail:   'Successfully updated dashboard tab in the database'
                        });

                        // Return the data
                        return eazlDashboardTab;
                    } )
                    .catch(error => {
                        this.globalVariableService.growlGlobalMessage.next({
                            severity: 'warn',
                            summary:  'Update Group',
                            detail:   'Unsuccessful in updating your Group info to the database'
                        });
                        error.message || error
                    })
        }
    }

    addDashboardTab(dashboardTab: DashboardTab) {
        // Add a new DashboardTab
        this.globalFunctionService.printToConsole(this.constructor.name,'addDashboardTab', '@Start');

        // Mark as dirty
        this.globalVariableService.dirtyDataDashboardTab = true;

        return this.post<EazlDashboardTab>('dashboard-tabs',
        this.cdal.saveDashboardTab(dashboardTab))
                .toPromise()
                .then( eazlDashboardTab => {

                    // Update local store
                    dashboardTab.dashboardID = eazlDashboardTab.id;
                    this.dashboardTabs.push(dashboardTab);

                    // Not dirty any longer
                    this.globalVariableService.dirtyDataDashboardTab = false;

                    this.globalVariableService.growlGlobalMessage.next({
                        severity: 'info',
                        summary:  'Add Dashboard Tab',
                        detail:   'Successfully added dashboard tab to the database'
                    });

                    // Return the data
                    return this.dashboardTabs;
                } )
                .catch(error => {
                    this.globalVariableService.growlGlobalMessage.next({
                        severity: 'warn',
                        summary:  'Add Dashboard Tab',
                        detail:   'Unsuccessful in adding dashboard tab to the database'
                    });
                    error.message || error
                })
    }

    deleteDashboardTab(dashboardTabID: number) {
        // Delete a given DashboardTab
        this.globalFunctionService.printToConsole(this.constructor.name,'deleteDashboardTab', '@Start');

        // Mark the data as dirty
        this.globalVariableService.dirtyDataDashboardTab = false;

        return this.delete<EazlDashboardTab>(
            'dashboard-tabs/' + dashboardTabID.toString() + '/'
            )
                .toPromise()
                .then(response => {

                    // Update local data
                    for (var i = 0; i < this.dashboardTabs.length; i++) {
                        if (this.dashboardTabs[i].dashboardID == dashboardTabID) {
                            this.dashboardTabs.splice(i,1);
                        }
                    };

                    this.globalVariableService.growlGlobalMessage.next({
                        severity: 'info',
                        summary:  'Delete Dashboard Tab',
                        detail:   'Successfully deleting dashboard tab from the database'
                    });

                    // Mark as clean
                    this.globalVariableService.dirtyDataDashboardTab = false;
                } )
                .catch(error => {
                    this.globalVariableService.growlGlobalMessage.next({
                        severity: 'warn',
                        summary:  'Delete Dashboard Tab',
                        detail:   'Unsuccessful in deleting your dashboard tab info to the database'
                    });
                    error.message || error
                })
    }

    getWidgetLastWidgetID(): number {
        // Return the last (biggest) WidgetID
        this.globalFunctionService.printToConsole(this.constructor.name,'getWidgetsForDashboard', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataWidget) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'Widget data is dirty / not up to date',
                detail:   'The Widget data is being refreshed; request again to get the latest from the database'
            });
        }

        // TODO - do via Eazl into DB - discuss with Bradley
        let lastWidgetID = this.widgets[this.widgets.length - 1].properties.widgetID;

        // Return
        return lastWidgetID + 1;
    }

    getWidgetsForDashboard(selectedDashboardID: number, selectedDashboarTabName: string): Widget[] {
        // Return a list of Dashboards
        this.globalFunctionService.printToConsole(this.constructor.name,'getWidgetsForDashboard', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataWidget) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'Widget data is dirty / not up to date',
                detail:   'The Widget data is being refreshed; request again to get the latest from the database'
            });
        }

        // Calc WIDGET certain fields, as it is easy to use in *ngIf or *ngFor
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

    addWidget (widget: Widget) {
        // Add a new Widget
        this.globalFunctionService.printToConsole(this.constructor.name,'addWidget', '@Start');
        this.widgets.push(widget)

        // Mark the data as dirty
        this.globalVariableService.dirtyDataWidget = true;
    }

    getDefaultWidgetConfig (): Widget {
        // Set default config for a new Widget
        this.globalFunctionService.printToConsole(this.constructor.name,'getDefaultWidgetConfig', '@Start');

        let defaultWidgetConfig: Widget = {
            container: {
                backgroundColor: this.globalVariableService.lastBackgroundColor.name,
                border: this.globalVariableService.lastBorder.name,
                boxShadow: this.globalVariableService.lastBoxShadow.name,
                color: this.globalVariableService.lastColor.name,
                fontSize: +this.globalVariableService.lastContainerFontSize.name,
                height: this.globalVariableService.lastWidgetHeight,
                left: this.globalVariableService.lastWidgetLeft,
                widgetTitle: 'Untitled',
                top: this.globalVariableService.lastWidgetTop,
                width: this.globalVariableService.lastWidgetWidth,
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
                    vegaFillColor: 'lightgreen',
                    vegaHoverColor: 'black'
                },
                spec: {
                }
            },
            table:{
                tableColor: 'black',
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

        return defaultWidgetConfig;
    }

    getReports(
        dashboardID: number = -1,
        dataSourceID: number = -1
        ): Report[] {
        // Return a list of Reports
        // - dashboardID Optional parameter to filter on
        // - dataSourceID Optional parameter to filter on
        this.globalFunctionService.printToConsole(this.constructor.name,'getReports', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataReport) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'Report data is dirty / not up to date',
                detail:   'The Report data is being refreshed; request again to get the latest from the database'
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
        if (this.globalVariableService.dirtyDataReport) {
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

        let fieldsWorking: string[] = [];

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataReport) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'Report data is dirty / not up to date',
                detail:   'The Report data is being refreshed; request again to get the latest from the database'
            });
        }

        for (var i = 0; i < this.reports.length; i++) {
            if (this.reports[i].reportID == reportID) {

                for (var j = 0; j < this.reports.length; j++) {
                    if (this.reports[i].reportFields[j] != null) {
                        fieldsWorking.push(this.reports[i].reportFields[j].name)
                    }
                }
            }
        }

        // Done
        return fieldsWorking;
    }

    getReportFieldSelectedItems(reportID: number): SelectItem[] {
        // Return a list of Report Fields in SelectItem format
        this.globalFunctionService.printToConsole(this.constructor.name,'getReportFieldSelectedItems', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataReport) {
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
                label: reportWorking.reportFields[i].alias,
                value: {
                    id: i,
                    name: reportWorking.reportFields[i].name
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
        if (this.globalVariableService.dirtyDataReport) {
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
        if (this.globalVariableService.dirtyDataReportWidgetSet) {
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
        if (this.globalVariableService.dirtyDataReportHistory) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'ReportHistory data is dirty / not up to date',
                detail:   'The ReportHistory data is being refreshed; request again to get the latest from the database'
            });
        }

        return this.reportHistory.filter(rh =>
            (username == '*'        ||   rh.reportHistoryUserName == username)
            &&
            (reportID == -1         ||   rh.reportHistoryReportID == reportID)
            &&
            (datasourceID == -1     ||   rh.reportHistoryDatasourceID == datasourceID)
        )

    }

    getWidgetTemplates(widgetTemplateName: string): WidgetTemplate {
        // Return a list of WidgetSets per Report
        this.globalFunctionService.printToConsole(this.constructor.name,'getWidgetTemplates', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataWidgetTemplate) {
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
        this.globalVariableService.dirtyDataWidget = true;

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
        this.globalVariableService.dirtyDataWidget = false;
    }

    getGroups(groupID: number = -1, include: string[] = []): Group[] {
        // Return a list of Groups
        // - groupID Optional parameter to select ONE, else
        //   IF include = [], select ALL (if >= 0)
        //   IF include = ['admin','HR'], select two group objects
        this.globalFunctionService.printToConsole(this.constructor.name,'getGroups', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataGroup) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'Group data is dirty / not up to date',
                detail:   'The Group data is being refreshed; request again to get the latest from the database'
            });
        }

        let groupsWorking: Group[] = [];

        // If no groupID, then filter on include
        if (groupID == -1) {
            if (include.length == 0) {
                groupsWorking = this.groups;
            } else {

                // Loop and add IF included
                for (var i = 0; i < this.groups.length; i++) {
                    if (include.indexOf(this.groups[i].groupName) >= 0) {
                        groupsWorking.push(this.groups[i]);
                    };
                }
            }
        } else {

            // Return single group
            groupsWorking = this.groups.filter(
                grp => grp.groupID == groupID
            )
        }

        // Return
        return groupsWorking;
    }

    addGroup(group: Group) {
        // Add a new Group
        this.globalFunctionService.printToConsole(this.constructor.name,'addGroup', '@Start');

        // Mark as dirty
        this.globalVariableService.dirtyDataGroup = true;

        return this.post<EazlGroup>('groups',this.cdal.saveGroup(group))
            .toPromise()
            .then( eazlGroup => {

                // Update local store
                group.groupID = eazlGroup.id;
                this.groups.push(group);

                // Not dirty any longer
                this.globalVariableService.dirtyDataGroup = false;

                this.globalVariableService.growlGlobalMessage.next({
                    severity: 'info',
                    summary:  'Add Group',
                    detail:   'Successfully added group to the database'
                });

                // Return the data
                return this.groups;
            } )
            .catch(error => {
                this.globalVariableService.growlGlobalMessage.next({
                    severity: 'warn',
                    summary:  'Add Group',
                    detail:   'Unsuccessful in adding group to the database'
                });
                error.message || error
            })
    }

    updateGroup(group: Group) {
        // Update a given Group
        this.globalFunctionService.printToConsole(this.constructor.name,'updateGroup', '@Start');

        // Mark the data as dirty
        this.globalVariableService.dirtyDataGroup = true;

        return this.put<EazlGroup>(
            'groups/' + group.groupID.toString() + '/',
            this.cdal.saveGroup(group)
            )
                .toPromise()
                .then(eazlGroup => {

                    // Get the index in the groups array
                    let index: number = -1;
                    for (var i = 0; i < this.groups.length; i++) {
                        if (group.groupID == this.groups[i].groupID) {
                            index = i;
                            break;
                        }
                    }
                    if (index == -1) {
                        alert ("Error - group id does not exist in the local groups object !")
                    }

                    // Update local array
                    this.groups[i] = group;

                    // Mark as clean
                    this.globalVariableService.dirtyDataGroup = false;

                    this.globalVariableService.growlGlobalMessage.next({
                        severity: 'info',
                        summary:  'Update Group',
                        detail:   'Successfully updated group in the database'
                    });

                    // Return the data
                    return eazlGroup;
                } )
                .catch(error => {
                    this.globalVariableService.growlGlobalMessage.next({
                        severity: 'warn',
                        summary:  'Update Group',
                        detail:   'Unsuccessful in updating your Group info to the database'
                    });
                    error.message || error
                })
    }

    deleteGroup(group: Group) {
        // Delete a given Group
        this.globalFunctionService.printToConsole(this.constructor.name,'deleteGroup', '@Start');

        // Mark the data as dirty
        this.globalVariableService.dirtyDataGroup = false;

        return this.delete<EazlGroup>(
            'groups/' + group.groupID.toString() + '/'
            )
                .toPromise()
                .then(response => {

                    // Update local data
                    for (var i = 0; i < this.groups.length; i++) {
                        if (this.groups[i].groupID == group.groupID) {
                            this.groups.splice(i,1);
                        }
                    };

                    this.globalVariableService.growlGlobalMessage.next({
                        severity: 'info',
                        summary:  'Delete Group',
                        detail:   'Successfully deleting group from the database'
                    });

                    // Mark as clean
                    this.globalVariableService.dirtyDataGroup = false;
                } )
                .catch(error => {
                    this.globalVariableService.growlGlobalMessage.next({
                        severity: 'warn',
                        summary:  'Delete Group',
                        detail:   'Unsuccessful in deleting your group info to the database'
                    });
                    error.message || error
                })
    }

    getGroupsListComplement(exclude: string[] = []): string[] {
        // Return array of groups excluding those given parameters.  If exclude =['HR'],
        // a string array of all groups except HR will be returned.
        // - exclude: list of groups that must be EXCLUDED from the result
        this.globalFunctionService.printToConsole(this.constructor.name,'getGroupsListComplement', '@Start');

        let groupsWorking: string[] = [];

        // Loop end return
        for (var i = 0; i < this.groups.length; i++) {
            if (exclude.indexOf(this.groups[i].groupName) < 0) {
                groupsWorking.push(this.groups[i].groupName);
            };
        }

        // Return
        return groupsWorking;
    }

    getUsersListComplement(exclude: string[] = []): string[] {
        // Return string array of users excluding those given in the parameters.
        // If exclude =['janniei'], an array of all users except janniei will be returned.
        // - exclude: list of users that must be EXCLUDED from the result
        this.globalFunctionService.printToConsole(this.constructor.name,'getUsersListComplement', '@Start');

        let usersWorking: string[] = [];

        // Loop end return
        for (var i = 0; i < this.users.length; i++) {
            if (exclude.indexOf(this.users[i].username) < 0) {
                usersWorking.push(this.users[i].username);
            };
        }

        // Return
        return usersWorking;
    }

    getDataSources(dashboardID: number = -1): DataSource[] {
        // List of Data Sources
        // - dashboardID is optional Dashboard to filter on
        // Note: Dashboard <1-many> Widget <1-1> Report <1-1> DataSource
        this.globalFunctionService.printToConsole(this.constructor.name,'getDataSources', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataDatasource) {
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

    getDatasourcesPerGroup(groupID: number, include: boolean): DataSource[] {
        // Return list of DataSource for a given Group
        // - groupID filter
        // - include: True means that has access, False means has NO access
        this.globalFunctionService.printToConsole(this.constructor.name,'getDatasourcesPerGroup', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataGroupDatasourceAccess) {
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
        if (this.globalVariableService.dirtyDataGroupDatasourceAccess) {
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
        this.globalVariableService.dirtyDataGroupDatasourceAccess = true;
    }

    deleteGroupDatasourceAccess(datasourceID: number, groupID: number) {
        // Deletes a Datasource - Group record from the DB
        this.globalFunctionService.printToConsole(this.constructor.name,'deleteGroupDatasourceAccess', '@Start');

        // Mark the data as dirty
        this.globalVariableService.dirtyDataGroupDatasourceAccess = true;

        this.groupDatasourceAccess = this.groupDatasourceAccess.filter(
            item => (!(item.datasourceID == datasourceID  &&  item.groupID == groupID))
        );

        // Mark the data as clean
        this.globalVariableService.dirtyDataGroupDatasourceAccess = false;
    }

    getdatasourceUserPermissions(
        datasourceID: number,
        includeGroup:string = 'true'
        ): Promise<any> {
        // Returns an array of ALL users.  Each row shows booleans (T/F) wrt each permission
        // that the user has.  So, a user with no permissions with have a row of False
        this.globalFunctionService.printToConsole(this.constructor.name,'getdatasourceUserPermissions', '@Start');

        // Default to true if not correctly set to false
        if (includeGroup != 'false') {
            includeGroup = 'true';
        };

        let datasourceUserPermissionsWorking: DataSourceUserPermissions[] = [];
        return this.get<EazlDataSourceUserPermissions>(
            'packages/' + datasourceID.toString() +
                '/user-permissions/?include-group-permissions=' + includeGroup
        )
            .toPromise()
            .then(eazlUsrPerm => {

                let found: boolean = false;
                for (var i = 0; i < this.users.length; i++) {
                    found = false;
                    for (var j = 0; j < eazlUsrPerm.length; j++) {
                        if (eazlUsrPerm[j].username == this.users[i].username) {
                            datasourceUserPermissionsWorking.push(
                                this.cdal.loadDatasourceUserPermissions(eazlUsrPerm[j])
                            );
                            found = true;
                        }
                    }

                    if (!found) {
                        datasourceUserPermissionsWorking.push(
                            {
                                username: this.users[i].username,
                                canAddPackage: false,
                                canAssignPermissionPackage: false,
                                canChangePackage: false,
                                canDeletePackage: false,
                                canExecutePackage: false,
                                canPackageOwnedAccess: false,
                                canPackageSharedAccess: false,
                                canRemovePermissionPackage: false,
                                canViewPackage: false
                            }
                        )
                    }
                };

                // Return
                return datasourceUserPermissionsWorking;
            })
            .catch(error => {
                this.globalVariableService.growlGlobalMessage.next({
                    severity: 'warn',
                    summary:  'User Permissions',
                    detail:   'Unsuccessful in reading user permissions from the database'
                });
                error.message || error
            })
    }

    getdatasourceGroupPermissions(datasourceID: number): Promise<any> {
        // Returns an array of ALL groups.  Each row shows booleans (T/F) wrt each permission
        // that the group has.  So, a group with no permissions with have a row of False
        this.globalFunctionService.printToConsole(this.constructor.name,'getdatasourceGroupPermissions', '@Start');

        let datasourceGroupPermissionsWorking: DataSourceGroupPermissions[] = [];
        return this.get<EazlDataSourceGroupPermissions>(
            'packages/' + datasourceID.toString() + '/'
        )
            .toPromise()
            .then(eazlGrpPerm => {
                let found: boolean = false;
                for (var i = 0; i < this.groups.length; i++) {

                    found = false;
                    for (var j = 0; j < eazlGrpPerm.length; j++) {
                        if (eazlGrpPerm[j].groupName == this.groups[i].groupName) {
                            datasourceGroupPermissionsWorking.push(
                                this.cdal.loadDatasourceGroupPermissions(eazlGrpPerm[j])
                            );
                            found = true;
                        }
                    }

                    if (!found) {
                        datasourceGroupPermissionsWorking.push(
                            {
                                groupName: this.groups[i].groupName,
                                canAddPackage: false,
                                canAssignPermissionPackage: false,
                                canChangePackage: false,
                                canDeletePackage: false,
                                canExecutePackage: false,
                                canPackageOwnedAccess: false,
                                canPackageSharedAccess: false,
                                canRemovePermissionPackage: false,
                                canViewPackage: false
                            }
                        )
                    }
                };

                // Return
                return datasourceGroupPermissionsWorking;
            })
            .catch(error => {
                this.globalVariableService.growlGlobalMessage.next({
                    severity: 'warn',
                    summary:  'Group Permissions',
                    detail:   'Unsuccessful in reading user permissions from the database'
                });
                error.message || error
            })
    }

    getDashboardTagMembership(
            dashboardID:number = -1,
            dashboardTagName: string = '*'
        ): DashboardTagMembership[] {
        // Return a list of Dashboard - Tag memberships
        // - dashboardID Optional parameter to select ONE (if >= 0), else select ALL (if = -1)
        // - dashboardTagName Optional parameter to filter on ('*' means no filter)
        this.globalFunctionService.printToConsole(this.constructor.name,'getDashboardTagMembership', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataDashboardTagMembership) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'DashboardTagMembership data is dirty / not up to date',
                detail:   'The DashboardTagMembership data is being refreshed; request again to get the latest from the database'
            });
        }

        // Return according to filters specified
        let dashboardTagMembershipWorking = this.dashboardTagMembership.filter(
            dashtag => {
                if (
                    (dashboardID == -1  ||  dashtag.dashboardID == dashboardID)

                    &&

                    (dashboardTagName == '*'  ||  dashtag.dashboardTagName == dashboardTagName)
                ) { return dashtag };
            }
        );
        return dashboardTagMembershipWorking;
    }

    addDashboardTagMembership(dashboardID: number, dashboardTagName: string) {
        // Adds a Dashboard - Tag record to the TagMembership

        this.globalFunctionService.printToConsole(this.constructor.name,'addDashboardTagMembership', '@Start');

        // Mark the data as dirty
        this.globalVariableService.dirtyDataDashboardTagMembership = true;
        let currentUser: string = this.globalFunctionService.currentUser();

        let dashboardTagMembership: DashboardTagMembership = {
            dashboardTagID: null,
            dashboardID: dashboardID,
            dashboardTagName: dashboardTagName,
            dashboardTagMembershipCreatedDateTime: this.canvasDate.now('standard'),
            dashboardTagMembershipCreatedUserName: currentUser,
            dashboardTagMembershipUpdatedDateTime: this.canvasDate.now('standard'),
            dashboardTagMembershipUpdatedUserName: currentUser
        };

        return this.post<EazlDashboardTagMembership>(
            'dashboard-tags',
            this.cdal.saveDashboardTagMembership(dashboardTagMembership))
                .toPromise()
                .then( eazlDashboardTagMembership => {

                    // Update local store
                    dashboardTagMembership.dashboardID = eazlDashboardTagMembership.id;
                    this.dashboardTagMembership.push(dashboardTagMembership);

                    // Not dirty any longer
                    this.globalVariableService.dirtyDataDashboardTagMembership = false;

                    this.globalVariableService.growlGlobalMessage.next({
                        severity: 'info',
                        summary:  'Add Tag Membership',
                        detail:   'Successfully added tag membership to the database'
                    });

                    // Return the data
                    return this.groups;
                } )
                .catch(error => {
                    this.globalVariableService.growlGlobalMessage.next({
                        severity: 'warn',
                        summary:  'Add Tag Membership',
                        detail:   'Unsuccessful in adding tag membership to the database'
                    });
                    error.message || error
                })

    }

    deleteDashboardTagMembership(dashboardTagID: number) {
        // Deletes a Dashboard Tag Membership
        this.globalFunctionService.printToConsole(this.constructor.name,'deleteDashboardTagMembership', '@Start');

        // Mark the data as dirty
        this.globalVariableService.dirtyDataDashboardTagMembership = true;

        return this.delete<EazlDashboardTagMembership>(
            'dashboard-tags/' + dashboardTagID.toString() + '/'
            )
                .toPromise()
                .then(response => {

                    // Update local data
                    for (var i = 0; i < this.dashboardTagMembership.length; i++) {
                        if (this.dashboardTagMembership[i].dashboardTagID == dashboardTagID) {
                            this.dashboardTagMembership.splice(i,1);
                        }
                    };

                    this.globalVariableService.growlGlobalMessage.next({
                        severity: 'info',
                        summary:  'Delete Tag Membership',
                        detail:   'Successfully deleting tag membership from the database'
                    });

                    // Mark as clean
                    this.globalVariableService.dirtyDataDashboardTagMembership = false;
                } )
                .catch(error => {
                    this.globalVariableService.growlGlobalMessage.next({
                        severity: 'warn',
                        summary:  'Delete Tag Membership',
                        detail:   'Unsuccessful in deleting your tag membership info to the database'
                    });
                    error.message || error
                })
    }

    // TODO - refactor with action to do POST and DELETE (add/remove)
    modelFeedback(
        modelName: string,
        modelID: number,
        feedback: string,
        action: string) {
        // Changes (add/delete) the feedback on a model for the current user
        // - modelName for the feedback, ie packages
        // - modelID is the record/object to change in the given model
        // - feedback is type of feedback: Like, Favourite
        this.globalFunctionService.printToConsole(this.constructor.name,'modelFeedback', '@Start');

        // Set the feedback type
        let feedbackType: { 'feedback_type': string};
        if (feedback == 'Like') {
            feedbackType = { 'feedback_type': 'L'};
        } else {
            feedbackType = { 'feedback_type': 'F'};
        }
console.log('before post', modelName + '/' + modelID.toString() + '/feedback/')
        return this.post<any>( modelName + '/' + modelID.toString() + '/feedback/', feedbackType)
        .toPromise()
        .then( fbck => {

            this.globalVariableService.growlGlobalMessage.next({
                severity: 'info',
                summary:  'Changed Feedback',
                detail:   'Successfully changed feedback for ' + modelName + ' to the database'
            });

            // Return the data
            return this.users;
        } )
        .catch(error => {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'Changed Feedback',
                detail:   'Unsuccessful in changed feedback to the database'
            });
            error.message || error
        })
        // session.post(base_url + "packages/" + str(package['id']) + "/feedback/", json=feedback_type)
    }

    toggleDashboardIsLiked(dashboardID: number, username:string, isLikedNewState:boolean) {
        // Adds / Removes a user from the Dashboard:
        // - dashboardID
        // - username to add / remove
        // - isLikedNewState = new state, so true -> add user, else delete
        this.globalFunctionService.printToConsole(this.constructor.name,'toggleDashboardIsLiked', '@Start');

        let action: string = 'delete';
        if (isLikedNewState) {
            action='add';
        }

        this.modelFeedback('dashboards', dashboardID, 'Like', action)
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
        if (this.globalVariableService.dirtyDataCanvasMessage) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'CanvasMessages data is dirty / not up to date',
                detail:   'The CanvasMessages data is being refreshed; request again to get the latest from the database'
            });
        }

        // Return the necessary
        let found: boolean = false;
        let myStatus: string = '';
        let userID: number = -1;
        if (this.globalVariableService.canvasUser.getValue() != null) {
            userID = +this.globalVariableService.canvasUser.getValue().id;
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

                        if (this.canvasMessages[i].canvasMessageRecipients[j].
                            canvasMessageRecipientUsername ==
                            this.globalVariableService.canvasUser.getValue().username
                        ) {
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

    getCanvasMessagesFlat(): CanvasMessageFlat[] {
        // Returns CanvasMessagesFlat from CanvasMessage array 
        this.globalFunctionService.printToConsole(this.constructor.name,'getCanvasMessagesFlat', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataCanvasMessage) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'CanvasMessages data is dirty / not up to date',
                detail:   'The CanvasMessages data is being refreshed; request again to get the latest from the database'
            });
        }

        // Flatten
        let canvasMessageFlatWorking: CanvasMessageFlat[] = [];
        this.canvasMessages.forEach( cm => {
            canvasMessageFlatWorking.push(
                {
                    canvasMessageID: cm.canvasMessageID,
                    canvasMessageConversationID: cm.canvasMessageConversationID,
                    canvasMessageSenderUserName: cm.canvasMessageSenderUserName,
                    canvasMessageSentDateTime: cm.canvasMessageSentDateTime,
                    canvasMessageIsSystemGenerated: cm.canvasMessageIsSystemGenerated,
                    canvasMessageDashboardID: cm.canvasMessageDashboardID,
                    canvasMessageReportID: cm.canvasMessageReportID,
                    canvasMessageWidgetID: cm.canvasMessageWidgetID,
                    canvasMessageSubject: cm.canvasMessageSubject,
                    canvasMessageBody: cm.canvasMessageBody,
                    canvasMessageSentToMe: cm.canvasMessageSentToMe,
                    canvasMessageMyStatus: cm.canvasMessageMyStatus,
                }
            )
        })
        
        // Return
        return canvasMessageFlatWorking;
    }

    addCanvasMessage(canvasMessage: CanvasMessage) {
        // Adds CanvasMessage, and also refresh (.next) global variables
        // - systemConfiguration New data
        this.globalFunctionService.printToConsole(this.constructor.name,'addCanvasMessage', '@Start');

        // Mark as dirty
        this.globalVariableService.dirtyDataCanvasMessage = true;

        return this.post<EazlCanvasMessage>(
            'messages/', this.cdal.saveCanvasMessage(canvasMessage)
            )
                .toPromise()
                .then(eazlCanvasMessage => {

            // Set the local ID ~ id returned by API
            canvasMessage.canvasMessageID = eazlCanvasMessage.id;
                    // Update local array
                    this.canvasMessages.push(canvasMessage)

                    // Mark as clean
                    this.globalVariableService.dirtyDataCanvasMessage = false;

                    this.globalVariableService.growlGlobalMessage.next({
                        severity: 'info',
                        summary:  'Add Message',
                        detail:   'Successfully added message to the database'
                    });

                    // Return the data
                    return eazlCanvasMessage;
                } )
                .catch(error => {
                    this.globalVariableService.growlGlobalMessage.next({
                        severity: 'warn',
                        summary:  'Add Message',
                        detail:   'Unsuccessful in adding message to the database'
                    });
                    error.message || error
                })

    }

    updateCanvasMessage(canvasMessage: CanvasMessage) {
        // Updates a CanvasMessage, and also refresh (.next) global variables
        // - systemConfiguration New data
        this.globalFunctionService.printToConsole(this.constructor.name,'updateCanvasMessage', '@Start');

        // Mark as dirty
        this.globalVariableService.dirtyDataCanvasMessage = true;

        return this.put<EazlCanvasMessage>(
            'messages/' + canvasMessage.canvasMessageID + '/', this.cdal.saveCanvasMessage(canvasMessage)
            )
                .toPromise()
                .then(eazlCanvasMessage => {

                    // Update local array
                    for (var i = 0; i < this.canvasMessages.length; i++) {
                        if (this.canvasMessages[i].canvasMessageID ==
                            canvasMessage.canvasMessageID) {
                                this.canvasMessages[i] = canvasMessage;
                            }
                    }

                    // Mark as clean
                    this.globalVariableService.dirtyDataCanvasMessage = false;

                    this.globalVariableService.growlGlobalMessage.next({
                        severity: 'info',
                        summary:  'Update Message',
                        detail:   'Successfully updated message in the database'
                    });

                    // Return the data
                    return eazlCanvasMessage;
                } )
                .catch(error => {
                    this.globalVariableService.growlGlobalMessage.next({
                        severity: 'warn',
                        summary:  'Update Message',
                        detail:   'Unsuccessful in updating message in the database'
                    });
                    error.message || error
                })

    }

    getWidgetTypes(): WidgetType[] {
        // Return list of Grapy Types
        this.globalFunctionService.printToConsole(this.constructor.name,'getWidgetTypes', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataWidgetType) {
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
        if (this.globalVariableService.dirtyDataGraphType) {
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
        if (this.globalVariableService.dirtyDataBorderDropdown) {
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
        if (this.globalVariableService.dirtyDataBoxShadowDropdown) {
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
        if (this.globalVariableService.dirtyDataFontSizeDropdown) {
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
        if (this.globalVariableService.dirtyDataGridSizeDropdown) {
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
        if (this.globalVariableService.dirtyDataBackgroundImageDropdown) {
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

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataFontWeightDropdown) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'FontWeightDropdown data is dirty / not up to date',
                detail:   'The FontWeightDropdown data is being refreshed; request again to get the latest from the database'
            });
        }

        return this.fontWeightDropdown;
    }

    getTextMarginDropdowns(): SelectItem[] {
        // Returns list of Text Margin dropdown options
        this.globalFunctionService.printToConsole(this.constructor.name,'getTextMarginDropdowns', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataTextMarginDropdown) {
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

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataTextPaddingDropdown) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'TextPaddingDropdown data is dirty / not up to date',
                detail:   'The TextPaddingDropdown data is being refreshed; request again to get the latest from the database'
            });
        }

        return this.textPaddingDropdowns;
    }

    getTextPositionDropdowns(): SelectItem[] {
        // Returns list of Text Position dropdown options
        this.globalFunctionService.printToConsole(this.constructor.name,'getTextPositionDropdowns', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataTextPositionDropdown) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'TextPositionDropdown data is dirty / not up to date',
                detail:   'The TextPositionDropdown data is being refreshed; request again to get the latest from the database'
            });
        }

        return this.textPositionDropdowns;
    }

    getTextAlignDropdowns(): SelectItem[] {
        // Returns list of Text Alignment dropdown options
        this.globalFunctionService.printToConsole(this.constructor.name,'getTextAlignDropdowns', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataTextAlignDropdown) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'TextAlignDropdown data is dirty / not up to date',
                detail:   'The TextAlignDropdown data is being refreshed; request again to get the latest from the database'
            });
        }

        return this.textAlignDropdowns;
    }

    getImageSourceDropdowns(): SelectItem[] {
        // Returns list of Image Source file dropdown options
        this.globalFunctionService.printToConsole(this.constructor.name,'getImageSourceDropdowns', '@Start');

        // Report to user if dirty at the moment
        if (this.globalVariableService.dirtyDataImageSourceDropdown) {
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'warn',
                summary:  'ImageSourceDropdown data is dirty / not up to date',
                detail:   'The ImageSourceDropdown data is being refreshed; request again to get the latest from the database'
            });
        }

        return this.imageSourceDropdowns;
    }

    sendWSCanvasMessage(canvasMessage: CanvasMessage) {
        // Sends a given CanvasMessage to the WebSocket
        this.globalFunctionService.printToConsole(this.constructor.name,'sendWSCanvasMessage', '@Start');

        // Get current user
        let currentUser: string = this.globalFunctionService.currentUser();
        let websocketWorking: WebSocketCanvasMessage;
        let recipients: string = '';
        canvasMessage.canvasMessageRecipients.forEach(
            r => recipients = recipients + r + '; '
        );
        websocketWorking = {
            webSocketDatetime: new Date(this.canvasDate.now('standard')),
            webSocketSenderUsername: currentUser,
            webSocketMessageType: 'WebSocketCanvasMessage',
                                                // - WebSocketCanvasMessage
                                                // - WebSocketSystemMessage
                                                // - WebSocketCeleryMessage
                                                // - WebSocketRefDataMessage
            webSocketMessageBody: {
                webSocketRecipients: recipients,
                webSocketDashboardID: canvasMessage.canvasMessageDashboardID,
                webSocketWidgetID: canvasMessage.canvasMessageWidgetID,
                webSocketReportID: canvasMessage.canvasMessageReportID,
                webSocketSubject: canvasMessage.canvasMessageSubject,
                webSocketBody: canvasMessage.canvasMessageBody,
                webSocketMessage: ''
                }
        }

        this.reconnectingWebSocket.webSocketSystemMessage.next(websocketWorking);
            
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
                this.globalVariableService.dirtyDataUser = true;

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
                        this.globalVariableService.dirtyDataUser = false;
                        }
                    )
            }

            // Clear all
            if (resetAction.toLowerCase() == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear User');
                this.users = [];

                // Mark the data as dirty
                this.globalVariableService.dirtyDataUser = true;
            }

        }

        // Group
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'Group') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset Group');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataGroup = true;

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
                        this.globalVariableService.dirtyDataGroup = false;
                        }
                    )
            }

            // Clear all
            if (resetAction == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear Group');
                this.groups = [];

                // Mark the data as dirty
                this.globalVariableService.dirtyDataGroup = true;
            }
        }

        // CanvasMessage
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'CanvasMessage') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset CanvasMessage');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataCanvasMessage = true;

                // Get all the data via API
                let canvasMessageWorking: CanvasMessage[] = [];
                this.get<EazlCanvasMessage>('messages')
                    .subscribe(
                        (eazlCanvasMessage) => {
                            for (var i = 0; i < eazlCanvasMessage.length; i++) {
                                let canvasMessageSingle = new CanvasMessage();
                                canvasMessageSingle = this.cdal.loadCanvasMessage(eazlCanvasMessage[i]);
                                canvasMessageWorking.push(canvasMessageSingle);

                            }

                        // Replace
                         this.canvasMessages = canvasMessageWorking;

                         // Mark the data as clean
                        this.globalVariableService.dirtyDataCanvasMessage = false;
                        }
                )
            }

            // Clear all
            if (resetAction.toLowerCase() == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear CanvasMessage');
                this.canvasMessages = [];

                // Mark the data as dirty
                this.globalVariableService.dirtyDataCanvasMessage = true;
            }
        }

        // CanvasMessageRecipient
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'CanvasMessageRecipient') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset CanvasMessageRecipient');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataCanvasMessageRecipient = true;

                // Get all the data via API
                let canvasMessageRecipientWorking: CanvasMessageRecipient[] = [];
                this.get<EazlCanvasMessageRecipient>('message-recipients')
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
                        this.globalVariableService.dirtyDataCanvasMessageRecipient = false;
                        }
                )
            }

            // Clear all
            if (resetAction.toLowerCase() == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear CanvasMessageRecipient');
                this.canvasMessageRecipients = [];

                // Mark the data as dirty
                this.globalVariableService.dirtyDataCanvasMessageRecipient = true;
            }
        }

        // Dashboard: this is a nested get, using Promises
        // - first get Dashboards
        // - then DashboardTabs
        // - then DashboardTags
        // The reason is to ensure the info is in sync: the array of tabs in a Dasbhoard
        // object will now match the info in the Tabs array, and so on.
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'Dashboard') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset Dashboard');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataDashboard=  true;

                // Get all the data via API
                let dashboardWorking: Dashboard[] = [];

                this.get<EazlDashboard>('dashboards')
                    .toPromise()
                    .then(
                        (eazlDashboard) => {

                            // Mark the data as dirty
                            this.globalVariableService.dirtyDataDashboardTab = true;

                            // Get all the data via API
                            let dashboardTabWorking: DashboardTab[] = [];
                            this.get<EazlDashboardTab>('dashboard-tabs')
                                .toPromise()
                                .then(
                                    (eazlDashboardTab) => {

                                        // Mark the data as dirty
                                        this.globalVariableService.dirtyDataDashboardTagMembership = true;

                                        // Get all the data via API
                                        let dashboardTagMembershipWorking: DashboardTagMembership[] = [];
                                        this.get<EazlDashboardTagMembership>('dashboard-tags')
                                            .toPromise()
                                            .then(
                                                (eazlDashboardTagMembership) => {
                                                    for (var i = 0; i < eazlDashboardTagMembership.length; i++) {
                                                        let dashboardTagMembershipSingle = new DashboardTagMembership();
                                                        dashboardTagMembershipSingle = this.cdal.loadDashboardTagMembership(eazlDashboardTagMembership[i]);
                                                        dashboardTagMembershipWorking.push(dashboardTagMembershipSingle);

                                                    }

                                                // Replace
                                                this.dashboardTagMembership = dashboardTagMembershipWorking;

                                                // Mark the data as clean
                                                this.globalVariableService.dirtyDataDashboardTagMembership = false;
                                                }
                                        )

                                        for (var i = 0; i < eazlDashboardTab.length; i++) {
                                            let dashboardTabSingle = new DashboardTab();
                                            dashboardTabSingle = this.cdal.loadDashboardTab(eazlDashboardTab[i]);
                                            dashboardTabWorking.push(dashboardTabSingle);

                                        }

                                    // Replace
                                    this.dashboardTabs = dashboardTabWorking;

                                    // Mark the data as clean
                                    this.globalVariableService.dirtyDataDashboardTab = false;
                                }
                            )

                            for (var i = 0; i < eazlDashboard.length; i++) {
                                let dashboardSingle = new Dashboard();
                                dashboardSingle = this.cdal.loadDashboard(eazlDashboard[i]);
                                dashboardWorking.push(dashboardSingle);

                            }

                            // Replace
                            this.dashboards = dashboardWorking;

                            // Mark the data as clean
                            this.globalVariableService.dirtyDataDashboard = false;
                        }
                )
            }

            // Clear all
            if (resetAction.toLowerCase() == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear Dashboard');
                this.dashboards = [];
                this.dashboardTabs = [];
                this.dashboardTagMembership = [];

                // Mark the data as dirty
                this.globalVariableService.dirtyDataDashboard = true;
                this.globalVariableService.dirtyDataDashboardTab = true;
                this.globalVariableService.dirtyDataDashboardTagMembership = true;

            }
        }

        // Datasource
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'Datasource') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset Datasource');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataDatasource = true;

                // Get all the data via API
                let datasourceWorking: DataSource[] = [];
                this.get<EazlDataSource>('packages')
                    .subscribe(
                        (eazlDS) => {
                            for (var i = 0; i < eazlDS.length; i++) {
                                let datasourceSingle = new DataSource();
                                datasourceSingle = this.cdal.loadDatasource(eazlDS[i]);
                                datasourceWorking.push(datasourceSingle);

                            }

                        // Replace
                        this.datasources = datasourceWorking;

                        // Mark the data as clean
                        this.globalVariableService.dirtyDataDatasource = false;
                        }
                )
            }

            // Clear all
            if (resetAction.toLowerCase() == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear Datasource');
                this.datasources = [];

                // Mark the data as dirty
                this.globalVariableService.dirtyDataDatasource = true;
            }
        }

        // PackageTask
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'PackageTask') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset PackageTask');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataPackageTask = true;

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
                        this.packageTask = packageTaskWorking;

                        // Mark the data as clean
                        this.globalVariableService.dirtyDataPackageTask = false;
                        }
                )
            }

            // Clear all
            if (resetAction.toLowerCase() == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear PackageTask');
                this.packageTask = [];

                // Mark the data as dirty
                this.globalVariableService.dirtyDataPackageTask = true;
            }
        }

        // Report
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'Report') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset Report');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataReport = true;

                // Get all the data via API
                let reportWorking: Report[] = [];
                this.get<EazlReport>('queries')
                    .subscribe(
                        (eazlReport) => {
                            for (var i = 0; i < eazlReport.length; i++) {
                                let reportSingle = new Report();
                                reportSingle = this.cdal.loadReport(eazlReport[i]);
                                reportWorking.push(reportSingle);

                            }

                        // Replace
                         this.reports = reportWorking;

                        // Mark the data as clean
                        this.globalVariableService.dirtyDataReport = false;
                        }
                )
            }

            // Clear all
            if (resetAction.toLowerCase() == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear Report');
                this.reports = [];

                // Mark the data as dirty
                this.globalVariableService.dirtyDataReport = true;
            }
        }

        // ReportWidgetSet
            // if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'ReportWidgetSet') {

            //     // Reset
            //     if (resetAction == 'reset') {
            //         this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset ReportWidgetSet');

            //         // Mark the data as dirty
            //         this.globalVariableService.dirtyDataReportWidgetSet = true;

            //         // Get all the data via API
            //         let reportWidgetSetWorking: ReportWidgetSet[] = [];
            //         this.get<EazlReportWidgetSet>('report-widget-sets')
            //             .subscribe(
            //                 (eazlReportWidgetSet) => {
            //                     for (var i = 0; i < eazlReportWidgetSet.length; i++) {
            //                         let reportWidgetSetSingle = new ReportWidgetSet();
            //                         reportWidgetSetSingle = this.cdal.loadReportWidgetSet(eazlReportWidgetSet[i]);
            //                         reportWidgetSetWorking.push(reportWidgetSetSingle);

            //                     }

            //                 // Replace
            //                 // TODO - replace local Array after Bradley's done initial upload
            //                 //  this.reportWidgetSet = ReportWidgetSetWorking;

            //                 // Mark the data as clean
            //                 this.globalVariableService.dirtyDataReportWidgetSet = false;
            //                 }
            //         )
            //     }

            //     // Clear all
            //     if (resetAction.toLowerCase() == 'clear') {
            //         this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear ReportWidgetSet');
            //         this.reportWidgetSet = [];

            //         // Mark the data as dirty
            //         this.globalVariableService.dirtyDataReportWidgetSet = true;
            //     }
            // }
        // Done

        // ReportHistory
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'ReportHistory') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset ReportHistory');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataReportHistory = true;

                // Get all the data via API
                let reportHistoryWorking: ReportHistory[] = [];
                this.get<EazlReportHistory>('task-history')
                    .subscribe(
                        (eazlReportHistory) => {
                            for (var i = 0; i < eazlReportHistory.length; i++) {
                                let reportHistorySingle = new ReportHistory();
                                reportHistorySingle = this.cdal.loadReportHistory(eazlReportHistory[i]);
                                reportHistoryWorking.push(reportHistorySingle);

                            }

                        // Replace
                         this.reportHistory = reportHistoryWorking;

                        // Mark the data as clean
                        this.globalVariableService.dirtyDataReportHistory = false;
                        }
                )
            }

            // Clear all
            if (resetAction.toLowerCase() == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear ReportHistory');
                this.reportHistory = [];

                // Mark the data as dirty
                this.globalVariableService.dirtyDataReportHistory = true;
            }
        }

        // SystemConfiguration
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'SystemConfiguration') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset SystemConfiguration');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataSystemConfiguration = true;

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

                            // Get the SystemConfiguration, and refesh global variables
                            this.globalVariablesSystemConfiguration(
                                systemConfigurationWorking
                            )

                            // Mark the data as clean
                            this.globalVariableService.dirtyDataSystemConfiguration = false;
                        }
                    )
            }

            // Clear all
            if (resetAction.toLowerCase() == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear SystemConfiguration');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataSystemConfiguration = true;

                this.systemConfiguration = null;
            }
        }

        // WidgetTemplate
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'WidgetTemplate') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset WidgetTemplate');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataWidgetTemplate = true;

                // Get all the data via API
                let widgetTemplateWorking: WidgetTemplate[] = [];
                this.get<EazlWidgetTemplate>('widget-templates')
                    .subscribe(
                        (eazlWidgetTemplate) => {
                            for (var i = 0; i < eazlWidgetTemplate.length; i++) {
                                let widgetTemplateSingle = new WidgetTemplate();
                                widgetTemplateSingle = this.cdal.loadWidgetTemplate(eazlWidgetTemplate[i]);
                                widgetTemplateWorking.push(widgetTemplateSingle);

                            }

                        // Replace
                         this.widgetTemplates = widgetTemplateWorking;

                        // Mark the data as clean
                        this.globalVariableService.dirtyDataWidgetTemplate = false;
                        }
                )
            }

            // Clear all
            if (resetAction.toLowerCase() == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear WidgetTemplate');
                this.widgetTemplates = [];

                // Mark the data as dirty
                this.globalVariableService.dirtyDataWidgetTemplate = true;
            }
        }

        // Widget
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'Widget') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset Widget');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataWidget = true;

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
                        this.globalVariableService.dirtyDataWidget = false;
                        }
                    )
            }

            // Clear all
            if (resetAction.toLowerCase() == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear Widget');
                this.widgets = [];

                // Mark the data as dirty
                this.globalVariableService.dirtyDataWidget = true;
            }
        }

        // WidgetType
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'WidgetType') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset WidgetType');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataWidgetType = true;

                // Get all the data via API
                let widgetTypeWorking: WidgetType[] = [];
                this.get<EazlAppData>('canvas-application-data')
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
                        this.globalVariableService.dirtyDataWidgetType = false;
                        }
                    )
            }

            // Clear all
            if (resetAction == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear WidgetType');
                this.widgetTypes = [];

                // Mark the data as dirty
                this.globalVariableService.dirtyDataWidgetType = true;
            }
        }

        // GraphType
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'GraphType') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset GraphType');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataGraphType = true;

                // Get all the data via API
                let graphTypeWorking: GraphType[] = [];
                this.get<EazlAppData>('canvas-application-data')
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
                        this.globalVariableService.dirtyDataGraphType = false;
                        }
                    )
            }

            // Clear all
            if (resetAction == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear GraphType');
                this.graphTypes = [];

                // Mark the data as dirty
                this.globalVariableService.dirtyDataGraphType = true;
            }
        }

        // BorderDropdown
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'BorderDropdown') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset BorderDropdown');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataBorderDropdown = true;

                // Get all the data via API
                let borderDropdownWorking: SelectItem[] = [];

                this.get<EazlAppData>('canvas-application-data')
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
                        this.globalVariableService.dirtyDataBorderDropdown = false;
                        }
                    )
            }

            // Clear all
            if (resetAction == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear BorderDropdown');
                this.borderDropdowns = [];

                // Mark the data as dirty
                this.globalVariableService.dirtyDataBorderDropdown = true;
            }
        }

        // BoxShadowDropdown
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'BoxShadowDropdown') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset BoxShadowDropdown');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataBoxShadowDropdown = true;

                // Get all the data via API
                let boxShadowDropdownsWorking: SelectItem[] = [];

                this.get<EazlAppData>('canvas-application-data')
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
                        this.globalVariableService.dirtyDataBoxShadowDropdown = false;
                        }
                    )
            }

            // Clear all
            if (resetAction == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear BoxShadowDropdown');
                this.boxShadowDropdowns = [];

                // Mark the data as dirty
                this.globalVariableService.dirtyDataBoxShadowDropdown = true;
            }
        }

        // FontSizeDropdown
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'FontSizeDropdown') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset FontSizeDropdown');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataFontSizeDropdown = true;

                // Get all the data via API
                let fontSizeDropdownsWorking: SelectItem[] = [];

                this.get<EazlAppData>('canvas-application-data')
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
                        this.globalVariableService.dirtyDataFontSizeDropdown = false;
                        }
                    )
            }

            // Clear all
            if (resetAction == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear FontSizeDropdown');
                this.fontSizeDropdowns = [];

                // Mark the data as dirty
                this.globalVariableService.dirtyDataFontSizeDropdown = true;
            }
        }

        // GridSizeDropdown
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'GridSizeDropdown') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset GridSizeDropdown');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataGridSizeDropdown = true;

                // Get all the data via API
                let gridSizeDropdownsWorking: SelectItem[] = [];

                this.get<EazlAppData>('canvas-application-data')
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
                        this.globalVariableService.dirtyDataGridSizeDropdown = false;
                        }
                    )
            }

            // Clear all
            if (resetAction == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear GridSizeDropdown');
                this.gridSizeDropdowns = [];

                // Mark the data as dirty
                this.globalVariableService.dirtyDataGridSizeDropdown = true;
            }
        }

        // BackgroundImageDropdown
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'BackgroundImageDropdown') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset BackgroundImageDropdown');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataBackgroundImageDropdown = true;

                // Get all the data via API
                let backgroundImageDropdownsWorking: SelectItem[] = [];

                this.get<EazlAppData>('canvas-application-data')
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
                        this.globalVariableService.dirtyDataBackgroundImageDropdown = false;
                        }
                    )
            }

            // Clear all
            if (resetAction == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear BackgroundImageDropdown');
                this.backgroundImageDropdowns = [];

                // Mark the data as dirty
                this.globalVariableService.dirtyDataBackgroundImageDropdown = true;
            }
        }

        // TextMarginDropdown
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'TextMarginDropdown') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset TextMarginDropdown');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataTextMarginDropdown = true;

                // Get all the data via API
                let textMarginDropdownWorking: WidgetType[] = [];
                this.get<EazlAppData>('canvas-application-data')
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
                        this.globalVariableService.dirtyDataTextMarginDropdown = false;
                        }
                    )
            }

            // Clear all
            if (resetAction == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear TextMarginDropdown');
                this.textMarginDropdowns = [];

                // Mark the data as dirty
                this.globalVariableService.dirtyDataTextMarginDropdown = true;
            }
        }

        //  FontWeightDropdown
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'FontWeightDropdown') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset FontWeightDropdown');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataFontWeightDropdown = true;

                // Get all the data via API
                let fontWeightDropdownWorking: WidgetType[] = [];
                this.get<EazlAppData>('canvas-application-data')
                    .subscribe(
                        (eazlAppData) => {
                            for (var i = 0; i < eazlAppData.length; i++) {
                                if (eazlAppData[i].entity == 'FontWeightDropdown') {
                                    fontWeightDropdownWorking.push(
                                        this.cdal.loadFontWeightDropdown(eazlAppData[i])
                                    );
                                }
                            }

                        // Replace
                        this.fontWeightDropdown = fontWeightDropdownWorking;

                        // Mark the data as clean
                        this.globalVariableService.dirtyDataFontWeightDropdown = false;
                        }
                    )
            }

            // Clear all
            if (resetAction == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear FontWeightDropdown');
                this.fontWeightDropdown = [];

                // Mark the data as dirty
                this.globalVariableService.dirtyDataFontWeightDropdown = true;
            }
        }

        //  TextPaddingDropdown
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'TextPaddingDropdown') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset TextPaddingDropdown');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataTextPaddingDropdown = true;

                // Get all the data via API
                let textPaddingDropdownWorking: WidgetType[] = [];
                this.get<EazlAppData>('canvas-application-data')
                    .subscribe(
                        (eazlAppData) => {
                            for (var i = 0; i < eazlAppData.length; i++) {
                                if (eazlAppData[i].entity == 'TextPaddingDropdown') {
                                    textPaddingDropdownWorking.push(
                                        this.cdal.loadTextPaddingDropdown(eazlAppData[i])
                                    );
                                }
                            }

                        // Replace
                        this.textPaddingDropdowns = textPaddingDropdownWorking;

                        // Mark the data as clean
                        this.globalVariableService.dirtyDataTextPaddingDropdown = false;
                        }
                    )
            }

            // Clear all
            if (resetAction == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear TextPaddingDropdown');
                this.textPaddingDropdowns = [];

                // Mark the data as dirty
                this.globalVariableService.dirtyDataTextPaddingDropdown = true;
            }
        }

        //  TextPositionDropdown
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'TextPositionDropdown') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset TextPositionDropdown');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataTextPositionDropdown = true;

                // Get all the data via API
                let TextPositionDropdownWorking: WidgetType[] = [];
                this.get<EazlAppData>('canvas-application-data')
                    .subscribe(
                        (eazlAppData) => {
                            for (var i = 0; i < eazlAppData.length; i++) {
                                if (eazlAppData[i].entity == 'TextPositionDropdown') {
                                    TextPositionDropdownWorking.push(
                                        this.cdal.loadTextPositionDropdown(eazlAppData[i])
                                    );
                                }
                            }

                        // Replace
                        this.textPositionDropdowns = TextPositionDropdownWorking;

                        // Mark the data as clean
                        this.globalVariableService.dirtyDataTextPositionDropdown = false;
                        }
                    )
            }

            // Clear all
            if (resetAction == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear TextPositionDropdown');
                this.textPositionDropdowns = [];

                // Mark the data as dirty
                this.globalVariableService.dirtyDataTextPositionDropdown = true;
            }
        }

        //  TextAlignDropdown
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'TextAlignDropdown') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset TextAlignDropdown');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataTextAlignDropdown = true;

                // Get all the data via API
                let textAlignDropdownWorking: WidgetType[] = [];
                this.get<EazlAppData>('canvas-application-data')
                    .subscribe(
                        (eazlAppData) => {
                            for (var i = 0; i < eazlAppData.length; i++) {
                                if (eazlAppData[i].entity == 'TextAlignDropdown') {
                                    textAlignDropdownWorking.push(
                                        this.cdal.loadTextAlignDropdown(eazlAppData[i])
                                    );
                                }
                            }

                        // Replace
                        this.textAlignDropdowns = textAlignDropdownWorking;

                        // Mark the data as clean
                        this.globalVariableService.dirtyDataTextAlignDropdown = false;
                        }
                    )
            }

            // Clear all
            if (resetAction == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear TextAlignDropdown');
                this.textAlignDropdowns = [];

                // Mark the data as dirty
                this.globalVariableService.dirtyDataTextAlignDropdown = true;
            }
        }

        //  ImageSourceDropdown
        if (resetObject.toLowerCase() == 'all'   ||   resetObject == 'ImageSourceDropdown') {

            // Reset
            if (resetAction == 'reset') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  reset ImageSourceDropdown');

                // Mark the data as dirty
                this.globalVariableService.dirtyDataImageSourceDropdown = true;

                // Get all the data via API
                let imageSourceDropdownWorking: WidgetType[] = [];
                this.get<EazlAppData>('canvas-application-data')
                    .subscribe(
                        (eazlAppData) => {
                            for (var i = 0; i < eazlAppData.length; i++) {
                                if (eazlAppData[i].entity == 'ImageSourceDropdown') {
                                    imageSourceDropdownWorking.push(
                                        this.cdal.loadImageSourceDropdown(eazlAppData[i])
                                    );
                                }
                            }

                        // Replace
                        this.imageSourceDropdowns = imageSourceDropdownWorking;

                        // Mark the data as clean
                        this.globalVariableService.dirtyDataImageSourceDropdown = false;
                        }
                    )
            }

            // Clear all
            if (resetAction == 'clear') {
                this.globalFunctionService.printToConsole(this.constructor.name,'cacheCanvasData', '  clear ImageSourceDropdown');
                this.imageSourceDropdowns = [];

                // Mark the data as dirty
                this.globalVariableService.dirtyDataImageSourceDropdown = true;
            }
        }
    }
}
