// Service that provides all data (from the DB)
import { Injectable }                 from '@angular/core';

// Our Services
import { GlobalFunctionService }      from './global.function.service';
import { GlobalVariableService }      from './global.variable.service';

// Our models
import { Dashboard }                  from './model.dashboards';
import { DashboardTab }               from './model.dashboardTabs';
import { Report }                     from './model.report';
import { ReportWidgetSet }            from './model.report.widgetSets';
import { User }                       from './model.user';
import { Widget }                     from './model.widget';
import { WidgetComment }              from './model.widget.comment';
import { WidgetTemplate }             from './model.widgetTemplates';

// TODO - use RESTi
export const USERS: User[] =
    [
        {
            userID: 'Gerh1',
            firstName: 'Gerhard1 Leopold',
            lastName: 'Johnston McKensey 1',
            nickName: 'Jonny 1',
            photoPath: '',
            lastDatetimeLoggedIn: '2016/12/11',
            lastDatetimeReportWasRun: '2017/01/01',
            emailAddress: 'Gjohnston1@gmail.com',
            cellNumber: '084-123-8891',
            workTelephoneNumber: '011-502-0251',
            workExtension: '*77981',
            activeFromDate: '2016/11/11',
            inactiveDate: '',
            dateCreated: '2015/08/01',
            userIDLastUpdated: 'Admin1001',
            isStaff: true,
            extraString1: '',
            extraString10: '',
            extraDate1: '',
            extraDate10: '',
            extraBoolean1: false,
            extraBoolean10: false
        },
        {
            userID: 'Gerh2',
            firstName: 'Gerhard2',
            lastName: 'Johnston 2',
            nickName: 'Jonny 2',
            photoPath: '',
            lastDatetimeLoggedIn: '2016/12/12',
            lastDatetimeReportWasRun: '2017/01/02',
            emailAddress: 'Gjohnston2@gmail.com',
            cellNumber: '084-123-8892',
            workTelephoneNumber: '011-502-0252',
            workExtension: '*77982',
            activeFromDate: '2016/11/12',
            inactiveDate: '',
            dateCreated: '2015/08/02',
            userIDLastUpdated: 'Admin1002',
            isStaff: true,
            extraString1: '',
            extraString10: '',
            extraDate1: '',
            extraDate10: '',
            extraBoolean1: false,
            extraBoolean10: false
        },
        {
            userID: 'Gerh3',
            firstName: 'Gerhard3',
            lastName: 'Johnston 3',
            nickName: 'Jonny 3',
            photoPath: '',
            lastDatetimeLoggedIn: '2016/12/13',
            lastDatetimeReportWasRun: '2017/01/03',
            emailAddress: 'Gjohnston3@gmail.com',
            cellNumber: '084-123-8893',
            workTelephoneNumber: '011-502-0253',
            workExtension: '*77983',
            activeFromDate: '2016/11/13',
            inactiveDate: '',
            dateCreated: '2015/08/03',
            userIDLastUpdated: 'Admin1003',
            isStaff: true,
            extraString1: '',
            extraString10: '',
            extraDate1: '',
            extraDate10: '',
            extraBoolean1: false,
            extraBoolean10: false
        },
        {
            userID: 'Gerh4',
            firstName: 'Gerhard4',
            lastName: 'Johnston 4',
            nickName: 'Jonny 4',
            photoPath: '',
            lastDatetimeLoggedIn: '2016/12/14',
            lastDatetimeReportWasRun: '2017/01/04',
            emailAddress: 'Gjohnston4@gmail.com',
            cellNumber: '084-123-8894',
            workTelephoneNumber: '011-502-0254',
            workExtension: '*77984',
            activeFromDate: '2016/11/14',
            inactiveDate: '',
            dateCreated: '2015/08/04',
            userIDLastUpdated: 'Admin1004',
            isStaff: true,
            extraString1: '',
            extraString10: '',
            extraDate1: '',
            extraDate10: '',
            extraBoolean1: false,
            extraBoolean10: false
        },
        {
            userID: 'Gerh5',
            firstName: 'Gerhard5',
            lastName: 'Johnston 5',
            nickName: 'Jonny 5',
            photoPath: '',
            lastDatetimeLoggedIn: '2016/12/15',
            lastDatetimeReportWasRun: '2017/01/05',
            emailAddress: 'Gjohnston5@gmail.com',
            cellNumber: '084-123-8895',
            workTelephoneNumber: '011-502-0255',
            workExtension: '*77985',
            activeFromDate: '2016/11/15',
            inactiveDate: '',
            dateCreated: '2015/08/05',
            userIDLastUpdated: 'Admin1005',
            isStaff: true,
            extraString1: '',
            extraString10: '',
            extraDate1: '',
            extraDate10: '',
            extraBoolean1: false,
            extraBoolean10: false
        },
        {
            userID: 'Gerh6',
            firstName: 'Gerhard6',
            lastName: 'Johnston 6',
            nickName: 'Jonny 6',
            photoPath: '',
            lastDatetimeLoggedIn: '2016/12/16',
            lastDatetimeReportWasRun: '2017/01/06',
            emailAddress: 'Gjohnston6@gmail.com',
            cellNumber: '084-123-88916',
            workTelephoneNumber: '011-502-0256',
            workExtension: '*77986',
            activeFromDate: '2016/11/16',
            inactiveDate: '',
            dateCreated: '2015/08/06',
            userIDLastUpdated: 'Admin1006',
            isStaff: true,
            extraString1: '',
            extraString10: '',
            extraDate1: '',
            extraDate10: '',
            extraBoolean1: false,
            extraBoolean10: false
        },
        {
            userID: 'Gerh7',
            firstName: 'Gerhard7',
            lastName: 'Johnston 7',
            nickName: 'Jonny 7',
            photoPath: '',
            lastDatetimeLoggedIn: '2016/12/17',
            lastDatetimeReportWasRun: '2017/01/07',
            emailAddress: 'Gjohnston7@gmail.com',
            cellNumber: '084-123-88917',
            workTelephoneNumber: '011-502-0257',
            workExtension: '*77987',
            activeFromDate: '2016/11/17',
            inactiveDate: '',
            dateCreated: '2015/08/07',
            userIDLastUpdated: 'Admin1007',
            isStaff: true,
            extraString1: '',
            extraString10: '',
            extraDate1: '',
            extraDate10: '',
            extraBoolean1: false,
            extraBoolean10: false
        },
        {
            userID: 'Gerh8',
            firstName: 'Gerhard8',
            lastName: 'Johnston 8',
            nickName: 'Jonny 8',
            photoPath: '',
            lastDatetimeLoggedIn: '2016/12/18',
            lastDatetimeReportWasRun: '2017/01/08',
            emailAddress: 'Gjohnston8@gmail.com',
            cellNumber: '084-123-88918',
            workTelephoneNumber: '011-502-0258',
            workExtension: '*77988',
            activeFromDate: '2016/11/18',
            inactiveDate: '',
            dateCreated: '2015/08/08',
            userIDLastUpdated: 'Admin1008',
            isStaff: true,
            extraString1: '',
            extraString10: '',
            extraDate1: '',
            extraDate10: '',
            extraBoolean1: false,
            extraBoolean10: false
        },
        {
            userID: 'Gerh9',
            firstName: 'Gerhard9',
            lastName: 'Johnston 9',
            nickName: 'Jonny 9',
            photoPath: '',
            lastDatetimeLoggedIn: '2016/12/19',
            lastDatetimeReportWasRun: '2017/01/09',
            emailAddress: 'Gjohnston9@gmail.com',
            cellNumber: '084-123-88919',
            workTelephoneNumber: '011-502-0259',
            workExtension: '*77989',
            activeFromDate: '2016/11/19',
            inactiveDate: '',
            dateCreated: '2015/08/09',
            userIDLastUpdated: 'Admin1009',
            isStaff: true,
            extraString1: '',
            extraString10: '',
            extraDate1: '',
            extraDate10: '',
            extraBoolean1: false,
            extraBoolean10: false
        },
        {
            userID: 'Gerh10',
            firstName: 'Gerhard10',
            lastName: 'Johnston',
            nickName: 'Jonny',
            photoPath: '',
            lastDatetimeLoggedIn: '2016/12/18',
            lastDatetimeReportWasRun: '2017/01/01',
            emailAddress: 'Gjohnston10@gmail.com',
            cellNumber: '084-123-8891',
            workTelephoneNumber: '011-502-0250',
            workExtension: '*7798',
            activeFromDate: '2016/11/14',
            inactiveDate: '',
            dateCreated: '2015/08/09',
            userIDLastUpdated: 'Admin100',
            isStaff: true,
            extraString1: '',
            extraString10: '',
            extraDate1: '',
            extraDate10: '',
            extraBoolean1: false,
            extraBoolean10: false
        },
        {
            userID: 'Gerh11',
            firstName: 'Gerhard11',
            lastName: 'Johnston',
            nickName: 'Jonny',
            photoPath: '',
            lastDatetimeLoggedIn: '2016/12/18',
            lastDatetimeReportWasRun: '2017/01/01',
            emailAddress: 'Gjohnston11@gmail.com',
            cellNumber: '084-123-8891',
            workTelephoneNumber: '011-502-0250',
            workExtension: '*7798',
            activeFromDate: '2016/11/14',
            inactiveDate: '',
            dateCreated: '2015/08/09',
            userIDLastUpdated: 'Admin100',
            isStaff: true,
            extraString1: '',
            extraString10: '',
            extraDate1: '',
            extraDate10: '',
            extraBoolean1: false,
            extraBoolean10: false
        },
        {
            userID: 'Gerh12',
            firstName: 'Gerhard12',
            lastName: 'Johnston',
            nickName: 'Jonny',
            photoPath: '',
            lastDatetimeLoggedIn: '2016/12/18',
            lastDatetimeReportWasRun: '2017/01/01',
            emailAddress: 'Gjohnston12@gmail.com',
            cellNumber: '084-123-8891',
            workTelephoneNumber: '011-502-0250',
            workExtension: '*7798',
            activeFromDate: '2016/11/14',
            inactiveDate: '',
            dateCreated: '2015/08/09',
            userIDLastUpdated: 'Admin100',
            isStaff: true,
            extraString1: '',
            extraString10: '',
            extraDate1: '',
            extraDate10: '',
            extraBoolean1: false,
            extraBoolean10: false
        },
        {
            userID: 'Gerh13',
            firstName: 'Gerhard13',
            lastName: 'Johnston',
            nickName: 'Jonny',
            photoPath: '',
            lastDatetimeLoggedIn: '2016/12/18',
            lastDatetimeReportWasRun: '2017/01/01',
            emailAddress: 'Gjohnston13@gmail.com',
            cellNumber: '084-123-8891',
            workTelephoneNumber: '011-502-0250',
            workExtension: '*7798',
            activeFromDate: '2016/11/14',
            inactiveDate: '',
            dateCreated: '2015/08/09',
            userIDLastUpdated: 'Admin100',
            isStaff: true,
            extraString1: '',
            extraString10: '',
            extraDate1: '',
            extraDate10: '',
            extraBoolean1: false,
            extraBoolean10: false
        },
        {
            userID: 'Gerh14',
            firstName: 'Gerhard14',
            lastName: 'Johnston',
            nickName: 'Jonny',
            photoPath: '',
            lastDatetimeLoggedIn: '2016/12/18',
            lastDatetimeReportWasRun: '2017/01/01',
            emailAddress: 'Gjohnston14@gmail.com',
            cellNumber: '084-123-8891',
            workTelephoneNumber: '011-502-0250',
            workExtension: '*7798',
            activeFromDate: '2016/11/14',
            inactiveDate: '',
            dateCreated: '2015/08/09',
            userIDLastUpdated: 'Admin100',
            isStaff: true,
            extraString1: '',
            extraString10: '',
            extraDate1: '',
            extraDate10: '',
            extraBoolean1: false,
            extraBoolean10: false
        },
        {
            userID: 'Gerh15',
            firstName: 'Gerhard15',
            lastName: 'Johnston',
            nickName: 'Jonny',
            photoPath: '',
            lastDatetimeLoggedIn: '2016/12/18',
            lastDatetimeReportWasRun: '2017/01/01',
            emailAddress: 'Gjohnston15@gmail.com',
            cellNumber: '084-123-8891',
            workTelephoneNumber: '011-502-0250',
            workExtension: '*7798',
            activeFromDate: '2016/11/14',
            inactiveDate: '',
            dateCreated: '2015/08/09',
            userIDLastUpdated: 'Admin100',
            isStaff: true,
            extraString1: '',
            extraString10: '',
            extraDate1: '',
            extraDate10: '',
            extraBoolean1: false,
            extraBoolean10: false
        }
    ];

