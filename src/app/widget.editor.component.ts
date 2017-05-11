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
import { EazlService }                from './eazl.service';
import { GlobalFunctionService }      from './global.function.service';
import { GlobalVariableService }      from './global.variable.service';

// Our models
import { DashboardTab }               from './model.dashboardTabs';
import { Report }                     from './model.report';
import { ReportWidgetSet }            from './model.report.widgetSets';
import { Widget }                     from './model.widget';
import { WidgetComment }              from './model.widget.comment';
import { WidgetTemplate }             from './model.widgetTemplates';

// Our Data
import { CanvasColors }               from './data.chartcolors';

// Vega stuffies
let vg = require('vega/index.js');

export class SelectedItem {
    id: any;
    name: string;
}

export class SelectedItemColor {
    id: any;
    name: string;
    code: string;
}

@Component({
    selector:    'widget-editor',
    templateUrl: 'widget.editor.component.html',
    styleUrls:  ['widget.editor.component.css']
})
export class WidgetEditorComponent implements OnInit {

    @Input() originalDashboardID: number;
    @Input() originalDashboardTabName: string;
    @Input() widgetToEdit: Widget;
    @Input() addEditMode: string;
    @Input() displayEditWidget: boolean;
    @Input() widgetIDtoEdit: number;
    @Input() widgetToEditX: number;
    @Input() widgetToEditY: number;

    // Event emitter sends event back to parent component once Submit button was clicked
    @Output() formSubmit: EventEmitter<string> = new EventEmitter();

    @ViewChild('widget') widgetGraph: ElementRef;             // Attaches to # in DOM

    submitted: boolean;                         // True if form submitted
    selectedTabName: any;                       // Current selected Tab
    selectedReportID: number;                   // Selected in DropDown
    selectedReportFieldX: string;               // Selected in DropDown
    selectedReportFieldY: string;               // Selected in DropDown
    selectedDashboardTab: any;                  // Selected in DropDown
    selectedReport: any;                        // Selected in Report DropDown
    selectedVegaXcolumn: any;                   // Selected in DropDown
    selectedVegaYcolumn: any;                   // Selected in DropDown
    selectedVegaFillColor: any;                 // Selected in DropDown
    selectedVegaHoverColor: any;                // Selected in DropDown
    selectedWidgetSetDescription: string;       // Description of the selected WidgetSet

    showWidgetText: boolean = false;            // True to show Text in containter
    showWidgetGraph: boolean = false;           // True to show Graph in Containter
    showWidgetTable: boolean = false;           // True to show Table in Containter
    showWidgetImage: boolean = false;           // True to show Image in Containter
    widgetToEditSpec: string;                   // Vega spect for current Widget

    reports: Report[];                          // List of Reports
    reportsDropDown:  SelectItem[];             // Drop Down options
    widgetTemplate: WidgetTemplate;             // List of Widget Templates
    reportWidgetSets: ReportWidgetSet[];        // List of Report WidgetSets
    reportFields: string[];                     // List of Report Fields
    reportWidgetSetsDropDown:  SelectItem[];    // Drop Down options
    reportFieldsDropDown:  SelectItem[];        // Drop Down options
    selectedItem: SelectedItem;                 // Selected Object: note ANY to cater for ID number, string
    selectedItemColor: SelectedItemColor;       // Selected Object: note ANY to cater for ID number, string

    dashboardTabs: DashboardTab[];              // List of Dashboard Tabs
    dashboardTabsDropDown: SelectItem[];        // Drop Down options
    widgetCreationDropDown: SelectItem[];       // Drop Down options
    selectedWidgetCreation: any;                // Selected option to create Widget
    selectedTextBackground: any;                // Selected option for Text Background
    selectedTextBorder: any;                    // Selected option for Text Border
    selectedTextColor: any;                     // Selected option for Text Color
    selectedTextFontSize: any;                  // Selected option for Text Font Size
    selectedTextFontWeight: any;                // Selected option for Text Font Weight
    selectedTextMargin: any;                    // Selected option for Text Margin
    selectedTextPadding: any;                   // Selected option for Text Box Padding
    selectedTextPosition: any;                  // Selected option for Text Box Position
    selectedTextAlign: any;                     // Selected option for Text Alignment in box
    
    selectedImageSrc: any;                      // Selected option for Image Src file
    isVegaSpecBad: boolean = true;              // True if Vega spec is bad
    isNotCustomSpec: boolean = true;            // True if NOT a Custom widget
    gridSize: number;                           // Size of grid blocks, ie 3px x 3px
    snapToGrid: boolean = true;                 // If true, snap widgets to gridSize

