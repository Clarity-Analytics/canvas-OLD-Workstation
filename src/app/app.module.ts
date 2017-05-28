// Root Module
import { AbstractControl }            from '@angular/forms';
import { BrowserModule }              from '@angular/platform-browser';
import { ErrorHandler}                from '@angular/core';
import { FormArray }                  from '@angular/forms';
import { FormBuilder }                from '@angular/forms';
import { FormControl }                from '@angular/forms';
import { FormGroup }                  from '@angular/forms';
import { FormsModule }                from '@angular/forms';
import { HttpModule }                 from '@angular/http';
import { NgModule }                   from '@angular/core';
import { ReactiveFormsModule }        from '@angular/forms';
import { Route }                      from '@angular/router';
import { Router }                     from '@angular/router';
import { RouterModule }               from '@angular/router';
import { Validators }                 from '@angular/forms';

// PrimeNG
import { AccordionModule }            from 'primeng/primeng';  // p-accordion
import { AutoCompleteModule }         from 'primeng/primeng';  //p-autoComplete
import { BlockUIModule }              from 'primeng/primeng';  // p-blockUI
import { BreadcrumbModule }           from 'primeng/primeng';  // p-breadcrumb
import { ButtonModule }               from 'primeng/primeng';  // <button pButton type="button" label="Click"></button>
import { CalendarModule }             from 'primeng/primeng';  // p-calendar
import { CaptchaModule }              from 'primeng/primeng';  // p-captcha
import { CarouselModule }             from 'primeng/primeng';  // p-carousel
import { CheckboxModule }             from 'primeng/primeng';  //p-checkbox
import { ChipsModule }                from 'primeng/primeng';  // p-chips
import { ChartModule }                from 'primeng/primeng';  // p-chart
import { CodeHighlighterModule }      from 'primeng/primeng';  // <code class="language-css" pCode>
import { ConfirmDialogModule }        from 'primeng/primeng';  // p-confirmDialog
import { ConfirmationService }        from 'primeng/primeng';  // p-confirmDialog
import { DropdownModule }             from 'primeng/primeng';  //p-dropdown
import { ContextMenuModule }          from 'primeng/primeng';  // p-contextMenu
import { DataGridModule }             from 'primeng/primeng';  // p-dataGrid
import { DataListModule }             from 'primeng/primeng';  // -dataList
import { DataScrollerModule }         from 'primeng/primeng';  // p-dataScroller
import { DataTableModule }            from 'primeng/primeng';  // p-dataTable, p-column, etc
import { DialogModule }               from 'primeng/primeng';  // p-dialog
import { DragDropModule }             from 'primeng/primeng';  // <div pDraggable="dd">Draggable Div</div>, pDroppable
import { EditorModule }               from 'primeng/primeng';  // p-editor.  Dependency: Quill
import { FieldsetModule }             from 'primeng/primeng';  // p-fieldset
import { FileUploadModule }           from 'primeng/primeng';  // p-fileUpload
import { GalleriaModule }             from 'primeng/primeng';  // p-galleria
import { GMapModule }                 from 'primeng/primeng';  // p-gmap
import { GrowlModule }                from 'primeng/primeng';  // p-growl
import { InplaceModule }              from 'primeng/primeng';  // p-inplace
import { InputMaskModule }            from 'primeng/primeng';  // p-inputMask
import { InputSwitchModule }          from 'primeng/primeng';  //p-inputSwitch 
import { InputTextareaModule }        from 'primeng/primeng';  // <textarea pInputTextarea />
import { InputTextModule }            from 'primeng/primeng';  // <input type="text" pInputText />
import { LightboxModule }             from 'primeng/primeng';  // p-lightbox
import { ListboxModule }              from 'primeng/primeng';  // p-listbox
import { MegaMenuModule }             from 'primeng/primeng';  // p-megaMenu
import { MenubarModule }              from 'primeng/primeng';  // p-menubar
import { MenuItem }                   from 'primeng/primeng';  //  Needed for diff menus
import { MenuModule }                 from 'primeng/primeng';  // p-menu
import { Message }                    from 'primeng/primeng';  
import { MessagesModule }             from 'primeng/primeng';  // p-messages
import { MultiSelectModule }          from 'primeng/primeng';  // p-multiSelect
import { OrderListModule }            from 'primeng/primeng';  // p-orderList
import { OverlayPanelModule }         from 'primeng/primeng';  // p-overlayPanel
import { PaginatorModule }            from 'primeng/primeng';  // p-paginator
import { PanelMenuModule }            from 'primeng/primeng';  // p-panelMenu
import { PanelModule }                from 'primeng/primeng';  // p-panel
import { PasswordModule }             from 'primeng/primeng';  //<input type="password" pPassword [(ngModel)]="property"/>
import { PickListModule }             from 'primeng/primeng';  // p-pickList
import { ProgressBarModule }          from 'primeng/primeng';  // p-progressBar
import { RadioButtonModule }          from 'primeng/primeng';  // p-radioButton
import { RatingModule }               from 'primeng/primeng';  // p-rating
import { ScheduleModule }             from 'primeng/primeng';  // p-schedule
import { SelectButtonModule }         from 'primeng/primeng';  // p-selectButton
import { SharedModule }               from 'primeng/primeng';  // Shared by a few
import { SlideMenuModule }            from 'primeng/primeng';  // p-slideMenu
import { SliderModule }               from 'primeng/primeng';  // p-slider
import { SpinnerModule }              from 'primeng/primeng';  // p-spinner
import { SplitButtonModule }          from 'primeng/primeng';  // p-splitButton.  Dependency: Router has to be fully configured
import { TabMenuModule }              from 'primeng/primeng';  // p-tabMenu
import { TabViewModule }              from 'primeng/primeng';  // p-tabView, p-tabPanel, etc
import { TerminalModule }             from 'primeng/primeng';  // p-terminal
import { TieredMenuModule }           from 'primeng/primeng';  // p-tieredMenu
import { ToolbarModule }              from 'primeng/primeng';  // p-toolbar
import { ToggleButtonModule }         from 'primeng/primeng';  // p-toggleButton
import { TooltipModule }              from 'primeng/primeng';  // <input type="text" pTooltip="Enter your username">
import { TreeModule }                 from 'primeng/primeng';  // p-tree
import { TreeNode }                   from 'primeng/primeng';  // Shared by a few
import { TreeTableModule }            from 'primeng/primeng';  // p-treeTable, p-column, etc
import { TriStateCheckboxModule }     from 'primeng/primeng';  // p-triStateCheckbox
import { StepsModule }                from 'primeng/primeng';  // p-steps

