// Widget Builder - Popup form to Add / Edit Widget
import { Component }                  from '@angular/core';
import { ElementRef }                 from '@angular/core';
import { EventEmitter }               from '@angular/core';
import { FormBuilder }                from '@angular/forms';
import { FormControl }                from '@angular/forms';
import { FormGroup }                  from '@angular/forms';
import { Input }                      from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Output }                     from '@angular/core';
import { Renderer }                   from '@angular/core';
import { Validators }                 from '@angular/forms';
import { ViewChild }                  from '@angular/core';

//  PrimeNG stuffies
import { SelectItem }                 from 'primeng/primeng';

// Our Services
import { CanvasDate }                 from './date.services';
import { EazlService }                from './eazl.service';
import { GlobalFunctionService }      from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';

// Our models
import { DashboardTab }               from './model.dashboardTabs';
import { Report }                     from './model.report';
import { ReportWidgetSet }            from './model.report.widgetSets';
import { SelectedItem }               from './model.selectedItem';
import { SelectedItemColor }          from './model.selectedItemColor';
import { Widget }                     from './model.widget';
import { WidgetComment }              from './model.widget.comment';
import { WidgetTemplate }             from './model.widgetTemplates';
import { WidgetType }                 from './model.widget.type';

// Our Models
import { CanvasColors }               from './chartcolors.data';
import { CanvasUser }                 from './model.user';

// Vega stuffies
let vg = require('vega/index.js');

@Component({
    selector:    'widget-editor',
    templateUrl: 'widget-editor.component.html',
    styleUrls:  ['widget-editor.component.css']
})
export class WidgetEditorComponent implements OnInit {

    @Input() addEditMode: string;
    @Input() displayEditWidget: boolean;
    @Input() originalDashboardID: number;
    @Input() originalDashboardTab: SelectedItem;
    @Input() widgetToEdit: Widget;
    @Input() widgetIDtoEdit: number;
    @Input() widgetToEditX: number;
    @Input() widgetToEditY: number;

    // Event emitter sends event back to parent component once Submit button was clicked
    @Output() formSubmit: EventEmitter<string> = new EventEmitter();

    @ViewChild('widget') widgetGraph: ElementRef;             // Attaches to # in DOM

    canvasUser: CanvasUser = this.globalVariableService.canvasUser.getValue();
    selectedReportID: number;                   // Selected in DropDown
    selectedReportFieldX: string;               // Selected in DropDown
    selectedReportFieldY: string;               // Selected in DropDown
    selectedDashboard: SelectedItem;            // Selected in DropDown
    selectedDashboardTab: SelectedItem;         // Selected in DropDown
    selectedReport: SelectedItem;               // Selected in Report DropDown
    selectedVegaXcolumn: SelectedItem;          // Selected in DropDown
    selectedVegaYcolumn: SelectedItem;          // Selected in DropDown
    selectedVegaFillColor: SelectedItemColor;   // Selected in DropDown
    selectedVegaHoverColor: SelectedItemColor;  // Selected in DropDown
    selectedWidgetSetDescription: string;       // Description of the selected WidgetSet
    submitted: boolean;                         // True if form submitted

    showWidgetText: boolean = false;            // True to show Text in containter
    showWidgetGraph: boolean = false;           // True to show Graph in Containter
    showWidgetTable: boolean = false;           // True to show Table in Containter
    showWidgetImage: boolean = false;           // True to show Image in Containter

    reports: Report[];                          // List of Reports
    reportsDropDown:  SelectItem[];             // Drop Down options
    reportWidgetSets: ReportWidgetSet[];        // List of Report WidgetSets
    reportFields: string[];                     // List of Report Fields
    reportWidgetSetsDropDown:  SelectItem[];    // Drop Down options
    reportFieldsDropDown:  SelectItem[];        // Drop Down options
    selectedWidgetType: WidgetType;             // Selected graph type
    selectedItem: SelectedItem;                 // Selected Object: note ANY to cater for ID number, string
    selectedItemColor: SelectedItemColor;       // Selected Object: note ANY to cater for ID number, string
    widgetTemplate: WidgetTemplate;             // List of Widget Templates

    dashboardTabs: DashboardTab[];              // List of Dashboard Tabs
    dashboardDropDown: SelectItem[];            // Drop Down options
    dashboardTabsDropDown: SelectItem[];        // Drop Down options
    selectedWidgetCreation: SelectedItem;       // Selected option to create Widget
    selectedTextBackground: SelectedItemColor;  // Selected option for Text Background
    selectedTextBorder: SelectedItem;           // Selected option for Text Border
    selectedTextColor: SelectedItem;            // Selected option for Text Color
    selectedTextFontSize: SelectedItem;         // Selected option for Text Font Size
    selectedTextFontWeight: SelectedItem;       // Selected option for Text Font Weight
    selectedTextMargin: SelectedItem;           // Selected option for Text Margin
    selectedTextPadding: SelectedItem;          // Selected option for Text Box Padding
    selectedTextPosition: SelectedItem;         // Selected option for Text Box Position
    selectedTextAlign: SelectedItem;            // Selected option for Text Alignment in box
    selectedTableColor: SelectedItemColor;      // Selected option for Table Color
    widgetCreationDropDown: WidgetType[];       // Drop Down options

    gridSize: number;                           // Size of grid blocks, ie 3px x 3px
    isNotCustomSpec: boolean = true;            // True if NOT a Custom widget
    isVegaSpecBad: boolean = true;              // True if Vega spec is bad
    selectedImageSrc: SelectedItem;             // Selected option for Image Src file
    snapToGrid: boolean = true;                 // If true, snap widgets to gridSize

    // Form Controls, validation and loading stuffies
    errorMessageOnForm: string = '';
    formIsValid: boolean = false;
    identificationForm: FormGroup;
    isLoadingForm: boolean = false;
    numberErrors: number = 0;

    // Variables for Startup properties of a Widget
    borderDropdown: SelectItem[];               // Options for Border DropDown
    boxShadowDropdowns: SelectItem[];           // Options for Box-Shadow DropDown
    chartColor: SelectItem[];                   // Options for Background-Color DropDown
    fontSizeDropdowns: SelectItem[];              // Options for Font Size of text box
    fontWeightOptions: SelectItem[];            // Options for Font Weight of text box
    imageSourceOptions: SelectItem[];           // Options for image src (path + file in png, jpg or gif)
    textMarginOptions: SelectItem[];            // Options for Margins around text box
    textPaddingOptions: SelectItem[];           // Options for Padding around text box
    textPositionOptions: SelectItem[];          // Options for Position of the text box (absolute or not)
    textAlignOptions: SelectItem[];             // Options for horisontal align of the text (left, center, right)

    // Vars read from config, setted once changed for next time
    lastContainerFontSize: SelectedItem;
    lastColor: SelectedItemColor;
    lastBoxShadow: SelectedItem;
    lastBorder: SelectedItem;
    lastBackgroundColor: SelectedItemColor;
    lastWidgetHeight: number;
    lastWidgetWidth: number;
    lastWidgetLeft: number;
    lastWidgetTop: number;

    constructor(
        private canvasColors: CanvasColors,
        private canvasDate: CanvasDate,
        private eazlService: EazlService,
        private fb: FormBuilder,
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private renderer : Renderer,
    ) {
    }