    // Form Controls, validation and loading stuffies
    identificationForm: FormGroup;
    isLoadingForm: boolean = false;
    errorMessageOnForm: string = '';
    formIsValid: boolean = false;
    numberErrors: number = 0;
 
    // Variables for Startup properties of a Widget
    borderOptions: SelectItem[];                // Options for Border DropDown
    boxShadowOptions: SelectItem[];             // Options for Box-Shadow DropDown
    chartColor: SelectItem[];                   // Options for Backgroun-dColor DropDown
    fontSizeOptions: SelectItem[];              // Options for Font Size of text box
    fontWeightOptions: SelectItem[];            // Options for Font Weight of text box
    textMarginOptions: SelectItem[];            // Options for Margins around text box
    textPaddingOptions: SelectItem[];           // Options for Padding around text box
    textPositionOptions: SelectItem[];          // Options for Position of the text box (absolute or not)
    textAlignOptions: SelectItem[];             // Options for horisontal align of the text (left, center, right)
    imageSourceOptions: SelectItem[];           // Options for image src (path + file in png, jpg or gif)

    // ToolTippies stays after popup form closes, so setting in vars works for now ...
    // TODO - find BUG, our side or PrimeNG side
    dashboardsTabsTooltip: string = ""          // 'Selected Tab where Widget will live';
    reportsDropDownTooltip: string = "";        // 'Selected Report (query) with data';
    reportWidgetSetDropToolTip: string = ""     // 'Widget Set for the selected Report';
            
