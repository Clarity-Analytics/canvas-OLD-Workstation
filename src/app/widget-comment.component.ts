// Popup form to show the Comments for the selected Widget, and to add new ones
import { Component } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { Input } from '@angular/core';
import { OnInit } from '@angular/core';
import { Output } from '@angular/core';
import { Validators } from '@angular/forms';

// Our Services
import { EazlService } from './eazl.service';
import { GlobalFunctionService } from './global-function.service';
import { GlobalVariableService } from './global-variable.service';

// Our models
import { WidgetComment } from './model.widget.comment';

@Component({
    selector: 'widget-comment',
    templateUrl: 'widget-comment.component.html',
    styleUrls: ['widget-comment.component.css']
})
export class WidgetCommentComponent implements OnInit {

    @Input() selectedWidgetID: number;
    @Output() formSubmit: EventEmitter<boolean> = new EventEmitter();

    addingNew: boolean = false;                 // True if adding a new Comment, used in *ngIf
    addToSameThread: boolean = false;           // True if adding to same Thread
    lastWidgetComment: string = '';             // Comment of latest Comment
    lastWidgetCommentID: number = 0;            // CommentID of latest Comment
    lastWidgetCommentThreadID: number = 0;      // ThreadID of latest Comment
    submitted: boolean;                         // True if form submitted
    userform: FormGroup;                        // user form object for FBuilder
    widgetComments: WidgetComment[] = [];       // Array of Widget Comments

    constructor(
        private eazlService: EazlService,
        private fb: FormBuilder,
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
    ) {

    }

    ngOnInit() {
        //   Form initialisation
        this.globalFunctionService.printToConsole(this.constructor.name, 'ngOnInit', '@Start');

        // FormBuilder
        this.userform = this.fb.group({
            'commentheader': new FormControl('', Validators.required),
            'commentbody': new FormControl(''),
        });
    }

    ngOnChanges() {
        // Respond when Angular (re)sets data-bound input properties.
        this.globalFunctionService.printToConsole(this.constructor.name, 'ngOnChanges', '@Start');

        // Populate data for the Widget that is currently selected
        this.getWidgetComments()
    }

    getWidgetComments() {
        // TODO - get this sort to work, preferably on DB
        this.globalFunctionService.printToConsole(this.constructor.name, 'getWidgetComments', '@Start');

        // Get a sorted list from the backend
        this.widgetComments = this.eazlService.getWidgetsComments(this.selectedWidgetID).sort(
            function (a, b) {
                return +b.widgetCommentCreateDateTime.substring(6, 2) -
                    +a.widgetCommentCreateDateTime.substring(6, 2);
            })

        // Load some detail for the lastest Comment
        if (this.widgetComments.length > 0 ) {
            this.lastWidgetComment = 
                this.widgetComments[this.widgetComments.length - 1].widgetCommentHeading;
            this.lastWidgetCommentID =
                this.widgetComments[this.widgetComments.length - 1].widgetCommentID;
            this.lastWidgetCommentThreadID =
                this.widgetComments[this.widgetComments.length - 1].widgetCommentThreadID;
        }
    }

    onClickAddNewThread() {
        // Open form to Add a New Comment, on a new Thread
        this.globalFunctionService.printToConsole(this.constructor.name, 'onClickAddNewThread', '@Start');

        // Set adding mode (using *ngIf) and indicate same thread
        this.addToSameThread = false;
        this.addingNew = true
    }

    onClickAddSameThread() {
        // Open form to Add a new Comment on the last Thread
        this.globalFunctionService.printToConsole(this.constructor.name, 'onClickAddSameThread', '@Start');

        // Set adding mode (using *ngIf) and indicate a different thread
        this.addToSameThread = true;
        this.addingNew = true
    }

    onClickCancel() {
        // Nothing to do, so go back
        this.globalFunctionService.printToConsole(this.constructor.name, 'onClickCancel', '@Start');

        // Stop adding mode
        this.addingNew = false;
    }

    onSubmit(value: string) {
        // User clicked submit button, so Add to DB
        this.globalFunctionService.printToConsole(this.constructor.name, 'onSubmit', '@Start');

        // Add the Comment
        this.lastWidgetCommentID = this.lastWidgetCommentID + 1;
        if (!this.addToSameThread) {
            this.lastWidgetCommentThreadID = this.lastWidgetCommentThreadID + 1;
        }

        if(this.lastWidgetCommentThreadID == 0) {
            this.lastWidgetCommentThreadID = 1;
        }

        this.eazlService.addWidgetsComments( 
                this.lastWidgetCommentID, 
                this.selectedWidgetID,
                this.lastWidgetCommentThreadID,
                '2017/05/03 12:04',
                'JohnDeerT',
                this.userform.get('commentheader').value,
                this.userform.get('commentbody').value
        )

        // TODO - use later or delete
        // 1. To clear the commentbody:
        //    this.userform.controls['commentbody'].setValue('');
        // 2. To Trigger event emitter 'emit' method
        //    this.formSubmit.emit(true);

        // Refresh the data
        this.getWidgetComments()

        // Close the input portion of form
        this.addingNew = false;

    }
}