    ngOnInit() {
        //   Form initialisation
        this.globalFunctionService.printToConsole(this.constructor.name, 'ngOnInit', '@Start');

        // Define form group for first tab
        this.identificationForm = this.fb.group(
            {
                'dashboardName':                new FormControl(''),
                'dashboardTabName':             new FormControl(''),
                'showWidgetText':               new FormControl(''),
                'showWidgetGraph':              new FormControl(''),
                'showWidgetTable':              new FormControl(''),
                'showWidgetImage':              new FormControl(''),
                'textText':                     new FormControl(''),
                'textBackgroundColor':          new FormControl(''),
                'textBorder':                   new FormControl(''),
                'textColor':                    new FormControl(''),
                'textFontSize':                 new FormControl(''),
                'textFontWeight':               new FormControl(''),
                'textHeight':                   new FormControl('', Validators.pattern('^[0-9]*$')),
                'textLeft':                     new FormControl('', Validators.pattern('^[0-9]*$')),
                'textMargin':                   new FormControl(''),
                'textPadding':                  new FormControl(''),
                'textPosition':                 new FormControl(''),
                'textTextAlign':                new FormControl(''),
                'textTop':                      new FormControl('', Validators.pattern('^[0-9]*$')),
                'textWidth':                    new FormControl('', Validators.pattern('^[0-9]*$')),
                'tableHideHeader':              new FormControl(''),
                'tableColor':                   new FormControl(''),
                'tableCols':                    new FormControl('', Validators.pattern('^[0-9]*$')),
                'tableRows':                    new FormControl('', Validators.pattern('^[0-9]*$')),
                'tableHeight':                  new FormControl('', Validators.pattern('^[0-9]*$')),
                'tableWidth':                   new FormControl('', Validators.pattern('^[0-9]*$')),
                'tableLeft':                    new FormControl('', Validators.pattern('^[0-9]*$')),
                'tableTop':                     new FormControl('', Validators.pattern('^[0-9]*$')),
                'imageAlt':                     new FormControl(''),
                'imageHeigt':                   new FormControl('', Validators.pattern('^[0-9]*$')),
                'imageLeft':                    new FormControl('', Validators.pattern('^[0-9]*$')),
                'imageSource':                  new FormControl(''),
                'imageTop':                     new FormControl('', Validators.pattern('^[0-9]*$')),
                'imageWidth':                   new FormControl('', Validators.pattern('^[0-9]*$')),
                'widgetTitle':                  new FormControl(''),
                'widgetCode':                   new FormControl(''),
                'widgetName':                   new FormControl(''),
                'widgetDescription':            new FormControl(''),
                'widgetDefaultExportFileType':  new FormControl(''),
                'widgetHyperLinkTabNr':         new FormControl(''),
                'widgetHyperLinkWidgetID':      new FormControl('', Validators.pattern('^[0-9]*$')),
                'widgetRefreshMode':            new FormControl(''),
                'widgetRefreshFrequency':       new FormControl('', Validators.pattern('^[0-9]*$')),
                'widgetPassword':               new FormControl(''),
                'NrwidgetLiked':                new FormControl(''),
                'widgetReportName':             new FormControl(''),
                'widgetReportParameters':       new FormControl(''),
                'widgetShowLimitedRows':        new FormControl('', Validators.pattern('^[0-9]*$')),
                'widgetAddRestRow':             new FormControl(''),
                'widgetType':                   new FormControl(''),
                'widgetReportWidgetSet':        new FormControl(''),
                'vegaGraphHeight':              new FormControl('', Validators.pattern('^[0-9]*$')),
                'vegaGraphWidth':               new FormControl('', Validators.pattern('^[0-9]*$')),
                'vegaGraphPadding':             new FormControl('', Validators.pattern('^[0-9]*$')),
                'vegaHasSignals':               new FormControl(''),
                'vegaXcolumn':                  new FormControl(''),
                'vegaYcolumn':                  new FormControl(''),
                'vegaFillColor':                new FormControl(''),
                'vegaHoverColor':               new FormControl(''),
                'vegaSpec':                     new FormControl('')
            }
        );

        // Dashboards
        this.dashboardDropDown = this.eazlService.getDashboardSelectionItems();

        // Background Colors Options
        this.chartColor = [];
        this.chartColor = this.canvasColors.getColors();

        // Border Options
        this.borderDropdown = [];
        this.borderDropdown = this.eazlService.getBorderDropdowns();

        // BoxShadow Options
        this.boxShadowDropdowns = [];
        this.boxShadowDropdowns = this.eazlService.getBoxShadowDropdowns();

        // Font Size Options
        this.fontSizeDropdowns = [];
        this.fontSizeDropdowns = this.eazlService.getFontSizeDropdowns();
        // this.fontSizeDropdowns.push({label:'16',   value:{id:1, name: '16'}});
        // this.fontSizeDropdowns.push({label:'32',   value:{id:1, name: '32'}});
        // this.fontSizeDropdowns.push({label:'48',   value:{id:1, name: '48'}});
        // this.fontSizeDropdowns.push({label:'60',   value:{id:1, name: '60'}});
        // this.fontSizeDropdowns.push({label:'72',   value:{id:1, name: '72'}});
        // this.fontSizeDropdowns.push({label:'84',   value:{id:1, name: '84'}});

        // Font Weight Options
        this.fontWeightOptions = [];
        this.fontWeightOptions.push({label:'Normal', value:{id:1, name: 'normal'}});
        this.fontWeightOptions.push({label:'Bold',   value:{id:1, name: 'bold'}});

        // Text Margin Options
        this.textMarginOptions = [];
        this.textMarginOptions.push({label:'None',   value:{id:1, name: '0'}});
        this.textMarginOptions.push({label:'Small',  value:{id:1, name: '5px 5px 5px 5px'}});
        this.textMarginOptions.push({label:'Medium', value:{id:1, name: '20px 20px 20px 20px'}});
        this.textMarginOptions.push({label:'Large',  value:{id:1, name: '50px 50px 50px 50px'}});

        // Text Padding Options
        this.textPaddingOptions = [];
        this.textPaddingOptions.push({label:'None',   value:{id:1, name: '0'}});
        this.textPaddingOptions.push({label:'Small',  value:{id:1, name: '5px 5px 5px 5px'}});
        this.textPaddingOptions.push({label:'Medium', value:{id:1, name: '20px 20px 20px 20px'}});
        this.textPaddingOptions.push({label:'Large',  value:{id:1, name: '50px 50px 50px 50px'}});

        // Text Position Options
        this.textPositionOptions = [];
        this.textPositionOptions.push({label:'Relative',  value:{id:1, name: 'relative'}});
        this.textPositionOptions.push({label:'Absolute',  value:{id:1, name: 'absolute'}});

        // Text Margin Options
        this.textAlignOptions = [];
        this.textAlignOptions.push({label:'Left',     value:{id:1, name: 'left'}});
        this.textAlignOptions.push({label:'Center',   value:{id:1, name: 'center'}});
        this.textAlignOptions.push({label:'Right',    value:{id:1, name: 'right'}});

        // Text Margin Options
        // TODO - make id = 1 for now, find a better solution for later
        this.imageSourceOptions = [];
        this.imageSourceOptions.push({label:'Coffee', value:{id:1, name: '../assets/coffee.jpg'}});

        // Load the startup form info
        this.setStartupFormValues();

        // Set startup Widget Template
        this.loadWidgetTemplateFields();

        // Set startup stuffies
        this.snapToGrid = this.globalVariableService.snapToGrid.getValue();
        this.gridSize = this.globalVariableService.gridSize.getValue();

    }

