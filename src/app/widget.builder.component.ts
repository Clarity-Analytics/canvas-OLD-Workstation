// Widget Builder - Popup form to Add / Edit Widget
import { Component } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Input } from '@angular/core';
import { OnInit } from '@angular/core';
import { Output } from '@angular/core';
import { Validators } from '@angular/forms';

//  PrimeNG stuffies
import { SelectItem }                 from 'primeng/primeng';

// Our Services
import { EazlService } from './eazl.service';
import { GlobalFunctionService }      from './global.function.service';
import { GlobalVariableService }      from './global.variable.service';

// Our models
import { DashboardTab }               from './model.dashboardTabs';
import { WidgetComment }              from './model.widget.comment';

@Component({
    selector:    'widget-builder',
    templateUrl: 'widget.builder.component.html',
    styleUrls:  ['widget.builder.component.html']
})
export class WidgetBuilderComponent implements OnInit {

    @Input() selectedDashboardID: number;
    
    @Output() formSubmit: EventEmitter<boolean> = new EventEmitter();

    addingNew: boolean = true;                  // True if adding a new Comment, used in *ngIf
    addToSameThread: boolean = false;           // True if adding to same Thread
    submitted: boolean;                         // True if form submitted
    userform: FormGroup;                        // user form object for FBuilder
    selectedTabName: any;
    dashboardTabsDropDown:  SelectItem[];
    dashboardTabs: DashboardTab[];

    constructor(
        private eazlService: EazlService,
        private fb: FormBuilder,
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
    ) {

    }

    ngOnInit() {
        this.globalFunctionService.printToConsole(this.constructor.name, 'ngOnInit', '@Start');

// Questions
    // container. title only ?
    // Comments not here - only on Widget itself with popup?
    // widgetIndex necessary?  To show sequence, can be used to re-arrange??
    // Need a z-Index to indicate depth, or NOT ?
    // How a Default Layout?  Need a RESET button?
    // Create from - copy/clone or just pointer to object?

// Separate standalone WB 

// Action
    // Create new 
    // Create from 
    // Edit existing

// Container
    //     widgetTabName: string;                  // FK to Tab Name where widget lives
    //     title: string;


// Data
    //     widgetReportName: string;               // Report (query) name in Eazl
    //     widgetReportParameters: string;         // Optional Report parameters
    //     widgetShowLimitedRows: number;          // 0 = show all, 5 = TOP 5, -3 = BOTTOM 3
    //     widgetAddRestRow: boolean;              // True means add a row to data = SUM(rest)

// Type
    //     widgetType: string;                     // Bar, Pie, Text, etc

// Graph Identification and Description
    //     widgetCode: string;                     // Short Code ~ ShortName
    //     widgetName: string;                     // Descriptive Name
    //     widgetDescription: string;              // User description
    //     widgetDefaultExportFileType: string;    // User can select others at export time
    
// Widget behaviour & treatment
    //     widgetIsLocked: boolean;                // Protected against changes
    //     widgetPassword: string;                 // Optional password
    //     widgetHyperLinkTabNr: string;           // Optional Tab Nr to jump to
    //     widgetHyperLinkWidgetID: string;        // Optional Widget ID to jump to
    //     widgetLiked: [                          // Array of UserIDs that likes this
    //         {
    //             widgetLikedUserID: string; 
    //         }
    //     ];
    //     widgetRefreshFrequency: number;         // Nr of seconds if RefreshMode = Repeatedly
    //     widgetRefreshMode: string;              // Manual, OnOpen, Repeatedly

// Not filled in / AUTO
    //     widgetID: number;                       // Unique ID from DB
    //     dashboardID: number;                    // FK to DashboardID to which widget belongs
    //     widgetCreatedDateTime: string;          // Created on
    //     widgetCreatedUserID: string;            // Created by
    //     widgetUpdatedDateTime: string;          // Updated on
    //     widgetUpdatedUserID: string;            // Updated by
    //     widgetRefreshedDateTime: string;        // Data Refreshed on
    //     widgetRefreshedUserID: string;          // Date Refreshed by
    //     widgetSystemMessage: string;            // Optional for Canvas to say something to user
    //     widgetComments: string;                 // Optional comments
    //     widgetSize: string;                     // Small, Medium, Large
// background, color, boxshadow, border, font-size, etc => defaults

// TODO - store defaults in DB !!!





        // FormBuilder
        this.userform = this.fb.group({
            'commentheader': new FormControl('', Validators.required),
            'commentbody': new FormControl(''),
            'reportparameters': new FormControl(''),
        });
    }

    ngOnChanges() {
        // Respond when Angular (re)sets data-bound input properties.
        this.globalFunctionService.printToConsole(this.constructor.name, 'ngOnChanges', '@Start');

        // Populate Tabs for the Dashboard that is currently selected
        this.loadDashboardTabs()
    }

    addNewThread() {
        // Open form to Add a New Comment, on a new Thread
        this.globalFunctionService.printToConsole(this.constructor.name, 'addNewThread', '@Start');

        // Set adding mode (using *ngIf) and indicate same thread
        this.addToSameThread = false;
        this.addingNew = true
    }

    addSameThread() {
        // Open form to Add a new Comment on the last Thread
        this.globalFunctionService.printToConsole(this.constructor.name, 'addSameThread', '@Start');

        // Set adding mode (using *ngIf) and indicate a different thread
        this.addToSameThread = true;
        this.addingNew = true
    }

    cancel() {
        // Nothing to do, so go back
        this.globalFunctionService.printToConsole(this.constructor.name, 'cancel', '@Start');

        // Stop adding mode
        this.addingNew = false;
    }

    onSubmit(value: string) {
        // User clicked submit button, so Add to DB
        this.globalFunctionService.printToConsole(this.constructor.name, 'onSubmit', '@Start');


        // TODO - use later or delete
        // 1. To clear the commentbody:
        //    this.userform.controls['commentbody'].setValue('');
        // 2. To Trigger event emitter 'emit' method
        //    this.formSubmit.emit(true);

        // Close the input portion of form
        this.addingNew = false;

    }

    loadDashboardTabs() {
        // Load the Tabs for the selected Dashboard
        this.globalFunctionService.printToConsole(this.constructor.name, 'loadDashboard', '@Start');

        // Get its Tabs in this Dashboard
        this.dashboardTabsDropDown = [];
        this.dashboardTabs = this.eazlService.getDashboardTabs(this.selectedDashboardID);

        // Fill the dropdown on the form
        for (var i = 0; i < this.dashboardTabs.length; i++) {
                this.dashboardTabsDropDown.push({
                    label: this.dashboardTabs[i].widgetTabName,
                    value: {
                        id: this.dashboardTabs[i].dashboardID,
                        name: this.dashboardTabs[i].widgetTabName
                    }
                });
        }
    }

}