    constructor(
        private canvasColors: CanvasColors,
        private eazlService: EazlService,
        private fb: FormBuilder,
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private renderer : Renderer,
    ) { 
    }
    
// For later: this.selectedBackgroundColorDashboard = {id: 1, name: "Navy", code: "#000080"}
    ngOnInit() {
        this.globalFunctionService.printToConsole(this.constructor.name, 'ngOnInit', '@Start');

        // Define form group for first tab
        this.identificationForm = this.fb.group(
            {
                'widgetTabName':                new FormControl(''),
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
                'vegaGraphHeight':                  new FormControl('', Validators.pattern('^[0-9]*$')),
                'vegaGraphWidth':                   new FormControl('', Validators.pattern('^[0-9]*$')),
                'vegaGraphPadding':                 new FormControl('', Validators.pattern('^[0-9]*$')),
                'vegaHasSignals':               new FormControl(''),
                'vegaXcolumn':                  new FormControl(''),
                'vegaYcolumn':                  new FormControl(''),
                'vegaFillColor':                new FormControl(''),
                'vegaHoverColor':               new FormControl('')
            }
        );

        // Background Colors Options
        this.chartColor = [];
        this.chartColor = this.canvasColors.getColors();

        // Border Options
        this.borderOptions = [];
        this.borderOptions.push({label:'None',          value:{id:1, name: 'transparent'}});
        this.borderOptions.push({label:'Thick Black',   value:{id:1, name: '3px solid black'}});
        this.borderOptions.push({label:'Thin Black',    value:{id:1, name: '1px solid black'}});
        this.borderOptions.push({label:'Thin White',    value:{id:1, name: '1px solid white'}});

        // BoxShadow Options
        this.boxShadowOptions = [];
        this.boxShadowOptions.push({label:'None',       value:{id:1, name: '',                      code: ''}});
        this.boxShadowOptions.push({label:'Black',      value:{id:1, name: '2px 2px 12px black',    code: '2px 2px 12px black'}});
        this.boxShadowOptions.push({label:'Gray',       value:{id:1, name: '2px 2px 12px gray',     code: '2px 2px 12px gray'}});
        this.boxShadowOptions.push({label:'White',      value:{id:1, name: '2px 2px 12px white',    code: '2px 2px 12px white'}});

        // Font Size Options
        this.fontSizeOptions = [];
        this.fontSizeOptions.push({label:'16',   value:{id:1, name: '16'}});
        this.fontSizeOptions.push({label:'32',   value:{id:1, name: '32'}});
        this.fontSizeOptions.push({label:'48',   value:{id:1, name: '48'}});
        this.fontSizeOptions.push({label:'60',   value:{id:1, name: '60'}});
        this.fontSizeOptions.push({label:'72',   value:{id:1, name: '72'}});
        this.fontSizeOptions.push({label:'84',   value:{id:1, name: '84'}});

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
        if (this.widgetToEdit != undefined) {
            this.widgetToEditSpec = JSON.stringify(this.widgetToEdit.graph.spec);
        }

        this.globalFunctionService.printToConsole(this.constructor.name, 'ngOnChanges',
            'Mode (Add / Edit) is: ' + this.addEditMode);
        this.globalFunctionService.printToConsole(this.constructor.name, 'ngOnChanges',
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
                if (this.widgetToEdit.areas.showWidgetText) {
                    this.identificationForm.controls['showWidgetText'].setValue(
                        this.widgetToEdit.areas.showWidgetText
                    );
                    this.showWidgetText = this.widgetToEdit.areas.showWidgetText;
                }
                if (this.widgetToEdit.areas.showWidgetGraph) {
                    this.identificationForm.controls['showWidgetGraph'].setValue(
                        this.widgetToEdit.areas.showWidgetGraph
                    );
                    this.showWidgetGraph = this.widgetToEdit.areas.showWidgetGraph;
                }
                if (this.widgetToEdit.areas.showWidgetTable) {
                    this.identificationForm.controls['showWidgetTable'].setValue(
                        this.widgetToEdit.areas.showWidgetTable
                    );
                    this.showWidgetTable = this.widgetToEdit.areas.showWidgetTable;
                }
                if (this.widgetToEdit.areas.showWidgetImage) {
                    this.identificationForm.controls['showWidgetImage'].setValue(
                        this.widgetToEdit.areas.showWidgetImage
                    );
                    this.showWidgetImage = this.widgetToEdit.areas.showWidgetImage;
                }

                if (this.widgetToEdit.properties.widgetTabName) {
                    this.selectedItem = {
                        id: this.widgetToEdit.properties.widgetTabID, 
                        name: this.widgetToEdit.properties.widgetTabName
                    };
                    this.identificationForm.controls['widgetTabName'].setValue(this.selectedItem);
                    this.selectedDashboardTab = this.selectedItem;
                }
                if (this.widgetToEdit.container.widgetTitle) {
                    this.identificationForm.controls['widgetTitle']
                        .setValue(this.widgetToEdit.container.widgetTitle);
                }
                if (this.widgetToEdit.properties.widgetCode) {
                    this.identificationForm.controls['widgetCode']
                        .setValue(this.widgetToEdit.properties.widgetCode);
                }
                if (this.widgetToEdit.properties.widgetName) {
                    this.identificationForm.controls['widgetName']
                        .setValue(this.widgetToEdit.properties.widgetName);
                }
                if (this.widgetToEdit.properties.widgetDescription) {
                    this.identificationForm.controls['widgetDescription']
                        .setValue(this.widgetToEdit.properties.widgetDescription);
                }
                if (this.widgetToEdit.properties.widgetDefaultExportFileType) {
                    this.identificationForm.controls['widgetDefaultExportFileType']
                        .setValue(this.widgetToEdit.properties.widgetDefaultExportFileType);
                }
                if (this.widgetToEdit.properties.widgetHyperLinkTabNr) {
                    this.identificationForm.controls['widgetHyperLinkTabNr']
                        .setValue(this.widgetToEdit.properties.widgetHyperLinkTabNr);
                }
                if (this.widgetToEdit.properties.widgetHyperLinkWidgetID) {
                    this.identificationForm.controls['widgetHyperLinkWidgetID']
                        .setValue(this.widgetToEdit.properties.widgetHyperLinkWidgetID);
                }
                if (this.widgetToEdit.properties.widgetPassword) {
                    this.identificationForm.controls['widgetPassword']
                        .setValue(this.widgetToEdit.properties.widgetPassword);
                }
                if (this.widgetToEdit.properties.widgetRefreshFrequency) {
                    this.identificationForm.controls['widgetRefreshFrequency']
                        .setValue(this.widgetToEdit.properties.widgetRefreshFrequency);
                }
                if (this.widgetToEdit.properties.widgetRefreshMode) {
                    this.identificationForm.controls['widgetRefreshMode']
                        .setValue(this.widgetToEdit.properties.widgetRefreshMode);
                }

                let LikedUsers: any = this.widgetToEdit.properties.widgetLiked.filter (
                    user => user.widgetLikedUserID != '')
                this.identificationForm.controls['NrwidgetLiked'].setValue(LikedUsers.length);
                
                if (this.widgetToEdit.properties.widgetReportName) {
                    this.selectedItem = {
                        id: this.widgetToEdit.properties.widgetReportID, 
                        name: this.widgetToEdit.properties.widgetReportName
                    };
                    this.identificationForm.controls['widgetReportName'].setValue(this.selectedItem);
                    this.selectedReport = this.selectedItem;

                    // Set the field DropDown content
                    this.loadReportRelatedInfoBody(this.widgetToEdit.properties.widgetReportID);
                }
                if (this.widgetToEdit.properties.widgetReportParameters) {
                    this.identificationForm.controls['widgetReportParameters']
                        .setValue(this.widgetToEdit.properties.widgetReportParameters);
                }
                if (this.widgetToEdit.properties.widgetShowLimitedRows) {
                    this.identificationForm.controls['widgetShowLimitedRows']
                        .setValue(this.widgetToEdit.properties.widgetShowLimitedRows);
                }
                if (this.widgetToEdit.properties.widgetAddRestRow) {
                    this.identificationForm.controls['widgetAddRestRow']
                        .setValue(this.widgetToEdit.properties.widgetAddRestRow);
                }
                if (this.widgetToEdit.properties.widgetType) {
                    this.selectedItem = {
                        id: this.widgetToEdit.properties.widgetTypeID, 
                        name: this.widgetToEdit.properties.widgetType}
                    ;
                    this.identificationForm.controls['widgetType'].setValue(this.selectedItem);
                    this.selectedWidgetCreation = this.selectedItem;
                }

                // TODO - get IDs for X & Y columns correctly and from the actual data
                if (this.widgetToEdit.properties.widgetType == 'BarChart') {

                    if (this.widgetToEdit.graph.vegaParameters.vegaGraphHeight) {
                        this.identificationForm.controls['vegaGraphHeight']
                            .setValue(this.widgetToEdit.graph.vegaParameters.vegaGraphHeight);
                    } 
                    if (this.widgetToEdit.graph.vegaParameters.vegaGraphWidth) {
                        this.identificationForm.controls['vegaGraphWidth']
                            .setValue(this.widgetToEdit.graph.vegaParameters.vegaGraphWidth);
                    }
                    if (this.widgetToEdit.graph.vegaParameters.vegaGraphPadding) {
                        this.identificationForm.controls['vegaGraphPadding']
                            .setValue(this.widgetToEdit.graph.vegaParameters.vegaGraphPadding);
                    }
                    if (this.widgetToEdit.graph.vegaParameters.vegaXcolumn) {
                        this.selectedItem = {
                            id: this.widgetToEdit.graph.vegaParameters.vegaXcolumn, 
                            name: this.widgetToEdit.graph.vegaParameters.vegaXcolumn
                        };
                        this.identificationForm.controls['vegaXcolumn'].setValue(this.selectedItem);
                        this.selectedVegaXcolumn = this.selectedItem;
                    }
                    if (this.widgetToEdit.graph.vegaParameters.vegaYcolumn) {
                        this.selectedItem = {
                            id: this.widgetToEdit.graph.vegaParameters.vegaYcolumn, 
                            name: this.widgetToEdit.graph.vegaParameters.vegaYcolumn
                        };
                        this.identificationForm.controls['vegaYcolumn'].setValue(this.selectedItem);
                        this.selectedVegaYcolumn = this.selectedItem;
                    }
                    if (this.widgetToEdit.graph.vegaParameters.vegaFillColor) {
                        this.selectedItemColor = {
                            id:this.widgetToEdit.graph.vegaParameters.vegaFillColor,             
                            name: this.widgetToEdit.graph.vegaParameters.vegaFillColor,             
                            code: this.canvasColors.hexCodeOfColor(
                                this.widgetToEdit.graph.vegaParameters.vegaFillColor
                            )
                        }
                        this.identificationForm.controls['vegaFillColor'].setValue(this.selectedItemColor);
                        this.selectedVegaFillColor = this.selectedItemColor;
                    }
                    if (this.widgetToEdit.graph.vegaParameters.vegaHoverColor) {
                        this.selectedItemColor = {
                            id:this.widgetToEdit.graph.vegaParameters.vegaHoverColor,             
                            name: this.widgetToEdit.graph.vegaParameters.vegaHoverColor,             
                            code: this.canvasColors.hexCodeOfColor(
                                this.widgetToEdit.graph.vegaParameters.vegaHoverColor
                            )
                        }
                        this.identificationForm.controls['vegaHoverColor'].setValue(this.selectedItemColor);
                        this.selectedVegaHoverColor = this.selectedItemColor;
                    }
                }

                // Load fields for Text box
                if (this.widgetToEdit.textual.textText) {
                    this.identificationForm.controls['textText']
                        .setValue(this.widgetToEdit.textual.textText);
                }
                if (this.widgetToEdit.textual.textBackgroundColor) {
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
                }
                if (this.widgetToEdit.textual.textBorder) {
                    this.selectedItem = {
                        id: 1, 
                        name: this.widgetToEdit.textual.textBorder
                    };
                    this.identificationForm.controls['textBorder'].setValue(this.selectedItem);
                    this.selectedTextBorder = this.selectedItem;
                }
console.log('Fixx',this.widgetToEdit.textual.textBorder,this.selectedItem,this.selectedTextBorder)                
                if (this.widgetToEdit.textual.textColor) {
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
                }
                if (this.widgetToEdit.textual.textFontSize) {
                    this.selectedItem = {
                        id: 1, 
                        name: this.widgetToEdit.textual.textFontSize.toString()
                    };
                    this.identificationForm.controls['textFontSize'].setValue(this.selectedItem);
                    this.selectedTextFontSize = this.selectedItem;
                }
                if (this.widgetToEdit.textual.textFontWeight) {
                    this.selectedItem = {
                        id: 1, 
                        name: this.widgetToEdit.textual.textFontWeight
                    };
                    this.identificationForm.controls['textFontWeight'].setValue(this.selectedItem);
                    this.selectedTextFontWeight = this.selectedItem;
                }
                if (this.widgetToEdit.textual.textHeight) {
                    this.identificationForm.controls['textHeight']
                        .setValue(this.widgetToEdit.textual.textHeight);
                }
                if (this.widgetToEdit.textual.textLeft) {
                    this.identificationForm.controls['textLeft']
                        .setValue(this.widgetToEdit.textual.textLeft);
                }
                if (this.widgetToEdit.textual.textMargin) {
                    this.selectedItem = {
                        id: 1, 
                        name: this.widgetToEdit.textual.textMargin
                    };
                    this.identificationForm.controls['textMargin'].setValue(this.selectedItem);
                    this.selectedTextMargin = this.selectedItem;
                }
                if (this.widgetToEdit.textual.textPadding) {
                    this.selectedItem = {
                        id: 1, 
                        name: this.widgetToEdit.textual.textPadding
                    };
                    this.identificationForm.controls['textPadding'].setValue(this.selectedItem);
                    this.selectedTextPadding = this.selectedItem;
                }
                if (this.widgetToEdit.textual.textPosition) {
                    this.selectedItem = {
                        id: 1, 
                        name: this.widgetToEdit.textual.textPosition
                    };
                    this.identificationForm.controls['textPosition'].setValue(this.selectedItem);
                    this.selectedTextPosition = this.selectedItem;
                }
                if (this.widgetToEdit.textual.textTextAlign) {
                    this.selectedItem = {
                        id: 1, 
                        name: this.widgetToEdit.textual.textTextAlign
                    };
                    this.identificationForm.controls['textTextAlign'].setValue(this.selectedItem);
                    this.selectedTextAlign = this.selectedItem;
                }
                if (this.widgetToEdit.textual.textTop) {
                    this.identificationForm.controls['textTop']
                        .setValue(this.widgetToEdit.textual.textTop);
                }
                if (this.widgetToEdit.textual.textWidth) {
                    this.identificationForm.controls['textWidth']
                        .setValue(this.widgetToEdit.textual.textWidth);
                }

                // Load fields for Image
                if (this.widgetToEdit.image.imageAlt) {
                    this.identificationForm.controls['imageAlt']
                        .setValue(this.widgetToEdit.image.imageAlt);
                }
                if (this.widgetToEdit.image.imageHeigt) {
                    this.identificationForm.controls['imageHeigt']
                        .setValue(this.widgetToEdit.image.imageHeigt);
                }
                if (this.widgetToEdit.image.imageLeft) {
                    this.identificationForm.controls['imageLeft']
                        .setValue(this.widgetToEdit.image.imageLeft);
                }
                if (this.widgetToEdit.image.imageSource) {
                    this.selectedItem = {
                        id: 1, 
                        name: this.widgetToEdit.image.imageSource
                    };
                    this.identificationForm.controls['imageSource'].setValue(this.selectedItem);
                    this.selectedImageSrc = this.selectedItem;
                }
                if (this.widgetToEdit.image.imageTop) {
                    this.identificationForm.controls['imageTop']
                        .setValue(this.widgetToEdit.image.imageTop);
                }
                if (this.widgetToEdit.image.imageWidth) {
                    this.identificationForm.controls['imageWidth']
                        .setValue(this.widgetToEdit.image.imageWidth);
                }

                // Indicate we are done loading form
                this.isLoadingForm = false;

            }
        }