    setStartupFormValues() {
        // Reacts to changes in selectedWidget
        this.globalFunctionService.printToConsole(this.constructor.name, 'setStartupFormValues', '@Start');

        // Set spec as string for ngModel in View
        this.globalFunctionService.printToConsole(this.constructor.name, 'setStartupFormValues',
            'Mode (Add / Edit) is: ' + this.addEditMode);
        this.globalFunctionService.printToConsole(this.constructor.name, 'setStartupFormValues',
            'Edit Widget Form is open: ' + this.displayEditWidget.toString());

        // Load the Reports, and Dashboard Tabs
        this.loadReports();
        this.loadDashboardTabs();

        // Clear the form for new one
        if (this.addEditMode == 'Add' && this.displayEditWidget) {

            this.identificationForm.reset();
            this.identificationForm.reset();
            this.identificationForm.reset();
        }

        // Populate the popup form when it is opened, and in Edit mode only
        if (this.addEditMode == 'Edit' && this.displayEditWidget) {

            // Indicate we loading form -> valueChange routine dont fire
            this.isLoadingForm = true;

            if (this.widgetToEdit.properties.widgetID == this.widgetIDtoEdit) {

                // Content panel
                this.identificationForm.controls['showWidgetText'].setValue(
                    this.widgetToEdit.areas.showWidgetText
                );
                this.showWidgetText = this.widgetToEdit.areas.showWidgetText;
                this.identificationForm.controls['showWidgetGraph'].setValue(
                    this.widgetToEdit.areas.showWidgetGraph
                );
                this.showWidgetGraph = this.widgetToEdit.areas.showWidgetGraph;
                this.identificationForm.controls['showWidgetTable'].setValue(
                    this.widgetToEdit.areas.showWidgetTable
                );
                this.showWidgetTable = this.widgetToEdit.areas.showWidgetTable;
                this.identificationForm.controls['showWidgetImage'].setValue(
                    this.widgetToEdit.areas.showWidgetImage
                );
                this.showWidgetImage = this.widgetToEdit.areas.showWidgetImage;

                this.selectedItem = {
                    id: this.widgetToEdit.properties.dashboardID,
                    name: this.widgetToEdit.properties.dashboardName
                };
                this.identificationForm.controls['dashboardName'].setValue(this.selectedItem);
                this.selectedDashboard = this.selectedItem;

                this.selectedItem = {
                    id: this.widgetToEdit.properties.dashboardTabID,
                    name: this.widgetToEdit.properties.dashboardTabName
                };
                this.identificationForm.controls['dashboardTabName'].setValue(this.selectedItem);
                this.selectedDashboardTab = this.selectedItem;

                this.identificationForm.controls['widgetTitle']
                    .setValue(this.widgetToEdit.container.widgetTitle);
                this.identificationForm.controls['widgetCode']
                    .setValue(this.widgetToEdit.properties.widgetCode);
                this.identificationForm.controls['widgetName']
                    .setValue(this.widgetToEdit.properties.widgetName);
                this.identificationForm.controls['widgetDescription']
                    .setValue(this.widgetToEdit.properties.widgetDescription);
                this.identificationForm.controls['widgetDefaultExportFileType']
                    .setValue(this.widgetToEdit.properties.widgetDefaultExportFileType);
                this.identificationForm.controls['widgetHyperLinkTabNr']
                    .setValue(this.widgetToEdit.properties.widgetHyperLinkTabNr);
                this.identificationForm.controls['widgetHyperLinkWidgetID']
                    .setValue(this.widgetToEdit.properties.widgetHyperLinkWidgetID);
                this.identificationForm.controls['widgetPassword']
                    .setValue(this.widgetToEdit.properties.widgetPassword);
                this.identificationForm.controls['widgetRefreshFrequency']
                    .setValue(this.widgetToEdit.properties.widgetRefreshFrequency);
                this.identificationForm.controls['widgetRefreshMode']
                    .setValue(this.widgetToEdit.properties.widgetRefreshMode);

                let LikedUsers: any = this.widgetToEdit.properties.widgetLiked.filter (
                    user => user.widgetLikedUserName != '')
                this.identificationForm.controls['NrwidgetLiked'].setValue(LikedUsers.length);

                this.selectedItem = {
                    id: this.widgetToEdit.properties.widgetReportID,
                    name: this.widgetToEdit.properties.widgetReportName
                };
                this.identificationForm.controls['widgetReportName'].setValue(this.selectedItem);
                this.selectedReport = this.selectedItem;

                // Set the field DropDown content
                this.onChangeLoadReportRelatedInfoBody(this.widgetToEdit.properties.widgetReportID);
                this.identificationForm.controls['widgetReportParameters']
                    .setValue(this.widgetToEdit.properties.widgetReportParameters);
                this.identificationForm.controls['widgetShowLimitedRows']
                    .setValue(this.widgetToEdit.properties.widgetShowLimitedRows);
                this.identificationForm.controls['widgetAddRestRow']
                    .setValue(this.widgetToEdit.properties.widgetAddRestRow);
                this.selectedWidgetType =
                    {
                        label: this.widgetToEdit.properties.widgetType,
                        value: {
                            id: this.widgetToEdit.properties.widgetTypeID,
                            name: this.widgetToEdit.properties.widgetType
                        }
                    };
                this.identificationForm.controls['widgetType'].setValue(this.selectedWidgetType);

                this.selectedWidgetCreation = this.selectedItem;

                // TODO - get IDs for X & Y columns correctly and from the actual data
                if (this.widgetToEdit.properties.widgetType == 'BarChart') {

                    this.identificationForm.controls['vegaGraphHeight']
                        .setValue(this.widgetToEdit.graph.vegaParameters.vegaGraphHeight);
                    this.identificationForm.controls['vegaGraphWidth']
                        .setValue(this.widgetToEdit.graph.vegaParameters.vegaGraphWidth);
                    this.identificationForm.controls['vegaGraphPadding']
                        .setValue(this.widgetToEdit.graph.vegaParameters.vegaGraphPadding);
                    this.selectedItem = {
                        id: this.widgetToEdit.graph.vegaParameters.vegaXcolumn,
                        name: this.widgetToEdit.graph.vegaParameters.vegaXcolumn
                    };
                    this.identificationForm.controls['vegaXcolumn'].setValue(this.selectedItem);
                    this.selectedVegaXcolumn = this.selectedItem;
                    this.selectedItem = {
                        id: this.widgetToEdit.graph.vegaParameters.vegaYcolumn,
                        name: this.widgetToEdit.graph.vegaParameters.vegaYcolumn
                    };
                    this.identificationForm.controls['vegaYcolumn'].setValue(this.selectedItem);
                    this.selectedVegaYcolumn = this.selectedItem;
                    this.selectedItemColor = {
                        id:this.widgetToEdit.graph.vegaParameters.vegaFillColor,
                        name: this.widgetToEdit.graph.vegaParameters.vegaFillColor,
                        code: this.canvasColors.hexCodeOfColor(
                            this.widgetToEdit.graph.vegaParameters.vegaFillColor
                        )
                    }
                    this.identificationForm.controls['vegaFillColor'].setValue(
                        this.selectedItemColor
                    );
                    this.selectedVegaFillColor = this.selectedItemColor;
                    this.selectedItemColor = {
                        id:this.widgetToEdit.graph.vegaParameters.vegaHoverColor,
                        name: this.widgetToEdit.graph.vegaParameters.vegaHoverColor,
                        code: this.canvasColors.hexCodeOfColor(
                            this.widgetToEdit.graph.vegaParameters.vegaHoverColor
                        )
                    }
                    this.identificationForm.controls['vegaHoverColor'].setValue(
                        this.selectedItemColor
                    );
                    this.selectedVegaHoverColor = this.selectedItemColor;
                    this.identificationForm.controls['vegaSpec'].setValue(
                        JSON.stringify(this.widgetToEdit.graph.spec)
                    );

                }

                // Load fields for Text box
                this.identificationForm.controls['textText']
                    .setValue(this.widgetToEdit.textual.textText);

                this.selectedItemColor = {
                    id:this.widgetToEdit.textual.textBackgroundColor,
                    name: this.widgetToEdit.textual.textBackgroundColor,
                    code: this.canvasColors.hexCodeOfColor(
                        this.widgetToEdit.textual.textBackgroundColor
                    )
                }
                this.identificationForm.controls['textBackgroundColor'].setValue(
                    this.selectedItemColor
                );
                this.selectedTextBackground = this.selectedItemColor;

                this.selectedItem = {
                    id: 1,
                    name: this.widgetToEdit.textual.textBorder
                };
                this.identificationForm.controls['textBorder'].setValue(this.selectedItem);
                this.selectedTextBorder = this.selectedItem;

                this.selectedItemColor = {
                    id:this.widgetToEdit.textual.textColor,
                    name: this.widgetToEdit.textual.textColor,
                    code: this.canvasColors.hexCodeOfColor(
                        this.widgetToEdit.textual.textColor
                    )
                }
                this.identificationForm.controls['textColor'].setValue(
                    this.selectedItemColor
                );
                this.selectedTextColor = this.selectedItemColor;

                this.selectedItem = {
                    id: 1,
                    name: this.widgetToEdit.textual.textFontSize.toString()
                };
                this.identificationForm.controls['textFontSize'].setValue(this.selectedItem);
                this.selectedTextFontSize = this.selectedItem;
                this.selectedItem = {
                    id: 1,
                    name: this.widgetToEdit.textual.textFontWeight
                };
                this.identificationForm.controls['textFontWeight'].setValue(this.selectedItem);
                this.selectedTextFontWeight = this.selectedItem;
                this.identificationForm.controls['textHeight']
                    .setValue(this.widgetToEdit.textual.textHeight);
                this.identificationForm.controls['textLeft']
                    .setValue(this.widgetToEdit.textual.textLeft);
                this.selectedItem = {
                    id: 1,
                    name: this.widgetToEdit.textual.textMargin
                };
                this.identificationForm.controls['textMargin'].setValue(this.selectedItem);
                this.selectedTextMargin = this.selectedItem;
                this.selectedItem = {
                    id: 1,
                    name: this.widgetToEdit.textual.textPadding
                };
                this.identificationForm.controls['textPadding'].setValue(this.selectedItem);
                this.selectedTextPadding = this.selectedItem;
                this.selectedItem = {
                    id: 1,
                    name: this.widgetToEdit.textual.textPosition
                };
                this.identificationForm.controls['textPosition'].setValue(this.selectedItem);
                this.selectedTextPosition = this.selectedItem;
                this.selectedItem = {
                    id: 1,
                    name: this.widgetToEdit.textual.textTextAlign
                };
                this.identificationForm.controls['textTextAlign'].setValue(this.selectedItem);
                this.selectedTextAlign = this.selectedItem;
                this.identificationForm.controls['textTop']
                    .setValue(this.widgetToEdit.textual.textTop);
                this.identificationForm.controls['textWidth']
                    .setValue(this.widgetToEdit.textual.textWidth);

                // Load fields for Table
                this.identificationForm.controls['tableHideHeader']
                    .setValue(this.widgetToEdit.table.tableHideHeader.toString());
                this.selectedItemColor = {
                    id:this.widgetToEdit.table.tableColor,
                    name: this.widgetToEdit.table.tableColor,
                    code: this.canvasColors.hexCodeOfColor(
                        this.widgetToEdit.table.tableColor
                    )
                }
                this.identificationForm.controls['tableColor'].setValue(this.selectedItemColor);
                this.selectedTableColor = this.selectedItemColor;
                this.identificationForm.controls['tableCols']
                    .setValue(this.widgetToEdit.table.tableCols);
                this.identificationForm.controls['tableRows']
                    .setValue(this.widgetToEdit.table.tableRows);
                this.identificationForm.controls['tableHeight']
                    .setValue(this.widgetToEdit.table.tableHeight);
                this.identificationForm.controls['tableWidth']
                    .setValue(this.widgetToEdit.table.tableWidth);
                this.identificationForm.controls['tableLeft']
                    .setValue(this.widgetToEdit.table.tableLeft);
                this.identificationForm.controls['tableTop']
                    .setValue(this.widgetToEdit.table.tableTop);

                // Load fields for Image
                this.identificationForm.controls['imageAlt']
                    .setValue(this.widgetToEdit.image.imageAlt);
                this.identificationForm.controls['imageHeigt']
                    .setValue(this.widgetToEdit.image.imageHeigt);
                this.identificationForm.controls['imageLeft']
                    .setValue(this.widgetToEdit.image.imageLeft);
                this.selectedItem = {
                    id: 1,
                    name: this.widgetToEdit.image.imageSource
                };
                this.identificationForm.controls['imageSource'].setValue(this.selectedItem);
                this.selectedImageSrc = this.selectedItem;
                this.identificationForm.controls['imageTop']
                    .setValue(this.widgetToEdit.image.imageTop);
                this.identificationForm.controls['imageWidth']
                    .setValue(this.widgetToEdit.image.imageWidth);

                // Indicate we are done loading form
                this.isLoadingForm = false;

            }
        }

        this.globalFunctionService.printToConsole(this.constructor.name, 'setStartupFormValues', '@End');
    }