export const DASHBOARDS: Dashboard[] =
    [
        {
            dashboardID: 0,
            dashboardCode: 'Bar charts',
            dashboardName: 'Collection of Bar charts',

            dashboardBackgroundPicturePath: '',
            dashboardComments: 'Comments bla-bla-bla',
            dashboardCreatedDateTime: '2017/07/08',
            dashboardCreatedUserID: 'BenVdMark',
            dashboardDefaultExportFileType: 'PowerPoint',
            dashboardDescription: 'This is a unique and special dashboard, like all others',
            dashboardGroups: [
                { dashboardGroupName: 'Favourites' },
                { dashboardGroupName: 'Everyone'}
            ],
            dashboardIsLocked: false,
            dashboardLiked: [
                { dashboardLikedUserID: 'AnnieA' },
                { dashboardLikedUserID: 'BennieB' },
                { dashboardLikedUserID: 'CharlesC' }
            ],
            dashboardOpenTabNr: 1,
            dashboardOwnerUserID: 'JohnH',
            dashboardPassword: 'StudeBaker',
            dashboardRefreshedDateTime: '',
            dashboardRefreshMode: 'Manual',
            dashboardSharedWith: [
                {
                    dashboardSharedWithUserID: 'PeterP',
                    dashboardSharedWithType: 'Full'
                }
            ],
            dashboardSystemMessage: '',
            dashboardUpdatedDateTime: '2017/07/08',
            dashboardUpdatedUserID: 'GordenJ'
        },
        {
            dashboardID: 1,
            dashboardCode: 'Pie charts',
            dashboardName: 'Collection of Pie charts',

            dashboardBackgroundPicturePath: '',
            dashboardComments: 'No Comment',
            dashboardCreatedDateTime: '2016/07/08',
            dashboardCreatedUserID: 'GranalN',
            dashboardDefaultExportFileType: 'Excel',
            dashboardDescription: 'Just another Dashboard',
            dashboardGroups: [
                { dashboardGroupName: 'Stats' },
                { dashboardGroupName: 'Everyone'}
            ],
            dashboardIsLocked: true,
            dashboardLiked: [
                { dashboardLikedUserID: '' }
            ],
            dashboardOpenTabNr: 0,
            dashboardOwnerUserID: 'AshR',
            dashboardPassword: '',
            dashboardRefreshedDateTime: '2016/08/07',
            dashboardRefreshMode: 'Manual',
            dashboardSharedWith: [
                {
                    dashboardSharedWithUserID: '',
                    dashboardSharedWithType: ''
                }
            ],
            dashboardSystemMessage: '',
            dashboardUpdatedDateTime: '2016/09/08',
            dashboardUpdatedUserID: 'JerimiaA'
        },
        {
            dashboardID: 3,
            dashboardCode: 'Tree map',
            dashboardName: 'Tree map ...',

            dashboardBackgroundPicturePath: '',
            dashboardComments: 'No Comment',
            dashboardCreatedDateTime: '2016/07/08',
            dashboardCreatedUserID: 'GranalN',
            dashboardDefaultExportFileType: 'Excel',
            dashboardDescription: 'Just another Dashboard',
            dashboardGroups: [
                { dashboardGroupName: 'Stats' },
                { dashboardGroupName: 'Everyone'}
            ],
            dashboardIsLocked: true,
            dashboardLiked: [
                { dashboardLikedUserID: '' }
            ],
            dashboardOpenTabNr: 0,
            dashboardOwnerUserID: 'AshR',
            dashboardPassword: '',
            dashboardRefreshedDateTime: '2016/08/07',
            dashboardRefreshMode: 'Manual',
            dashboardSharedWith: [
                {
                    dashboardSharedWithUserID: '',
                    dashboardSharedWithType: ''
                }
            ],
            dashboardSystemMessage: '',
            dashboardUpdatedDateTime: '2016/09/08',
            dashboardUpdatedUserID: 'JerimiaA'
        },
        {
            dashboardID: 4,
            dashboardCode: 'Word Cloud',
            dashboardName: 'Word Cloud of random text',

            dashboardBackgroundPicturePath: '',
            dashboardComments: 'No Comment',
            dashboardCreatedDateTime: '2016/07/08',
            dashboardCreatedUserID: 'GranalN',
            dashboardDefaultExportFileType: 'Excel',
            dashboardDescription: 'Just another Dashboard',
            dashboardGroups: [
                { dashboardGroupName: 'Stats' },
                { dashboardGroupName: 'Everyone'}
            ],
            dashboardIsLocked: true,
            dashboardLiked: [
                { dashboardLikedUserID: '' }
            ],
            dashboardOpenTabNr: 0,
            dashboardOwnerUserID: 'AshR',
            dashboardPassword: '',
            dashboardRefreshedDateTime: '2016/08/07',
            dashboardRefreshMode: 'Manual',
            dashboardSharedWith: [
                {
                    dashboardSharedWithUserID: '',
                    dashboardSharedWithType: ''
                }
            ],
            dashboardSystemMessage: '',
            dashboardUpdatedDateTime: '2016/09/08',
            dashboardUpdatedUserID: 'JerimiaA'
        },
        {
            dashboardID: 5,
            dashboardCode: 'Jobs timeseries',
            dashboardName: 'Stacked grap with jobs timeseries',

            dashboardBackgroundPicturePath: '',
            dashboardComments: 'No Comment',
            dashboardCreatedDateTime: '2016/07/08',
            dashboardCreatedUserID: 'GranalN',
            dashboardDefaultExportFileType: 'Excel',
            dashboardDescription: 'Just another Dashboard',
            dashboardGroups: [
                { dashboardGroupName: 'Stats' },
                { dashboardGroupName: 'Everyone'}
            ],
            dashboardIsLocked: true,
            dashboardLiked: [
                { dashboardLikedUserID: '' }
            ],
            dashboardOpenTabNr: 0,
            dashboardOwnerUserID: 'AshR',
            dashboardPassword: '',
            dashboardRefreshedDateTime: '2016/08/07',
            dashboardRefreshMode: 'Manual',
            dashboardSharedWith: [
                {
                    dashboardSharedWithUserID: '',
                    dashboardSharedWithType: ''
                }
            ],
            dashboardSystemMessage: '',
            dashboardUpdatedDateTime: '2016/09/08',
            dashboardUpdatedUserID: 'JerimiaA'
        },
        {
            dashboardID: 6,
            dashboardCode: 'Another Dash',
            dashboardName: '',

            dashboardBackgroundPicturePath: '',
            dashboardComments: 'No Comment',
            dashboardCreatedDateTime: '2016/07/08',
            dashboardCreatedUserID: 'GranalN',
            dashboardDefaultExportFileType: 'Excel',
            dashboardDescription: 'Just another Dashboard',
            dashboardGroups: [
                { dashboardGroupName: 'Stats' },
                { dashboardGroupName: 'Everyone'}
            ],
            dashboardIsLocked: true,
            dashboardLiked: [
                { dashboardLikedUserID: '' }
            ],
            dashboardOpenTabNr: 0,
            dashboardOwnerUserID: 'AshR',
            dashboardPassword: '',
            dashboardRefreshedDateTime: '2016/08/07',
            dashboardRefreshMode: 'Manual',
            dashboardSharedWith: [
                {
                    dashboardSharedWithUserID: '',
                    dashboardSharedWithType: ''
                }
            ],
            dashboardSystemMessage: '',
            dashboardUpdatedDateTime: '2016/09/08',
            dashboardUpdatedUserID: 'JerimiaA'
        }
    ];