        this.globalFunctionService.printToConsole(this.constructor.name, 'ngOnChanges', '@End');
    }

    onCancel() {
        this.globalVariableService.growlGlobalMessage.next({
            severity: 'warn',
            summary:  'Cancel',
            detail:   'No changes as requested'
        });
        
        this.formSubmit.emit('Cancel');
    }

    onSubmit() {
        // User clicked submit button
        this.globalFunctionService.printToConsole(this.constructor.name, 'onSubmit', '@Start');

        // Validation: note that == null tests for undefined as well
        this.formIsValid = false;
        this.errorMessageOnForm = '';
        this.numberErrors = 0;

        // Validation
        if (this.identificationForm.controls['widgetTabName'].value == ''  || 
            this.identificationForm.controls['widgetTabName'].value == null) {
                this.formIsValid = false;
                this.numberErrors = this.numberErrors + 1;
                this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 
                    'The Widget Tab Name is compulsory.';
        }
        if (this.identificationForm.controls['widgetTitle'].value == ''  || 
            this.identificationForm.controls['widgetTitle'].value == null) {
                this.formIsValid = false;
                this.numberErrors = this.numberErrors + 1;
                this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 
                    'The Widget Title is compulsory.';
        }
        if (this.identificationForm.controls['widgetCode'].value == ''  || 
            this.identificationForm.controls['widgetCode'].value == null) {
                this.formIsValid = false;
                this.numberErrors = this.numberErrors + 1;
                this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 
                    'The Widget Code is compulsory.';
        }
        if (this.identificationForm.controls['widgetName'].value == ''  || 
            this.identificationForm.controls['widgetName'].value == null) {
                this.formIsValid = false;
                this.numberErrors = this.numberErrors + 1;
                this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 
                    'The Widget Name is compulsory.';
        }
        if (this.identificationForm.controls['widgetDescription'].value == ''  || 
            this.identificationForm.controls['widgetDescription'].value == null) {
                this.formIsValid = false;
                this.numberErrors = this.numberErrors + 1;
                this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 
                    'The Widget Description is compulsory.';
        }
        if (this.identificationForm.controls['widgetHyperLinkWidgetID'].touched  && 
            !this.identificationForm.controls['widgetHyperLinkWidgetID'].valid) {
                this.formIsValid = false;
                this.numberErrors = this.numberErrors + 1;
                this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 
                    'The Hyperlinked Widget ID must be numberic';
        }
        if (this.identificationForm.controls['widgetRefreshFrequency'].touched  && 
            !this.identificationForm.controls['widgetRefreshFrequency'].valid) {
                this.formIsValid = false;
                this.numberErrors = this.numberErrors + 1;
                this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 
                    'The Refresh Frequency must be numberic';
        }
        if (this.identificationForm.controls['widgetReportName'].value == ''  || 
            this.identificationForm.controls['widgetReportName'].value == null) {
                if (this.addEditMode == 'Add') {
                    this.formIsValid = false;
                    this.numberErrors = this.numberErrors + 1;
                    this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 
                        'The Widget Report Name (data source) is compulsory when Adding.';
                }
        }
        if (this.identificationForm.controls['widgetType'].value == ''  || 
            this.identificationForm.controls['widgetType'].value == null) {
                this.formIsValid = false;
                this.numberErrors = this.numberErrors + 1;
                this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 
                    'The Widget Type is compulsory.';
        }

        // Tricksy bit: validate per Widget Type.  I know its a lot of work, but 
        // its the only solution for now

        // Widget Set field validation
        if (this.identificationForm.controls['widgetType'].value['name'] == 'WidgetSet') {

            if (this.identificationForm.controls['widgetReportWidgetSet'].value == ''  || 
                this.identificationForm.controls['widgetReportWidgetSet'].value == null) {
                    this.formIsValid = false;
                    this.numberErrors = this.numberErrors + 1;
                    this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 
                        'The Report Widget Set is compulsory.';
            }
        }

        // BarChart field validation
        if (this.identificationForm.controls['widgetType'].value['name'] == 'BarChart') {
            if (this.identificationForm.controls['widgetShowLimitedRows'].touched  && 
                !this.identificationForm.controls['widgetShowLimitedRows'].valid) {
                    this.formIsValid = false;
                    this.numberErrors = this.numberErrors + 1;
                    this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 
                        'The number of limited rows to show must be numberic';
            }        
            if (this.identificationForm.controls['vegaGraphHeight'].value == ''  ||
                !this.identificationForm.controls['vegaGraphHeight'].value == null) {
                    this.formIsValid = false;
                    this.numberErrors = this.numberErrors + 1;
                    this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 
                        'The graph Height must be numberic';
            }
            if (this.identificationForm.controls['vegaGraphWidth'].value == ''  ||
                !this.identificationForm.controls['vegaGraphWidth'].value == null) {
                    this.formIsValid = false;
                    this.numberErrors = this.numberErrors + 1;
                    this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 
                        'The graph Width must be numberic';
            }
            if (this.identificationForm.controls['vegaGraphPadding'].value == ''  || 
                !this.identificationForm.controls['vegaGraphPadding'].value == null) {
                    this.formIsValid = false;
                    this.numberErrors = this.numberErrors + 1;
                    this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 
                        'The graph Padding must be numberic';
            }

            if (this.identificationForm.controls['vegaXcolumn'].value == ''  || 
                this.identificationForm.controls['vegaXcolumn'].value == null) {
                    this.formIsValid = false;
                    this.numberErrors = this.numberErrors + 1;
                    this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 
                        'The X axis field is compulsory.';
            }
            if (this.identificationForm.controls['vegaYcolumn'].value == ''  || 
                this.identificationForm.controls['vegaYcolumn'].value == null) {
                    this.formIsValid = false;
                    this.numberErrors = this.numberErrors + 1;
                    this.errorMessageOnForm = this.errorMessageOnForm + ' ' + 
                        'The Y axis field is compulsory.';
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

            // First, load from form what wass indeed provided on the form
            this.widgetToEdit.container.widgetTitle = 
                this.identificationForm.controls['widgetTitle'].value;
            this.widgetToEdit.properties.widgetTabName = 
                this.identificationForm.controls['widgetTabName'].value;
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
            this.widgetToEdit.properties.widgetType = 
                this.identificationForm.controls['widgetType'].value;

            // Add x,y from where Icon was dropped
            this.widgetToEdit.container.left = this.globalFunctionService.alignToGripPoint(
                this.widgetToEditX);
            this.widgetToEdit.container.top = this.globalFunctionService.alignToGripPoint(
                this.widgetToEditY);
        }

        // Editing existing Widget
        if (this.addEditMode == 'Edit' && this.displayEditWidget &&
            this.widgetToEdit.properties.widgetID == this.widgetIDtoEdit) {

            // Only worry about changes when we are not loading
            if (!this.isLoadingForm) {
                this.widgetToEdit.properties.widgetTabName = 
                    this.identificationForm.controls['widgetTabName'].value;
                this.widgetToEdit.container.widgetTitle = 
                    this.identificationForm.controls['widgetTitle'].value;
                this.widgetToEdit.properties.widgetCode = 
                    this.identificationForm.controls['widgetCode'].value;
                this.widgetToEdit.properties.widgetName = 
                    this.identificationForm.controls['widgetName'].value;
                this.widgetToEdit.properties.widgetDescription = 
                    this.identificationForm.controls['widgetDescription'].value;
                this.widgetToEdit.properties.widgetDefaultExportFileType = 
                    this.identificationForm.controls['widgetDefaultExportFileType'].value;
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
                this.widgetToEdit.properties.widgetAddRestRow = 
                    this.identificationForm.controls['widgetAddRestRow'].value;
                this.widgetToEdit.properties.widgetType = 
                    this.identificationForm.controls['widgetType'].value;
            }

            this.globalVariableService.growlGlobalMessage.next({
                severity: 'info',
                summary:  'Success',
                detail:   'Widget updated'
            });
        }

        // Amend the specs IF given, according to the Widget Sets
        if (this.identificationForm.controls['widgetType'].value['name'] == 'WidgetSet') {
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
 
        if (this.identificationForm.controls['widgetType'].value['name'] == 'BarChart') {
            // Get the corresponding widget template
            this.loadWidgetTemplateFields();
            
            // this.widgetTemplates = this.eazlService.getWidgetTemplates (
            //     this.identificationForm.controls['widgetType'].value['name']
            // );

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

            if (this.identificationForm.controls['vegaFillColor'].value.name != '' &&
                this.identificationForm.controls['vegaFillColor'].value.name != undefined) {
                    this.widgetToEdit.graph.spec.marks[0].encode.update.fill.value =
                        this.identificationForm.controls['vegaFillColor'].value.name;
            }
            if (this.identificationForm.controls['vegaHoverColor'].value.name != '' &&
                this.identificationForm.controls['vegaHoverColor'].value.name != undefined) {
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

        if (this.identificationForm.controls['widgetType'].value['name'] == 'Custom') {
            this.widgetToEdit.graph.spec = JSON.parse(this.widgetToEditSpec);

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
 
        // Trigger event emitter 'emit' method
        this.formSubmit.emit('Submit');

        //  Note: Do NOT set 'this.displayEditWidget = false' here - it has to change in the parent
        //        componenent to take effect (and thus close Dialogue)
    }

    loadReportRelatedInfo(event) {
        // Load the WidgetSets for the selected Report
        this.globalFunctionService.printToConsole(this.constructor.name, 'loadReportRelatedInfo', '@Start');

        // Call the doer routine
        this.loadReportRelatedInfoBody(+event.value.id);
    }

    loadReportRelatedInfoBody(selectedReportID) {
        // Load the WidgetSets for the selected Report
        this.globalFunctionService.printToConsole(this.constructor.name, 'loadReportRelatedInfo', '@Start for ID: ' + selectedReportID);

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
        this.widgetCreationDropDown.push({
            label: 'WidgetSet',
            value: {
                id: 0,
                name: 'WidgetSet'
            }
        });
        this.widgetCreationDropDown.push({
            label: 'BarChart',
            value: {
                id: 1,
                name: 'BarChart'
            }
        });
        this.widgetCreationDropDown.push({
            label: 'PieChart',
            value: {
                id: 2,
                name: 'PieChart'
            }
        });
        this.widgetCreationDropDown.push({
            label: 'LineChart',
            value: {
                id: 3,
                name: 'LineChart'
            }
        }); 
        this.widgetCreationDropDown.push({
            label: 'Custom',
            value: {
                id: 4,
                name: 'Custom'
            }
        });
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
        // if (this.identificationForm.controls['widgetType'].value['name'] != 'WidgetSet') {
        this.widgetTemplate = null;

        // This is null for New Widgets
        if (this.identificationForm.controls['widgetType'].value != null) {
            if (this.identificationForm.controls['widgetType'].value['name'] != 'WidgetSet') {
                // Get the corresponding widget template
                this.widgetTemplate = this.eazlService.getWidgetTemplates (
                    this.identificationForm.controls['widgetType'].value['name']
                );
            }

            // Only Custom specs can be editted
            if (this.identificationForm.controls['widgetType'].value['name'] == 'Custom') {
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
        this.dashboardTabsDropDown = [];
        this.dashboardTabs = this.eazlService.getDashboardTabs(this.originalDashboardID);

        // Fill the dropdown on the form
        for (var i = 0; i < this.dashboardTabs.length; i++) {
            this.dashboardTabsDropDown.push({
                label: this.dashboardTabs[i].widgetTabName,
                value: {
                    id: this.dashboardTabs[i].widgetTabID,
                    name: this.dashboardTabs[i].widgetTabName
                }
            });
        }
    }

changeCheckBox() {
console.log('showText',this.showWidgetText)
console.log(this.showWidgetGraph)
console.log(this.showWidgetTable)
console.log(this.showWidgetImage)
console.log(this.identificationForm.controls['textBackgroundColor'].value)
console.log(this.identificationForm.controls['textBorder'].value)
console.log(this.identificationForm.controls['textColor'].value)
console.log(this.identificationForm.controls['textFontSize'].value)
console.log(this.identificationForm.controls['textFontWeight'].value)
console.log(this.identificationForm.controls['textHeight'].value)
console.log(this.identificationForm.controls['textLeft'].value)
console.log(this.identificationForm.controls['textMargin'].value)
console.log(this.identificationForm.controls['textPadding'].value)
console.log(this.identificationForm.controls['textPosition'].value)
console.log(this.identificationForm.controls['textTextAlign'].value)
console.log(this.identificationForm.controls['textTop'].value)
console.log(this.identificationForm.controls['textWidth'].value)

console.log(this.identificationForm.controls['imageAlt'].value)
console.log(this.identificationForm.controls['imageHeigt'].value)
console.log(this.identificationForm.controls['imageLeft'].value)
console.log(this.identificationForm.controls['imageSource'].value)
console.log(this.identificationForm.controls['imageTop'].value)
console.log(this.identificationForm.controls['imageWidth'].value)


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
        var view = new vg.View(vg.parse( this.widgetToEditSpec));
        view.renderer('svg')
            .initialize( this.widgetGraph.nativeElement)
            .hover()
            .run();

console.log('spec', this.widgetToEditSpec)
//         try {
//             var view = new vg.View(vg.parse( this.widgetToEditSpec));
//             view.renderer('svg')
//                 .initialize( this.widgetGraph.nativeElement)
//                 .hover()
//                 .run();
//         }
//         catch(err) {
// console.log('in err')
//             this.isVegaSpecBad = true;
//             this.widgetToEditSpec = '';
//         }
//         finally {
// console.log('finally bad good',this.isVegaSpecBad )            
//         }        
    }
}