// Our Components
import { AppComponent }               from './app.component';
import { DashboardAdvFilterComponent} from './dashboard-advancedfilter.component';
import { DashboardComponent }         from './dashboard.component';
import { DashboardManagerComponent }     from './dashboard.manager.component';
import { DashboardEditorComponent}    from './dashboard-editor.component';
import { DashboardTabEditorComponent} from './dashboard-tab-editor.component';
import { LoginComponent }             from './login.component';
import { PageNotFoundComponent }      from './pagenotfound.component';
import { UserComponent}               from './user.component';
import { UserPopupComponent }         from './user-popup.component';
import { WidgetEditorComponent }      from './widget-editor.component';
import { WidgetCommentComponent }     from './widget-comment.component';

// Our Directives

// Our Services
import { AuthGuard }                  from './authguard.service';
import { CanvasDate }                 from './date.services';
import { EazlService }                from './eazl.service';
import { GlobalErrorHandler }         from './error-handler.service';
import { GlobalFunctionService }      from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';
import { NotificationService }        from './notification.service';
import { WebSocketService }           from './websocket.service';

// Our models
import { CanvasColors }               from './chartcolors.data';

// Constants and variables and interfaces and things
import { routes }                     from './app.routes';

@NgModule({
  declarations: [
    // Our Components
    AppComponent,
    DashboardAdvFilterComponent,
    DashboardComponent,
    DashboardManagerComponent,
    DashboardEditorComponent,
    DashboardTabEditorComponent,
    LoginComponent,
    PageNotFoundComponent,
    UserComponent,
    UserPopupComponent,
    WidgetEditorComponent,
    WidgetCommentComponent,
    // BarCharBuilder,
  ],
  imports: [
    // Angular stuffies
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule,
    RouterModule.forRoot(routes),

    // PrimeNG stuffies
    AccordionModule,
    AutoCompleteModule,
    BreadcrumbModule,
    BlockUIModule,
    ButtonModule,
    CalendarModule,
    ChartModule,
    ChipsModule,
    CheckboxModule,
    CaptchaModule,
    CarouselModule,
    CodeHighlighterModule,
    ConfirmDialogModule,
    ContextMenuModule,
    DataGridModule,
    DataListModule,
    DataScrollerModule,
    DataTableModule,
    DialogModule,
    DragDropModule,
    DropdownModule,
    EditorModule,
    FieldsetModule,
    FileUploadModule,
    GalleriaModule,
    GMapModule,
    GrowlModule,
    InplaceModule,
    InputSwitchModule,
    InputTextareaModule,
    InputMaskModule,
    InputTextModule,
    LightboxModule,
    ListboxModule,
    MegaMenuModule,
    MenubarModule,
    MenuModule ,
    MessagesModule,
    MultiSelectModule,
    OrderListModule,
    OverlayPanelModule,
    PaginatorModule,
    PanelModule,
    PanelMenuModule,
    PasswordModule,
    PickListModule,
    ProgressBarModule,
    RadioButtonModule,
    RatingModule,
    ScheduleModule,
    SelectButtonModule,
    SharedModule,
    SlideMenuModule,
    SliderModule,
    SpinnerModule,
    SplitButtonModule,
    StepsModule,
    TabMenuModule,
    TabViewModule,
    TerminalModule,
    TieredMenuModule,
    TreeModule,
    TreeTableModule,
    TriStateCheckboxModule,
    ToggleButtonModule,
    ToolbarModule,
    TooltipModule,

  ],
  providers: [
    {
      provide: ErrorHandler, 
      useClass: GlobalErrorHandler
    },

    // NG Services
    ConfirmationService,

    // Our Services
    AuthGuard,
    CanvasDate,
    CanvasColors,
    EazlService,
    GlobalFunctionService,
    GlobalVariableService,
    NotificationService,
    WebSocketService,

  ],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