export const DASHBOARDTABS: DashboardTab[] =
    [ 
        {
            dashboardID: 0,
            widgetTabID: 0,
            widgetTabName: 'Value',
            widgetTabDescription: '0-Value: Full and detailed desription of tab - purpose'
        },
        {
            dashboardID: 0,
            widgetTabID: 1,
            widgetTabName: 'Volume',
            widgetTabDescription: '0-Volume: Full and detailed desription of tab - purpose'
        },        {
            dashboardID: 1,
            widgetTabID: 2,
            widgetTabName: 'Value',
            widgetTabDescription: 'Full and detailed desription of tab - purpose'
        },
        {
            dashboardID: 1,
            widgetTabID: 3,
            widgetTabName: 'Volume',
            widgetTabDescription: '1-Value: Full and detailed desription of tab - purpose'
        },
        {
            dashboardID: 3,
            widgetTabID: 4,
            widgetTabName: 'Value',
            widgetTabDescription: '3-Value: Full and detailed desription of tab - purpose'
        },
        {
            dashboardID: 4,
            widgetTabID: 5,
            widgetTabName: 'Value',
            widgetTabDescription: '4-Value: Full and detailed desription of tab - purpose'
        },
        {
            dashboardID: 5,
            widgetTabID: 6,
            widgetTabName: 'Value',
            widgetTabDescription: '5-Value: Full and detailed desription of tab - purpose'
        },
    ];