    onClickCancel() {
        //   User clicked Cancel
        this.globalFunctionService.printToConsole(this.constructor.name, 'onClickCancel', '@Start');

        this.globalVariableService.growlGlobalMessage.next({
            severity: 'warn',
            summary:  'Cancel',
            detail:   'No changes as requested'
        });

        this.formSubmit.emit('Cancel');
    }

    onClickSubmit() {
        // User clicked submit button.
        // Note: it is assumed that
        // - all the fields are tested to be valid and proper in the validation.
        //   If not, return right after validation.
        // - all fields are loaded in widgetToEdit which is shared with the calling routine
        //   It is assumes is that widgetToEdit is 100% complete and accurate before return
        this.globalFunctionService.printToConsole(this.constructor.name, 'onClickSubmit', '@Start');

        // Validation: note that == null tests for undefined as well
        this.formIsValid = false;
        this.errorMessageOnForm = '';
        this.numberErrors = 0;

        // Validation
        if (this.identificationForm.controls['dashboardName'].value == ''  ||
            this.identificationForm.controls['dashboardName'].value == null) {
                this.formIsValid = false;
                this.numberErrors = this.numberErrors + 1;
                this.errorMessageOnForm = this.errorMessageOnForm + ' ' +
                    'The Dashboard Name (Identification Panel) is compulsory.';
        }
        if (this.identificationForm.controls['dashboardTabName'].value == ''  ||
            this.identificationForm.controls['dashboardTabName'].value == null) {
                this.formIsValid = false;
                this.numberErrors = this.numberErrors + 1;
                this.errorMessageOnForm = this.errorMessageOnForm + ' ' +
                    'The Dashboard Tab Name (Identification Panel) is compulsory.';
        }
        if (this.identificationForm.controls['widgetTitle'].value == ''  ||
            this.identificationForm.controls['widgetTitle'].value == null) {
                this.formIsValid = false;
                this.numberErrors = this.numberErrors + 1;
                this.errorMessageOnForm = this.errorMessageOnForm + ' ' +
                    'The Widget Title (Identification Panel) is compulsory.';
        }
        if (this.identificationForm.controls['widgetCode'].value == ''  ||
            this.identificationForm.controls['widgetCode'].value == null) {
                this.formIsValid = false;
                this.numberErrors = this.numberErrors + 1;
                this.errorMessageOnForm = this.errorMessageOnForm + ' ' +
                    'The Widget Code (Identification Panel) is compulsory.';
        }
        if (this.identificationForm.controls['widgetName'].value == ''  ||
            this.identificationForm.controls['widgetName'].value == null) {
                this.formIsValid = false;
                this.numberErrors = this.numberErrors + 1;
                this.errorMessageOnForm = this.errorMessageOnForm + ' ' +
                    'The Widget Name (Identification Panel) is compulsory.';
        }
        if (this.identificationForm.controls['widgetDescription'].value == ''  ||
            this.identificationForm.controls['widgetDescription'].value == null) {
                this.formIsValid = false;
                this.numberErrors = this.numberErrors + 1;
                this.errorMessageOnForm = this.errorMessageOnForm + ' ' +
                    'The Widget Description (Identification Panel) is compulsory.';
        }
        if (this.identificationForm.controls['widgetHyperLinkWidgetID'].touched  &&
            !this.identificationForm.controls['widgetHyperLinkWidgetID'].valid) {
                if (this.identificationForm.controls['widgetHyperLinkWidgetID'].value != '0') {
                    this.formIsValid = false;
                    this.numberErrors = this.numberErrors + 1;
                    this.errorMessageOnForm = this.errorMessageOnForm + ' ' +
                        'The Hyperlinked Widget ID (Behaviour Panel) must be numeric';
                }
        }
        if (this.identificationForm.controls['widgetRefreshFrequency'].touched  &&
            !this.identificationForm.controls['widgetRefreshFrequency'].valid) {
                this.formIsValid = false;
                this.numberErrors = this.numberErrors + 1;
                this.errorMessageOnForm = this.errorMessageOnForm + ' ' +
                    'The Refresh Frequency (Behaviour Panel) must be numeric and >0';
        }
        if (this.showWidgetGraph  ||  this.showWidgetTable) {
            if (this.identificationForm.controls['widgetReportName'].value == ''  ||
                this.identificationForm.controls['widgetReportName'].value == null) {
                    if (this.addEditMode == 'Add') {
                        this.formIsValid = false;
                        this.numberErrors = this.numberErrors + 1;
                        this.errorMessageOnForm = this.errorMessageOnForm + ' ' +
                            'The Widget Report Name (Data Panel) is compulsory when Adding.';
                    }
            }
        }

        // Validate the Text fields, IF active
        if (this.showWidgetText) {

            if (this.identificationForm.controls['textText'].value == ''  ||
                this.identificationForm.controls['textText'].value == null) {
                    this.formIsValid = false;
                    this.numberErrors = this.numberErrors + 1;
                    this.errorMessageOnForm = this.errorMessageOnForm + ' ' +
                        'The Text (Text panel) is compulsory.';
            }
            if (this.identificationForm.controls['textHeight'].value == ''  ||
                this.identificationForm.controls['textHeight'].value == null) {
                    if (this.identificationForm.controls['textHeight'].value != '0') {
                        this.formIsValid = false;
                        this.numberErrors = this.numberErrors + 1;
                        this.errorMessageOnForm = this.errorMessageOnForm + ' ' +
                            'The Height (Text panel) is compulsory.';
                    }
            }
            if (this.identificationForm.controls['textHeight'].touched  &&
                !this.identificationForm.controls['textHeight'].valid) {
                    this.formIsValid = false;
                    this.numberErrors = this.numberErrors + 1;
                    this.errorMessageOnForm = this.errorMessageOnForm + ' ' +
                        'The Height (Text panel) must be numeric and >0';
            }
            if (this.identificationForm.controls['textLeft'].value == ''  ||
                this.identificationForm.controls['textLeft'].value == null) {
                    if (this.identificationForm.controls['textLeft'].value != '0') {
                        this.formIsValid = false;
                        this.numberErrors = this.numberErrors + 1;
                        this.errorMessageOnForm = this.errorMessageOnForm + ' ' +
                            'The Left (Text panel) is compulsory.';
                    }
            }
            if (this.identificationForm.controls['textLeft'].touched  &&
                !this.identificationForm.controls['textLeft'].valid) {
                    this.formIsValid = false;
                    this.numberErrors = this.numberErrors + 1;
                    this.errorMessageOnForm = this.errorMessageOnForm + ' ' +
                        'The Left (Text panel) must be numeric';
            }
            if (this.identificationForm.controls['textTop'].value == ''  ||
                this.identificationForm.controls['textTop'].value == null) {
                    if (this.identificationForm.controls['textTop'].value != '0') {
                        this.formIsValid = false;
                        this.numberErrors = this.numberErrors + 1;
                        this.errorMessageOnForm = this.errorMessageOnForm + ' ' +
                            'The Top (Text panel) is compulsory.';
                    }
            }
            if (this.identificationForm.controls['textTop'].touched  &&
                !this.identificationForm.controls['textTop'].valid) {
                    this.formIsValid = false;
                    this.numberErrors = this.numberErrors + 1;
                    this.errorMessageOnForm = this.errorMessageOnForm + ' ' +
                        'The Top (Text panel) must be numeric';
            }
            if (this.identificationForm.controls['textWidth'].value == ''  ||
                this.identificationForm.controls['textWidth'].value == null) {
                    if (this.identificationForm.controls['textWidth'].value != '0') {
                        this.formIsValid = false;
                        this.numberErrors = this.numberErrors + 1;
                        this.errorMessageOnForm = this.errorMessageOnForm + ' ' +
                            'The Width (Text panel) is compulsory.';
                    }
            }
            if (this.identificationForm.controls['textWidth'].touched  &&
                !this.identificationForm.controls['textWidth'].valid) {
                    this.formIsValid = false;
                    this.numberErrors = this.numberErrors + 1;
                    this.errorMessageOnForm = this.errorMessageOnForm + ' ' +
                        'The Width (Text panel) must be numeric';
            }
        }

        // Validate Table fields, IF active
        if (this.showWidgetTable) {
            if (this.identificationForm.controls['tableHideHeader'].value == ''  ||
                this.identificationForm.controls['tableHideHeader'].value == null) {
                    this.formIsValid = false;
                    this.numberErrors = this.numberErrors + 1;
                    this.errorMessageOnForm = this.errorMessageOnForm + ' ' +
                        'The HideHeader (Table panel) is compulsory.';
            }
            if (this.identificationForm.controls['tableHideHeader'].value != 'true'  &&
                this.identificationForm.controls['tableHideHeader'].value != 'false') {
                    this.formIsValid = false;
                    this.numberErrors = this.numberErrors + 1;
                    this.errorMessageOnForm = this.errorMessageOnForm + ' ' +
                        'The HideHeader (Table panel) must be true or false (all lower case)';
                }
            if (this.identificationForm.controls['tableCols'].touched  &&
                !this.identificationForm.controls['tableCols'].valid) {
                    this.formIsValid = false;
                    this.numberErrors = this.numberErrors + 1;
                    this.errorMessageOnForm = this.errorMessageOnForm + ' ' +
                        'The Nr Cols (Table panel) must be numeric';
            }
            if (this.identificationForm.controls['tableRows'].touched  &&
                !this.identificationForm.controls['tableRows'].valid) {
                    this.formIsValid = false;
                    this.numberErrors = this.numberErrors + 1;
                    this.errorMessageOnForm = this.errorMessageOnForm + ' ' +
                        'The Nr Rows (Table panel) must be numeric';
            }
            if (this.identificationForm.controls['tableHeight'].touched  &&
                !this.identificationForm.controls['tableHeight'].valid) {
                    this.formIsValid = false;
                    this.numberErrors = this.numberErrors + 1;
                    this.errorMessageOnForm = this.errorMessageOnForm + ' ' +
                        'The Height (Table panel) must be numeric';
            }
            if (this.identificationForm.controls['tableWidth'].touched  &&
                !this.identificationForm.controls['tableWidth'].valid) {
                    this.formIsValid = false;
                    this.numberErrors = this.numberErrors + 1;
                    this.errorMessageOnForm = this.errorMessageOnForm + ' ' +
                        'The Width (Table panel) must be numeric';
            }
            if (this.identificationForm.controls['tableLeft'].touched  &&
                !this.identificationForm.controls['tableLeft'].valid) {
                    this.formIsValid = false;
                    this.numberErrors = this.numberErrors + 1;
                    this.errorMessageOnForm = this.errorMessageOnForm + ' ' +
                        'The Left (Table panel) must be numeric';
            }
            if (this.identificationForm.controls['tableTop'].touched  &&
                !this.identificationForm.controls['tableTop'].valid) {
                    this.formIsValid = false;
                    this.numberErrors = this.numberErrors + 1;
                    this.errorMessageOnForm = this.errorMessageOnForm + ' ' +
                        'The Top (Table panel) must be numeric';
            }
        }

        // validate Image fields, IF active
        if (this.showWidgetImage) {

            if (this.identificationForm.controls['imageHeigt'].value == ''  ||
                this.identificationForm.controls['imageHeigt'].value == null) {
                    this.formIsValid = false;
                    this.numberErrors = this.numberErrors + 1;
                    this.errorMessageOnForm = this.errorMessageOnForm + ' ' +
                        'The Height (Image panel) is compulsory.';
            }
            if (this.identificationForm.controls['imageHeigt'].touched  &&
                !this.identificationForm.controls['imageHeigt'].valid) {
                    this.formIsValid = false;
                    this.numberErrors = this.numberErrors + 1;
                    this.errorMessageOnForm = this.errorMessageOnForm + ' ' +
                        'The Height (Image panel) must be numeric';
            }
            if (this.identificationForm.controls['imageLeft'].value == ''  ||
                this.identificationForm.controls['imageLeft'].value == null) {
                    this.formIsValid = false;
                    this.numberErrors = this.numberErrors + 1;
                    this.errorMessageOnForm = this.errorMessageOnForm + ' ' +
                        'The Left (Image panel) is compulsory.';
            }
            if (this.identificationForm.controls['imageLeft'].touched  &&
                !this.identificationForm.controls['imageLeft'].valid) {
                    this.formIsValid = false;
                    this.numberErrors = this.numberErrors + 1;
                    this.errorMessageOnForm = this.errorMessageOnForm + ' ' +
                        'The Left (Image panel) must be numeric';
            }
            if (this.identificationForm.controls['imageSource'].value == ''  ||
                this.identificationForm.controls['imageSource'].value == null) {
                    this.formIsValid = false;
                    this.numberErrors = this.numberErrors + 1;
                    this.errorMessageOnForm = this.errorMessageOnForm + ' ' +
                        'The Source (Image panel) is compulsory.';
            }
            if (this.identificationForm.controls['imageTop'].value == ''  ||
                this.identificationForm.controls['imageTop'].value == null) {
                    this.formIsValid = false;
                    this.numberErrors = this.numberErrors + 1;
                    this.errorMessageOnForm = this.errorMessageOnForm + ' ' +
                        'The Top (Image panel) is compulsory.';
            }
            if (this.identificationForm.controls['imageTop'].touched  &&
                !this.identificationForm.controls['imageTop'].valid) {
                    this.formIsValid = false;
                    this.numberErrors = this.numberErrors + 1;
                    this.errorMessageOnForm = this.errorMessageOnForm + ' ' +
                        'The Top (Image panel) must be numeric';
            }
            if (this.identificationForm.controls['imageWidth'].value == ''  ||
                this.identificationForm.controls['imageWidth'].value == null) {
                    this.formIsValid = false;
                    this.numberErrors = this.numberErrors + 1;
                    this.errorMessageOnForm = this.errorMessageOnForm + ' ' +
                        'The Width (Image panel) is compulsory.';
            }
            if (this.identificationForm.controls['imageWidth'].touched  &&
                !this.identificationForm.controls['imageWidth'].valid) {
                    this.formIsValid = false;
                    this.numberErrors = this.numberErrors + 1;
                    this.errorMessageOnForm = this.errorMessageOnForm + ' ' +
                        'The Width (Image panel) must be numeric';
            }
        }

        // Tricksy bit: validate per Widget Type.  I know its a lot of work, but
        // its the only solution for now

        // Graph validation
        if (this.showWidgetGraph) {

            // Widget Set field validation
            if (this.identificationForm.controls['widgetType'].value == null) {
                this.formIsValid = false;
                this.numberErrors = this.numberErrors + 1;
                this.errorMessageOnForm = this.errorMessageOnForm + ' ' +
                    'The Widget Type (Graph panel) is compulsory.';
            } else {
                if (this.identificationForm.controls['widgetType'].value == '') {
                    this.formIsValid = false;
                    this.numberErrors = this.numberErrors + 1;
                    this.errorMessageOnForm = this.errorMessageOnForm + ' ' +
                        'The Widget Type (Graph Panel) is compulsory.';
                }

                if (this.identificationForm.controls['widgetType'].value.name == 'WidgetSet') {

                    if (this.identificationForm.controls['widgetReportWidgetSet'].value == ''  ||
                        this.identificationForm.controls['widgetReportWidgetSet'].value == null) {
                            this.formIsValid = false;
                            this.numberErrors = this.numberErrors + 1;
                            this.errorMessageOnForm = this.errorMessageOnForm + ' ' +
                                'The Report Widget Set (Graph panel) is compulsory.';
                    }
                }
            }

            // BarChart field validation
            if (this.identificationForm.controls['widgetType'].value == null) {
                    this.formIsValid = false;
                    this.numberErrors = this.numberErrors + 1;
                    this.errorMessageOnForm = this.errorMessageOnForm + ' ' +
                        'The Report Widget Type (Graph panel) is compulsory.';
            } else {

                if (this.identificationForm.controls['widgetType'].value.name == 'BarChart') {
                    if (this.identificationForm.controls['widgetShowLimitedRows'].touched  &&
                        !this.identificationForm.controls['widgetShowLimitedRows'].valid) {
                            this.formIsValid = false;
                            this.numberErrors = this.numberErrors + 1;
                            this.errorMessageOnForm = this.errorMessageOnForm + ' ' +
                                'The number of limited rows (Data panel) to show must be numeric';
                    }
                    if (this.identificationForm.controls['vegaGraphHeight'].value == ''  ||
                        !this.identificationForm.controls['vegaGraphHeight'].value == null) {
                            this.formIsValid = false;
                            this.numberErrors = this.numberErrors + 1;
                            this.errorMessageOnForm = this.errorMessageOnForm + ' ' +
                                'The Height (Graph panel) must be numeric';
                    }
                    if (this.identificationForm.controls['vegaGraphWidth'].value == ''  ||
                        !this.identificationForm.controls['vegaGraphWidth'].value == null) {
                            this.formIsValid = false;
                            this.numberErrors = this.numberErrors + 1;
                            this.errorMessageOnForm = this.errorMessageOnForm + ' ' +
                                'The Width (Graph panel) must be numeric';
                    }
                    if (this.identificationForm.controls['vegaGraphPadding'].value == ''  ||
                        !this.identificationForm.controls['vegaGraphPadding'].value == null) {
                            this.formIsValid = false;
                            this.numberErrors = this.numberErrors + 1;
                            this.errorMessageOnForm = this.errorMessageOnForm + ' ' +
                                'The Padding (Graph panel) must be numeric';
                    }

                    if (this.identificationForm.controls['vegaXcolumn'].value == ''  ||
                        this.identificationForm.controls['vegaXcolumn'].value == null) {
                            this.formIsValid = false;
                            this.numberErrors = this.numberErrors + 1;
                            this.errorMessageOnForm = this.errorMessageOnForm + ' ' +
                                'The X axis field (Graph panel) is compulsory.';
                    }
                    if (this.identificationForm.controls['vegaYcolumn'].value == ''  ||
                        this.identificationForm.controls['vegaYcolumn'].value == null) {
                            this.formIsValid = false;
                            this.numberErrors = this.numberErrors + 1;
                            this.errorMessageOnForm = this.errorMessageOnForm + ' ' +
                                'The Y axis field (Graph panel) is compulsory.';
                    }

                }
            }
        }

        // Oi, something is not right
        if (this.errorMessageOnForm != '') {
            this.formIsValid = true;
            this.globalVariableService.growlGlobalMessage.next({
                severity: 'error',
                summary: 'Error',
                detail: this.numberErrors.toString() + ' error(s) encountered'
            });
            return;
        }

        // Adding new Widget
        if (this.addEditMode == 'Add' && this.displayEditWidget) {
            this.widgetToEdit.properties.dashboardID = this.originalDashboardID;
            this.widgetToEdit.properties.widgetID = 0; // Set in DB

            // Load container fields from previously used values
            this.widgetToEdit.container.backgroundColor =
                this.globalVariableService.lastBackgroundColor.getValue().name;
            this.widgetToEdit.container.border =
                this.globalVariableService.lastBorder.getValue().name;
            this.widgetToEdit.container.boxShadow =
                this.globalVariableService.lastBoxShadow.getValue().name;
            this.widgetToEdit.container.color =
                this.globalVariableService.lastColor.getValue().name;
            this.widgetToEdit.container.fontSize =
                +this.globalVariableService.lastContainerFontSize.getValue().name;
            this.widgetToEdit.container.height =
                this.globalVariableService.lastWidgetHeight.getValue();
            this.widgetToEdit.container.width =
                this.globalVariableService.lastWidgetWidth.getValue();

            // Defaults
            this.widgetToEdit.properties.widgetIsLocked = false;
            this.widgetToEdit.properties.widgetIsLiked = false;
            this.widgetToEdit.properties.widgetLiked = [{widgetLikedUserName: ''}];
            this.widgetToEdit.properties.widgetIndex = 0;
            this.widgetToEdit.properties.widgetSize = '';
            this.widgetToEdit.properties.widgetSystemMessage = '';

            // Add x,y from where Icon was dropped
            this.widgetToEdit.container.left = this.globalFunctionService.alignToGripPoint(
                this.widgetToEditX);
            this.widgetToEdit.container.top = this.globalFunctionService.alignToGripPoint(
                this.widgetToEditY);

            // Add creation info
            this.widgetToEdit.properties.widgetCreatedDateTime =
                this.canvasDate.now('standard');
            this.widgetToEdit.properties.widgetCreatedUserName =
                this.canvasUser.username;

        }

        // Editing existing Widget
        if (this.addEditMode == 'Edit' && this.displayEditWidget  &&
            this.widgetToEdit.properties.widgetID == this.widgetIDtoEdit  &&
            !this.isLoadingForm) {

            // Space to worry about EDIT only mode - for future use
        }

        // Load fields from form - assume ALL good as Validation will stop bad stuff
        this.widgetToEdit.areas.showWidgetGraph = this.showWidgetGraph;
        this.widgetToEdit.areas.showWidgetImage = this.showWidgetImage;
        this.widgetToEdit.areas.showWidgetTable = this.showWidgetTable;
        this.widgetToEdit.areas.showWidgetText = this.showWidgetText;

        this.widgetToEdit.properties.dashboardID =
            this.selectedDashboard.id;
        this.widgetToEdit.properties.dashboardName =
            this.selectedDashboard.name;
        this.widgetToEdit.properties.dashboardTabID =
            this.selectedDashboardTab.id;
        this.widgetToEdit.properties.dashboardTabName =
            this.selectedDashboardTab.name;
        this.widgetToEdit.container.widgetTitle =
            this.identificationForm.controls['widgetTitle'].value;
        this.widgetToEdit.properties.widgetCode =
            this.identificationForm.controls['widgetCode'].value;
        this.widgetToEdit.properties.widgetName =
            this.identificationForm.controls['widgetName'].value;
        this.widgetToEdit.properties.widgetAddRestRow =
            this.identificationForm.controls['widgetAddRestRow'].value;
        this.widgetToEdit.properties.widgetDefaultExportFileType =
            this.identificationForm.controls['widgetDefaultExportFileType'].value;
        this.widgetToEdit.properties.widgetDescription =
            this.identificationForm.controls['widgetDescription'].value;
        this.widgetToEdit.properties.widgetHyperLinkTabNr =
            this.identificationForm.controls['widgetHyperLinkTabNr'].value;
        this.widgetToEdit.properties.widgetHyperLinkWidgetID =
            this.identificationForm.controls['widgetHyperLinkWidgetID'].value;
        this.widgetToEdit.properties.widgetPassword =
            this.identificationForm.controls['widgetPassword'].value;
        this.widgetToEdit.properties.widgetRefreshFrequency =
            this.identificationForm.controls['widgetRefreshFrequency'].value;
        this.widgetToEdit.properties.widgetRefreshMode =
            this.identificationForm.controls['widgetRefreshMode'].value;
        this.widgetToEdit.properties.widgetReportName =
            this.identificationForm.controls['widgetReportName'].value;
        this.widgetToEdit.properties.widgetReportParameters =
            this.identificationForm.controls['widgetReportParameters'].value;
        this.widgetToEdit.properties.widgetShowLimitedRows =
            this.identificationForm.controls['widgetShowLimitedRows'].value;
        this.widgetToEdit.properties.widgetTypeID =
            this.identificationForm.controls['widgetType'].value.id;
        this.widgetToEdit.properties.widgetType =
            this.identificationForm.controls['widgetType'].value.name;

        // Amend the specs IF given, according to the Widget Sets
        if (this.identificationForm.controls['widgetType'].value != null) {
            if (this.identificationForm.controls['widgetType'].value.name == 'WidgetSet') {
                for (var i = 0; i < this.reportWidgetSets.length; i++) {
                    if (this.reportWidgetSets[i].widgetSetID ==
                        this.identificationForm.controls['widgetReportWidgetSet'].value.id) {
                            this.widgetToEdit.graph.spec = this.reportWidgetSets[i].vegaSpec;
                    }
                }

                // Then wack in the data from the Report
                if (this.identificationForm.controls['widgetReportName'].value != '' &&
                    this.identificationForm.controls['widgetReportName'].value != undefined) {
                    for (var i = 0; i < this.reports.length; i++) {
                        if (this.reports[i].reportID ==
                            this.identificationForm.controls['widgetReportName'].value.id) {
                                this.widgetToEdit.graph.spec.data[0].values =
                                    this.reports[i].reportData;
                        }
                    }
                }
            }
        }

        if (this.identificationForm.controls['widgetType'].value != null) {
            if (this.identificationForm.controls['widgetType'].value.name == 'BarChart') {

                // Get the corresponding widget template
                this.loadWidgetTemplateFields();

                // Wack the whole Template spec into our working Widget
                this.widgetToEdit.graph.spec = this.widgetTemplate.vegaSpec;

                // Now tweak according to the form
                this.widgetToEdit.graph.spec.height =
                    this.identificationForm.controls['vegaGraphHeight'].value;
                this.widgetToEdit.graph.spec.width =
                    this.identificationForm.controls['vegaGraphWidth'].value;

                this.widgetToEdit.graph.spec.padding =
                    this.identificationForm.controls['vegaGraphPadding'].value;
                if (this.identificationForm.controls['vegaXcolumn'].value.name != '' &&
                    this.identificationForm.controls['vegaXcolumn'].value.name != undefined) {
                        this.widgetToEdit.graph.spec.scales[0].domain.field =
                            this.identificationForm.controls['vegaXcolumn'].value.name;

                        this.widgetToEdit.graph.spec.marks[0].encode.enter.x.field =
                            this.identificationForm.controls['vegaXcolumn'].value.name;

                        this.widgetToEdit.graph.spec.marks[1].encode.update.x.signal =
                            'tooltip.' + this.identificationForm.controls['vegaXcolumn'].value.name;
                }

                if (this.identificationForm.controls['vegaYcolumn'].value.name != '' &&
                    this.identificationForm.controls['vegaYcolumn'].value.name != undefined) {
                        this.widgetToEdit.graph.spec.scales[1].domain.field =
                            this.identificationForm.controls['vegaYcolumn'].value.name;
                        this.widgetToEdit.graph.spec.marks[0].encode.enter.y.field =
                            this.identificationForm.controls['vegaYcolumn'].value.name;
                        this.widgetToEdit.graph.spec.marks[1].encode.update.y.signal =
                            'tooltip.' + this.identificationForm.controls['vegaYcolumn'].value.name;
                }

                if (this.identificationForm.controls['vegaFillColor'].value != undefined) {
                        this.widgetToEdit.graph.spec.marks[0].encode.update.fill.value =
                            this.identificationForm.controls['vegaFillColor'].value.name;
                }
                if (this.identificationForm.controls['vegaHoverColor'].value != undefined) {
                        this.widgetToEdit.graph.spec.marks[0].encode.hover.fill.value =
                            this.identificationForm.controls['vegaHoverColor'].value.name;
                }

                // Then wack in the data from the Report
                if (this.identificationForm.controls['widgetReportName'].value != '' &&
                    this.identificationForm.controls['widgetReportName'].value != undefined) {
                        for (var i = 0; i < this.reports.length; i++) {
                            if (this.reports[i].reportID ==
                                this.identificationForm.controls['widgetReportName'].value.id) {
                                    this.widgetToEdit.graph.spec.data[0].values =
                                        this.reports[i].reportData;
                            }
                        }
                }

                // Estimate height and width for NEW container, based on graph dimensions
                if (this.addEditMode == 'Add') {
                    this.widgetToEdit.container.height = this.globalFunctionService.alignToGripPoint(
                        +this.widgetToEdit.graph.spec.height +
                            (+this.widgetToEdit.graph.spec.padding * 2) + 40);
                    this.widgetToEdit.container.width = this.globalFunctionService.alignToGripPoint(
                        +this.widgetToEdit.graph.spec.width +
                            (+this.widgetToEdit.graph.spec.padding * 2) + 40);
                }

            }
        }
        if (this.identificationForm.controls['widgetType'].value != null) {
            if (this.identificationForm.controls['widgetType'].value.name == 'Custom') {
                this.widgetToEdit.graph.spec = JSON.parse(this.identificationForm.controls['vegaSpec'].value);

                // Then wack in the data from the Report
                if (this.identificationForm.controls['widgetReportName'].value != '' &&
                    this.identificationForm.controls['widgetReportName'].value != undefined) {
                        for (var i = 0; i < this.reports.length; i++) {
                            if (this.reports[i].reportID ==
                                this.identificationForm.controls['widgetReportName'].value.id) {

                                    this.widgetToEdit.graph.spec.data[0].values =
                                        this.reports[i].reportData;
                            }
                        }
                }
            }
        }

        // Load Text fields
        if (this.showWidgetText) {
            this.widgetToEdit.textual.textText =
                this.identificationForm.controls['textText'].value;
            this.widgetToEdit.textual.textBackgroundColor =
                this.selectedTextBackground.name;
            this.widgetToEdit.textual.textBorder =
                this.selectedTextBorder.name;
            this.widgetToEdit.textual.textColor =
                this.selectedTextColor.name;
            this.widgetToEdit.textual.textFontSize =
                +this.selectedTextFontSize.name;
            this.widgetToEdit.textual.textFontWeight =
                this.selectedTextFontWeight.name;
            this.widgetToEdit.textual.textHeight =
                this.identificationForm.controls['textHeight'].value;
            this.widgetToEdit.textual.textLeft =
                this.identificationForm.controls['textLeft'].value;
            this.widgetToEdit.textual.textMargin =
                this.selectedTextMargin.name;
            this.widgetToEdit.textual.textPadding =
                this.selectedTextPadding.name;
            this.widgetToEdit.textual.textPosition =
                this.selectedTextPosition.name;
            this.widgetToEdit.textual.textTextAlign =
                this.selectedTextAlign.name;
            this.widgetToEdit.textual.textTop =
                this.identificationForm.controls['textTop'].value;
            this.widgetToEdit.textual.textWidth =
                this.identificationForm.controls['textWidth'].value;
        }

        // Load Table fields
        if (this.showWidgetTable) {
            if (this.identificationForm.controls['tableHideHeader'].value == 'true') {
                this.widgetToEdit.table.tableHideHeader = true;
            } else {
                this.widgetToEdit.table.tableHideHeader = false;
            }
                this.identificationForm.controls['tableHideHeader'].value;
            this.widgetToEdit.table.tableColor =
                this.selectedTableColor.name;
            this.widgetToEdit.table.tableCols =
                this.identificationForm.controls['tableCols'].value;
            this.widgetToEdit.table.tableRows =
                this.identificationForm.controls['tableRows'].value;
            this.widgetToEdit.table.tableHeight =
                this.identificationForm.controls['tableHeight'].value;
            this.widgetToEdit.table.tableWidth =
                this.identificationForm.controls['tableWidth'].value;
            this.widgetToEdit.table.tableLeft =
                this.identificationForm.controls['tableLeft'].value;
            this.widgetToEdit.table.tableTop =
                this.identificationForm.controls['tableTop'].value;
        }

        // Load Image fields
        if (this.showWidgetImage) {
            this.widgetToEdit.image.imageAlt =
                this.identificationForm.controls['imageAlt'].value;
            this.widgetToEdit.image.imageHeigt =
                this.identificationForm.controls['imageHeigt'].value;
            this.widgetToEdit.image.imageLeft =
                this.identificationForm.controls['imageLeft'].value;
            this.widgetToEdit.image.imageSource =
                this.selectedImageSrc.name;
            this.widgetToEdit.image.imageTop =
                this.identificationForm.controls['imageTop'].value;
            this.widgetToEdit.image.imageWidth =
                this.identificationForm.controls['imageWidth'].value;
        }

        // Set last updated, created and refreshed properties
        this.widgetToEdit.properties.widgetRefreshedDateTime =
            this.canvasDate.now('standard');
        this.widgetToEdit.properties.widgetRefreshedUserName =
            this.canvasUser.username;
        this.widgetToEdit.properties.widgetUpdatedDateTime =
            this.canvasDate.now('standard');
        this.widgetToEdit.properties.widgetUpdatedUserName =
            this.canvasUser.username;
console.log('@end', this.widgetToEdit)

        // Trigger event emitter 'emit' method
        this.formSubmit.emit('Submit');

        //  Note: Do NOT set 'this.displayEditWidget = false' here - it has to change in the parent
        //        componenent to take effect (and thus close Dialogue)
    }

