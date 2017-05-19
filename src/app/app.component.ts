/**Root Component
 * Manages the menu
 */
import { ActivatedRoute }             from '@angular/router';
import { Component }                  from '@angular/core';
import { OnInit }                     from '@angular/core';
import { Router }                     from '@angular/router';
import { ViewEncapsulation }          from '@angular/core';
 
// PrimeNG
import { ConfirmationService }        from 'primeng/primeng';  
import { MenubarModule }              from 'primeng/primeng';
import { MenuItem }                   from 'primeng/primeng';  
import { Message }                    from 'primeng/primeng';  

// Our Services
import { CanvasDate }                 from './date.services';
import { GlobalFunctionService }      from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';
import { NotificationService }        from './notification.service';
import { WebSocketService }           from './websocket.service';

// Our Models
import { CanvasUser }                 from './model.user';
import { EazlService }                from './eazl.service';
import { Notification }               from './model.notification';

@Component({
    selector:    'app-root',
    templateUrl: './app.component.html',
    styleUrls:  ['./app.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

    // Local Variables
    growlGlobalMessage: Message = [];
    growlMsgs: Message[] = [];
    displayNewMessage: boolean = false;
    setFakeVariablesForTesting: boolean = false;    // Jass for me
    isCurrentUserAdmin: boolean = false
    lastSelectedMenuItemLabel: string = '';     
    loginLabel: string = '';                        // Label on login menu
    menuItems: MenuItem[];                          // Array of menu items
    routerLink:string = '';                         // RouterLink in Menu.Command

    private notificationFromServer: Notification;

    // Define Variables - define here if a global variable is used in html.
    canvasUser: CanvasUser = this.globalVariableService.canvasUser.getValue();
    currentUserUserName: string = this.globalVariableService.currentUserUserName.getValue();
    frontendName: string = this.globalVariableService.frontendName.getValue();
    growlLife: number = this.globalVariableService.growlLife.getValue();
    growlSticky: boolean = this.globalVariableService.growlSticky.getValue();
    systemTitle: string = this.globalVariableService.systemTitle.getValue();
    testEnvironmentName: string = this.globalVariableService.testEnvironmentName.getValue();

    constructor(
        private canvasDate: CanvasDate,
        private confirmationService: ConfirmationService,
        private eazlService: EazlService,
        private globalFunctionService: GlobalFunctionService,
        private globalVariableService: GlobalVariableService,
        private notificationService: NotificationService,
        private route: ActivatedRoute,
        private router: Router,
        ) { 
            // Subscribe to Web Socket
            notificationService.messages.subscribe(msg => {			
                
                if (msg.messageType != '' ) {
                    this.globalVariableService.growlGlobalMessage.next({
                        severity: 'info', 
                        summary:  'Nofication from ' + msg.author, 
                        detail:   msg.dateSend + ' :' + msg.message
                    });
                }
            });            

            // Default stuffies, for now ...
            this.globalVariableService.sessionDebugging.next(true);
        }

    sendNotificationToServer() {
        // Temp solution to generate a Web Socket message
        this.notificationFromServer = {
            author:  'James Lawrance',
            dateSend: '2017/04/01',
            messageType: 'UserMessage',
            message: 'Your Magnum PI report has completed'
        }

		this.notificationService.messages.next(this.notificationFromServer);
		this.notificationFromServer.message = '';
// let d = new Date();
// console.log(d);
// console.log(this.canvasDate.weekDay(1))
// console.log(this.canvasDate.daysOfWeek());
// console.log(this.canvasDate.dayOfWeek(d));
// console.log(this.canvasDate.dayOfMonth(d));
// console.log(this.canvasDate.months());
// console.log(this.canvasDate.curMonth(d));
// console.log(this.canvasDate.curYear(d));
// console.log(this.canvasDate.curHour(d));
// console.log(this.canvasDate.curMinute(d));
// console.log(this.canvasDate.curSeconds(d));
// console.log(this.canvasDate.curMeridiem(d));
// console.log(this.canvasDate.today('locale'));
// console.log(this.canvasDate.today('standard'));
    }

    ngOnInit() {
        this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '@Start');

        // Subscribe to the global alerts (that are growled)
        // growlGlobalMessage = observable new (single) message
        this.globalVariableService.growlGlobalMessage.subscribe (
            newgrowlmsg => {

                // Kill old message if not sticky (else user have to delete them each time)
                if (!this.growlSticky) {
                    this.growlMsgs = [];
                }

                if (newgrowlmsg.detail != '') {    
                    this.growlMsgs.push({
                        severity: newgrowlmsg.severity, 
                        summary:  newgrowlmsg.summary, 
                        detail:   newgrowlmsg.detail 
                    });                
                }
            }
        );

        // Fake login & preferences for testing - KEEP for next time - just set to FALSE
        this.setFakeVariablesForTesting = true;
        if (this.setFakeVariablesForTesting) {
            this.globalVariableService.currentUserUserName.next('JannieI');
            this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '  Set fake username name & preferences for Testing');
            this.globalVariableService.isCurrentUserAdmin.next(true);

        }

        // Load menu array
        this.menuItems = this.loadMenu()
    }

    menuActionNewMessage() {
        // Pops up for new message
        this.globalFunctionService.printToConsole(this.constructor.name,'menuActionNewMessage', '@Start');
        
        // Send dummy
        // TODO - create space for real message
        this.sendNotificationToServer();
    }

    menuActionLoginLogout() {
        // Pops up for new message
        this.globalFunctionService.printToConsole(this.constructor.name,'menuActionLoginLogout', '@Start');

        // Lets confirm - everyone deserves a second chance
        if (this.lastSelectedMenuItemLabel == 'Logout') {
            this.confirmationService.confirm({
                message: 'Are you sure that you want to logout?',
                reject: () => { return},
                accept: () => {
                
                    this.globalVariableService.growlGlobalMessage.next({
                        severity: 'warn', 
                        summary:  'Logged out', 
                        detail:   'Goodbye ' + this.currentUserUserName + 
                                  ', thank you for using ' + this.frontendName
                    });
                    
                    // Logged out!
                    this.globalVariableService.currentUserUserName.next('');
                    
                    // Amend the menu
                    this.menuItems = this.loadMenu();

                    // Show the login form
                    this.displayNewMessage = true;        

this.router.navigate(['pagenotfound']);     
                    
                }
            });
        }

        if (this.lastSelectedMenuItemLabel == 'Login') {
            // Show the login form
            this.displayNewMessage = true;        
        }
    }

    public handleFormSubmit(submit: boolean): void {
        // Is triggered after the login form is submitted
        this.globalFunctionService.printToConsole(this.constructor.name,'handleFormSubmit', '@Start');

        // Reload the menu to enable/disable according to result of login process
        this.menuItems = this.loadMenu();

        // Navigate further
        if (!this.eazlService.isAuthenticatedOnEazl) {
            // this.globalVariableService.growlGlobalMessage.next({
            //     severity: 'warn', 
            //     summary:  'Login failed', 
            //     detail:   'Username & Password not recognised'
            // });

            this.router.navigate(['pagenotfound']);     
        } 
        else {
            // this.globalVariableService.growlGlobalMessage.next({
            //     severity: 'info', 
            //     summary:  'Logged in', 
            //     detail:   'Welcome ' + this.currentUserUserName
            // });

            if (this.globalVariableService.startupDashboardID.getValue() != 0) {
                this.router.navigate(['pagenotfound']);     
            }
            else {
                this.router.navigate(['startup']);                
            }
        }

        // Rip away popup
        this.displayNewMessage = false;        
    }

    loadMenu(): MenuItem[] {
        // Re-get the variables, ie logged in, etc.  Then create the array of menu items for PrimeNG
        this.globalFunctionService.printToConsole(this.constructor.name,'loadMenu', '@Start');

        // Local variables
        let isLoggedIn: boolean = false;
        
        // Get the current status of user -> determines menu enable/disable
        this.currentUserUserName = this.globalVariableService.currentUserUserName.getValue();
        this.isCurrentUserAdmin = this.globalVariableService.isCurrentUserAdmin.getValue();

        // Set label for login / logout
        if (this.currentUserUserName == '' ) {
            this.loginLabel = 'Login'; 
            isLoggedIn = false;
        }
        else {
            this.loginLabel = 'Logout';
            isLoggedIn = true;
        }

        this.menuItems = [
            {
                label: 'Canvas',
                icon:  'fa-connectdevelop',
                disabled: false,
                command: (event) => {
                    this.lastSelectedMenuItemLabel = event.item.label;
            }    
            },
            {
                label: 'Visualise',
                icon:  'fa-th-large',
                disabled: !isLoggedIn,
                items: [
                    {
                        label: 'Show All', 
                        icon:  'fa-th',
                        routerLink: ['dashboard'],
                        disabled: false,
                        command: (event) => {
                            this.lastSelectedMenuItemLabel = event.item.label;
                        }    
                    },
                    {
                        label: 'Dashboards', 
                        icon:  'fa-table',
                        routerLink: ['dashboard'],
                        disabled: false,
                        command: (event) => {
                            this.lastSelectedMenuItemLabel = event.item.label;
                        }    
                    },
                    {
                        label: 'New Graphical', 
                        icon:  'fa-image',
                        routerLink: ['startup'],
                        disabled: false,
                        command: (event) => {
                            this.lastSelectedMenuItemLabel = event.item.label;
                        }    
                    },
                ]
            },
            {
                label: 'Collaborate',
                icon:  'fa-wechat',
                disabled: !isLoggedIn,
                items: [
                    {
                        label: 'New Message', 
                        icon:  'fa-comment-o',
                        disabled: false,
                        command: (event) => {
                            this.lastSelectedMenuItemLabel = event.item.label;
                            this.menuActionNewMessage();
                        }    
                    },
                    {
                        label: 'Show Messages', 
                        icon:  'fa-comments',
                        routerLink: ['startup'],
                        disabled: false,
                        command: (event) => {
                            this.lastSelectedMenuItemLabel = event.item.label;
                        }    
                    },
                ]
            },
            {
                label: 'Manage',
                icon:  'fa-street-view',
                disabled: !(this.isCurrentUserAdmin && isLoggedIn),
                
                items: [
                    {
                        label: 'Users', 
                        icon:  'fa-user',
                        routerLink: ['users'],
                        disabled: false,
                        command: (event) => {
                            this.lastSelectedMenuItemLabel = event.item.label;
                        }    
                    },
                    {
                        label: 'Groups',
                        icon:  'fa-group', 
                        routerLink: ['startup'],
                        disabled: false,
                        command: (event) => {
                            this.lastSelectedMenuItemLabel = event.item.label;
                        }    
                    },
                    {
                        label: 'Data Sources', 
                        icon:  'fa-database',
                        routerLink: ['startup'],
                        disabled: false,
                        command: (event) => {
                            this.lastSelectedMenuItemLabel = event.item.label;
                        }    
                    },
                    {
                        label: 'Reports', 
                        icon:  'fa-list-alt',
                        routerLink: ['startup'],
                        disabled: false,
                        command: (event) => {
                            this.lastSelectedMenuItemLabel = event.item.label;
                        }    
                    },
                    {
                        label: 'Dashboards',
                        icon:  'fa-dashboard', 
                        routerLink: ['startup'],
                        disabled: false,
                        command: (event) => {
                            this.lastSelectedMenuItemLabel = event.item.label;
                        }    
                    },
                    {
                        label: 'System Configuration', 
                        icon:  'fa-wrench',
                        routerLink: ['startup'],
                        disabled: false,
                        command: (event) => {
                            this.lastSelectedMenuItemLabel = event.item.label;
                        }    
                    },
                ]
            },
            {
                label: 'My Account',
                icon:  'fa-smile-o',
                disabled: false,
                items: [
                    {
                        label: 'Who Am I', 
                        icon:  'fa-male',
                        routerLink: ['startup'],
                        disabled: !isLoggedIn,
                        command: (event) => {
                            this.lastSelectedMenuItemLabel = event.item.label;
                        }    
                    },
                    {
                    label: this.loginLabel, 
                        icon:  'fa-refresh',
                        disabled: false,
                        command: (event) => {
                            this.lastSelectedMenuItemLabel = event.item.label;
                            this.menuActionLoginLogout();
                        }    
                    },
                    {
                        label: 'My Profile', 
                        icon:  'fa-cog',
                        routerLink: ['startup'],
                        disabled: !isLoggedIn,
                        command: (event) => {
                            this.lastSelectedMenuItemLabel = event.item.label;
                        }    
                    },
                    {
                        label: 'Personalisation', 
                        icon:  'fa-cogs',
                        routerLink: ['startup'],
                        disabled: !isLoggedIn,
                        command: (event) => {
                            this.lastSelectedMenuItemLabel = event.item.label;
                        }    
                    },
                ]
            },
            {
                label: 'Help', 
                icon:  'fa-question',
                disabled: false,
                items: [
                    {
                        label: 'System Info', 
                        icon:  'fa-info',
                        routerLink: ['startup'],
                        disabled: false,
                        command: (event) => {
                            this.lastSelectedMenuItemLabel = event.item.label;
                        }    
                    },
                    {
                        label: 'Feedback', 
                        icon:  'fa-envelope',
                        routerLink: ['startup'],
                        disabled: !isLoggedIn,
                        command: (event) => {
                            this.lastSelectedMenuItemLabel = event.item.label;
                        }    
                    },
                    {
                        label: 'User Manual',
                        icon:  'fa-file-text-o', 
                        routerLink: ['startup'],
                        disabled: false,
                        command: (event) => {
                            this.lastSelectedMenuItemLabel = event.item.label;
                        }    
                    },
                    {
                        label: 'Backend Docs', 
                        icon:  'fa-file-text',
                        routerLink: ['startup'],
                        disabled: false,
                        command: (event) => {
                            this.lastSelectedMenuItemLabel = event.item.label;
                        }    
                    },
                    {
                        label: 'System Installation', 
                        icon:  'fa-tags',
                        routerLink: ['startup'],
                        disabled: false,
                        command: (event) => {
                            this.lastSelectedMenuItemLabel = event.item.label;
                        }    
                    },
                ]
            }
        ];

        // Return stuff
        return this.menuItems;       
    }
}