export const WIDGETS: Widget[] =
    [
        {
            container: {
                backgroundColor: 'chocolate',
                border: '2px solid white',
                boxShadow: '4px 4px 12px gray',
                color: 'black',
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
                textText: 'Historic growth taking market factors and external influences into account in the statistics',
                textBackgroundColor: 'transparent',
                textBorder: 'none',
                textColor: 'black',
                textFontSize: 16,        
                textFontWeight: 'normal',
                textHeight: 12,
                textLeft: 0,
                textMargin: '0 5px 0 5px',
                textPadding:  '5px 0 5px',
                textPosition: 'absolute',
                textTextAlign: 'left',
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
                tableColor: 'transparent',
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
                imageHeigt: 220,
                imageLeft: 5,
                imageSource: '../assets/StackedBar.png',
                imageTop: 70,
                imageWidth: 360,
            },
            properties: {
                widgetID: 1,
                dashboardID: 0,
                widgetTabID: 0,
                widgetTabName: "Value",
                widgetCode: 'FirstBar',
                widgetName: 'Bar Chart 1',
                widgetAddRestRow: true,
                widgetCreatedDateTime: '',
                widgetCreatedUserID: '',
                widgetComments: 'Just a common comment',
                widgetDefaultExportFileType: '.png',
                widgetDescription: 'This graph show empirical bla-bla-bla ..',
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
                backgroundColor: 'brisque',
                border: '2px solid white',
                boxShadow: '4px 4px 12px gray',
                color: 'brown',
                fontSize: 1,
                height: 390,
                left: 640,
                widgetTitle: 'Headcount Comparison',
                top: 80,
                width: 380,
            },
            areas: {
                showWidgetText: true,
                showWidgetGraph: true,
                showWidgetTable: true,
                showWidgetImage: false,
            },
            textual: {
                textText: 'Historic growth taking market factors and external influences into account in the statistics',
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
                tableColor: 'transparent',
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
                widgetTabID: 0,
                widgetTabName: "Value",
                widgetCode: 'SecondBar',
                widgetName: 'Bar Chart 2',

                widgetAddRestRow: true,
                widgetCreatedDateTime: '',
                widgetCreatedUserID: '',
                widgetComments: '',
                widgetDefaultExportFileType: '',
                widgetDescription: '',
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
                backgroundColor: 'yellowgreen',
                border: '2px solid white',
                boxShadow: '4px 4px 12px gray',
                color: 'brown',
                fontSize: 1,
                height: 310,
                left: 370,
                widgetTitle: 'Sales 2013',
                top: 380,
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
                tableColor: 'transparent',
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
                widgetTabID: 0,
                widgetTabName: "Value",
                widgetCode: 'ThirdBar',
                widgetName: 'Bar Chart 3',

                widgetAddRestRow: true,
                widgetCreatedDateTime: '',
                widgetCreatedUserID: '',
                widgetComments: '',
                widgetDefaultExportFileType: '',
                widgetDescription: '',
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
                tableColor: 'transparent',
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
                widgetTabID: 1,
                widgetTabName: "Volume",
                widgetCode: 'FourthBar',
                widgetName: 'Bar Chart 4',

                widgetAddRestRow: true,
                widgetCreatedDateTime: '',
                widgetCreatedUserID: '',
                widgetComments: '',
                widgetDefaultExportFileType: '',
                widgetDescription: '',
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
                tableColor: 'transparent',
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
                widgetTabID: 1,
                widgetTabName: "Volume",
                widgetCode: 'FifthBar',
                widgetName: 'Bar Chart 5',

                widgetAddRestRow: true,
                widgetCreatedDateTime: '',
                widgetCreatedUserID: '',
                widgetComments: 'Just simple comments',
                widgetDefaultExportFileType: '',
                widgetDescription: '',
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
                tableColor: 'transparent',
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
                widgetTabID: 2,
                widgetTabName: "Value",
                widgetCode: 'FirstPie',
                widgetName: 'Pie contracts per Broker 2',

                widgetAddRestRow: true,
                widgetCreatedDateTime: '',
                widgetCreatedUserID: '',
                widgetComments: '',
                widgetDefaultExportFileType: '',
                widgetDescription: '',
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
                tableColor: 'transparent',
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
                widgetTabID: 3,
                widgetTabName: "Volume",
                widgetCode: 'SecondBar',
                widgetName: 'Line Volume 1',

                widgetAddRestRow: true,
                widgetCreatedDateTime: '',
                widgetCreatedUserID: '',
                widgetComments: '',
                widgetDefaultExportFileType: '',
                widgetDescription: '',
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
                tableColor: 'transparent',
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
                widgetTabID: 4,
                widgetTabName: "Value",
                widgetCode: 'FirstPie',
                widgetName: 'Pie contracts per Broker 2',

                widgetAddRestRow: true,
                widgetCreatedDateTime: '',
                widgetCreatedUserID: '',
                widgetComments: '',
                widgetDefaultExportFileType: '',
                widgetDescription: '',
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
                tableColor: 'transparent',
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
                widgetTabID: 4,
                widgetTabName: "Value",
                widgetCode: 'FirstPie',
                widgetName: 'Pie contracts per Broker 2',

                widgetAddRestRow: true,
                widgetCreatedDateTime: '',
                widgetCreatedUserID: '',
                widgetComments: '',
                widgetDefaultExportFileType: '',
                widgetDescription: '',
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
                tableColor: 'transparent',
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
                widgetTabID: 5,
                widgetTabName: "Value",
                widgetCode: 'FirstPie',
                widgetName: 'Pie contracts per Broker 2',

                widgetAddRestRow: true,
                widgetCreatedDateTime: '',
                widgetCreatedUserID: '',
                widgetComments: '',
                widgetDefaultExportFileType: '',
                widgetDescription: '',
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
                tableColor: 'transparent',
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
                widgetTabID: 6,
                widgetTabName: "Value",
                widgetCode: 'FirstPie',
                widgetName: 'Pie contracts per Broker 2',

                widgetAddRestRow: true,
                widgetCreatedDateTime: '',
                widgetCreatedUserID: '',
                widgetComments: '',
                widgetDefaultExportFileType: '',
                widgetDescription: '',
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
            dataSourceID: 12,
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

@Injectable()
export class EazlService {

    users: User[] = USERS;                                  // List of Users
    dashboards: Dashboard[] = DASHBOARDS;                   // List of Dashboards
    dashboardTabs: DashboardTab[] = DASHBOARDTABS;          // List of Dashboard Tabs
    reports: Report[] = REPORTS;                            // List of Reports
    reportWidgetSet: ReportWidgetSet[] = REPORTWIDGETSET;   // List of WidgetSets per Report
    widgetComments: WidgetComment[] = WIDGETCOMMENTS;       // List of Widget Comments
    widgetTemplates: WidgetTemplate[] = WIDGETTEMPLATES     // List of Widget Templates
    widgets: Widget[] = WIDGETS;                            // List of Widgets for a selected Dashboard

    constructor(
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        ) {
    }

    addUser(user: User) {
        // Adds a new User to the DB
        this.globalFunctionService.printToConsole(this.constructor.name,'addUser', '@Start');

        this.users.push(user);
    }

    getUsers(){
        // Return a list of Users
        this.globalFunctionService.printToConsole(this.constructor.name,'getUsers', '@Start');

        return this.users;
    }

    getDashboards(dashboardID: number = -1) {
        // Return a list of Dashboards
        // - dashboardID Optional parameter to select ONE, else select ALL (if >= 0)

        this.globalFunctionService.printToConsole(this.constructor.name,'getDashboards', '@Start');

        // Calc WIDGET certain fields, as it is easy to use in *ngIf or *ngFor
        // TODO - this is impure - do better
        for (var i = 0, len = this.widgets.length; i < len; i++) {

            // Set properties.widgetIsLiked if there are users who liked it
            for (var j = 0, len = this.widgets[i].properties.widgetLiked.length; j < len; j++) {

                if (this.widgets[i].properties.widgetLiked[j].widgetLikedUserID != '') {
                    this.widgets[i].properties.widgetIsLiked = true;
                } else {
                    this.widgets[i].properties.widgetIsLiked = false;
                }
            }
        }

        // TODO - when from DB, fill the properties.widgetComments field with the latest
        //        comment from the widgetComments table.  This is used in *ngIf

        // TODO - get a standard set of methods, ie getXXX returns all, findXXX returns one.
        //        OR, use TS standard with .filter, .find, etc .... ??
        // IF an ID was provided, only return that one.  Else, al
        let resultDashboards: Dashboard[] = [];
        if (dashboardID == -1) { 
            resultDashboards = this.dashboards;
        }
        else {
            resultDashboards = this.dashboards.filter( 
                dash => dash.dashboardID == dashboardID
            )
        }

        return resultDashboards;
    }

    getDashboardTabs(selectedDashboardID: number) {
        // Return a list of Dashboards
        this.globalFunctionService.printToConsole(this.constructor.name,'getDashboardTabs', '@Start');

        return this.dashboardTabs.filter(tab => tab.dashboardID == selectedDashboardID);
    }

    getWidgetsForDashboard(selectedDashboardID: number, selectedDashboarTabName: string) {
        // Return a list of Dashboards
        this.globalFunctionService.printToConsole(this.constructor.name,'getWidgetsForDashboard', '@Start');

        return this.widgets.filter(widget =>
            widget.properties.dashboardID == selectedDashboardID &&
            widget.properties.widgetTabName == selectedDashboarTabName
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
                tableColor: 'transparent',
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
                widgetTabID: 0,
                widgetTabName: '',
                widgetCode: '',
                widgetName: '',
                widgetAddRestRow: false,
                widgetCreatedDateTime: '',
                widgetCreatedUserID: '',
                widgetComments: '',
                widgetDefaultExportFileType: '',
                widgetDescription: '',
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

    getReports(): Report[] {
        // Return a list of Reports
        this.globalFunctionService.printToConsole(this.constructor.name,'getReports', '@Start');

        return this.reports;
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

    getReportWidgetSets(reportID: number): ReportWidgetSet[] {
        // Return a list of WidgetSets per Report
        this.globalFunctionService.printToConsole(this.constructor.name,'getReportWidgetSets', '@Start');

        return this.reportWidgetSet.filter(wset => wset.reportID == reportID);
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
}