    onChangeLoadReportRelatedInfo(event) {
        // Load the WidgetSets for the selected Report
        this.globalFunctionService.printToConsole(this.constructor.name, 'onChangeLoadReportRelatedInfo', '@Start');

        // Call the doer routine
        this.onChangeLoadReportRelatedInfoBody(+event.value.id);
    }

    onChangeLoadReportRelatedInfoBody(selectedReportID) {
        // Load the WidgetSets for the selected Report
        this.globalFunctionService.printToConsole(this.constructor.name, 'onChangeLoadReportRelatedInfoBody', '@Start for ID: ' + selectedReportID);

        // Get ReportFields
        this.reportFieldsDropDown = [];
        this.selectedReportID = selectedReportID;
        this.reportFields = this.eazlService.getReportFields(this.selectedReportID);

        // Fill the dropdown on the form
        for (var i = 0; i < this.reportFields.length; i++) {
            this.reportFieldsDropDown.push({
                label: this.reportFields[i],
                value: {
                    id: this.reportFields[i],
                    name: this.reportFields[i]
                }
            });
        }

        // Get its WidgetSets in this Dashboard
        this.reportWidgetSetsDropDown = [];
        this.selectedReportID = selectedReportID;
        this.reportWidgetSets = this.eazlService.getReportWidgetSets(this.selectedReportID);

        // Fill the dropdown on the form
        for (var i = 0; i < this.reportWidgetSets.length; i++) {
            this.reportWidgetSetsDropDown.push({
                label: this.reportWidgetSets[i].widgetSetName,
                value: {
                    id: this.reportWidgetSets[i].widgetSetID,
                    name: this.reportWidgetSets[i].widgetSetName
                }
            });
        }

    }

    loadReports() {

        // Load the Report, etc DropDowns
        this.reports = this.eazlService.getReports();

        // Fill its dropdown
        this.reportsDropDown = [];
        for (var i = 0; i < this.reports.length; i++) {
            this.reportsDropDown.push({
                label: this.reports[i].reportName,
                value: {
                    id: this.reports[i].reportID,
                    name: this.reports[i].reportName
                }
            });
        }

        // Fill the options on how to create Widgets
        this.widgetCreationDropDown = [];
        this.widgetCreationDropDown = this.eazlService.getWidgetTypes();
    }

    changeWidgetSet(event) {
        // Sets the description as the user selects a new WidgetSet in the DropDown
        this.globalFunctionService.printToConsole(this.constructor.name, 'changeWidgetSet', '@Start');

        if (this.reportWidgetSets.length > 0) {
            this.selectedWidgetSetDescription = this.reportWidgetSets.filter(
                w => w.widgetSetID == event.value.id)[0].widgetSetDescription;
        } else {
            this.selectedWidgetSetDescription = '';
        }
    }

    loadWidgetTemplateFields() {
        // Load basic fields when a Widget template is selected
        this.globalFunctionService.printToConsole(this.constructor.name, 'loadWidgetTemplateFields', '@Start');

        // Only get this for non-WidgetSets, ie WidgetTemplates
        this.widgetTemplate = null;

        // This is null for New Widgets
        if (this.identificationForm.controls['widgetType'].value != null) {
            if (this.identificationForm.controls['widgetType'].value.name != 'WidgetSet') {
                // Get the corresponding widget template
                this.widgetTemplate = this.eazlService.getWidgetTemplates (
                    this.identificationForm.controls['widgetType'].value.name
                );
            }

            // Only Custom specs can be editted
            if (this.identificationForm.controls['widgetType'].value.name == 'Custom') {
                this.isNotCustomSpec = false;
            } else {
                this.isNotCustomSpec = true;
            }
        }
    }

    loadDashboardTabs() {
        // Load the Tabs for the selected Dashboard
        this.globalFunctionService.printToConsole(this.constructor.name, 'loadDashboardTabs', '@Start');

        // Get its Tabs in this Dashboard
        this.dashboardTabsDropDown = this.eazlService.getDashboardTabsSelectItems(
            this.originalDashboardID
        );
    }

    testVegaSpec() {
        // Test the Vega spec, and returns Good / Bad
        this.globalFunctionService.printToConsole(this.constructor.name, 'testVegaSpec', '@Start');

        // Assume all good
        this.isVegaSpecBad = false;
        this.renderer.setElementStyle(
            this.widgetGraph.nativeElement,'background-color', 'transparent'
        );
        this.renderer.setElementStyle(
            this.widgetGraph.nativeElement,'border', '1px solid darkred'
        );
        var view = new vg.View(vg.parse(this.identificationForm.controls['vegaSpec'].value));
        view.renderer('svg')
            .initialize( this.widgetGraph.nativeElement)
            .hover()
            .run();

console.log('spec', this.identificationForm.controls['vegaSpec'].value)
//         try {
//             var view = new vg.View(vg.parse(this.identificationForm.controls['vegaSpec'].value));
//             view.renderer('svg')
//                 .initialize( this.widgetGraph.nativeElement)
//                 .hover()
//                 .run();
//         }
//         catch(err) {
// console.log('in err')
//             this.isVegaSpecBad = true;
//             this.identificationForm.controls['vegaSpec'].value = '';
//         }
//         finally {
// console.log('finally bad good',this.isVegaSpecBad )
//         }
    }
}