/**Root Component
 * Manages the menu
 */
import { ActivatedRoute }             from '@angular/router';
import { Component }                  from '@angular/core';
import { OnInit }                     from '@angular/core';
import { isDevMode }                  from '@angular/core';
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
import { ReconnectingWebSocket }      from './websocket.service';

// Our Models
import { CanvasUser }                 from './model.user';
import { EazlService }                from './eazl.service';
import { Notification }               from './model.notification';
import { WebSocketBasicMessage }      from './model.notification';
import { WebSocketRefDataMessage }    from './model.notification';


@Component({
    selector:    'app-root',
    templateUrl: './app.component.html',
    styleUrls:  ['./app.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

    // Local Variables
    availableUsers: string[] = [];                  // List of UserNames available to share with
    devMode: boolean = false;
    displayLoginForm: boolean = false;              // True to display the Login form
    displayWhoAmIForm: boolean = false;             // True to display the WhoAmI form
    displayNewMessage: boolean = false;             // True to display new message form
    growlGlobalMessage: Message = [];               // Msg
    growlMsgs: Message[] = [];                      // Msg
    isCurrentUserAdmin: boolean = false             // True if current user is Admin
    lastSelectedMenuItemLabel: string = '';         // Last selected Menu item
    loginLabel: string = '';                        // Label on login menu
    menuItems: MenuItem[];                          // Array of menu items
    nrUnReadMessagesForMe: number = 0;              // Nr of unread messages
    routerLink:string = '';                         // RouterLink in Menu.Command
    sendToTheseUsers: string[] = [];                // List of UserNames to whom message is sent
    notificationFromServer: Notification;           // Websocket msg (OLD TODO - remove later...)
    webSocketBasicMessage: WebSocketBasicMessage;   // Basic WS message

    // Define Variables - define here if a global variable is used in html.
    canvasUser: CanvasUser = this.globalVariableService.canvasUser.getValue();
    frontendName: string = this.globalVariableService.frontendName;
    growlLife: number = this.globalVariableService.growlLife.getValue();
    growlSticky: boolean = this.globalVariableService.growlSticky.getValue();
    systemTitle: string = this.globalVariableService.systemTitle;
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
        private reconnectingWebSocket: ReconnectingWebSocket,
        ) {
            // Subscribe to Web Socket
this.reconnectingWebSocket.messageWS.subscribe(
    msg => console.log('msg', msg))            
            // handleNotificationFromWS.messages.subscribe(msg => {

            //     if (msg.messageType != '' ) {
            //         this.globalVariableService.growlGlobalMessage.next({
            //             severity: 'info',
            //             summary:  'Nofication from ' + msg.author,
            //             detail:   msg.dateSend + ' :' + msg.message
            //         });
            //     }
            // });

            // Default stuffies, for now ...
            this.globalVariableService.sessionDebugging.next(true);

            // Dev mode or not
            this.devMode = isDevMode();
        }

    handleNotificationFromWS(message: any) {
        // Receive and act upon the notification received from the WebSocket 
        // - message can be of any type, see model.notification.ts for detail
        this.globalFunctionService.printToConsole(this.constructor.name,'handleNotificationFromWS', '@Start');

        // // Refresh the data
        // this.eazlService.cacheCanvasData();

        // TODO - remove once webSocketBasicMessage is working
        // Temp solution to generate a Web Socket message
        this.notificationFromServer = {
            notificationID: 0,
            author:  'James Lawrance',
            dateSend: this.canvasDate.now('standard'),
            messageType: 'UserMessage',
            message: 'Your Magnum PI report has completed'
        }
		this.notificationService.messages.next(this.notificationFromServer);
		this.notificationFromServer.message = '';

        // Decide on type of message

        // Reset Reference Data
        if (message.webSocketMessageType == 'WebSocketRefDataMessage') {
            let webSocketRefDataMessage: WebSocketRefDataMessage = message;
         this.eazlService.cacheCanvasData(
             webSocketRefDataMessage.webSocketMessageBody.webSocketTableName, 
             'reset'
        );
        }
        if (message.webSocketMessageType == 'WebSocketCeleryMessage') {

        }
        if (message.webSocketMessageType == 'WebSocketSystemMessage') {

        }
        if (message.webSocketMessageType == 'WebSocketCanvasMessage') {

        }




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
        //   Form initialisation
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

        // Dev mode stuffies
        if (isDevMode()) {
            // Login, get back eazlUser from RESTi and set currentUser if successful
            this.eazlService.login('janniei', 'canvas100*')
                .then(eazlUser => {
                    this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '  Setted fake username janniei & preferences for Testing');

                    // Load menu array
                    this.menuItems = this.loadMenu()
                    }
                )
                .catch(err => {
                    this.globalFunctionService.printToConsole(this.constructor.name,'ngOnInit', '  Auto login failed!!');
                    this.globalVariableService.growlGlobalMessage.next({
                        severity: 'warn',
                        summary:  'Login Failed',
                        detail:   'Auto login for janniei failed'
                    });
        
                    // Set the menu items
                    this.menuItems = this.loadMenu()
                    console.log('Error in app.component.ts @ fakeLogin', err)
                    }
                )
        }

    }

    menuActionNewMessage() {
        // Pops up for new message
        this.globalFunctionService.printToConsole(this.constructor.name,'menuActionNewMessage', '@Start');

        // Get the current and available user shared with
        this.availableUsers = [];
        this.sendToTheseUsers = [];

        this.eazlService.getUsers().forEach(sglusr => {
            this.availableUsers.push(sglusr.username)
        })

        // Count Nr of unread messages for me
        this.nrUnReadMessagesForMe = this.eazlService.getCanvasMessages(-1, -1, -1).filter(
            cm => (cm.canvasMessageSentToMe == true  &&  cm.canvasMessageMyStatus == 'UnRead')).length;

        // Show the related popup form
        this.displayNewMessage = true;
    }

    menuActionWhoAmI (){
        // Pops up form for WhoAmI
        this.globalFunctionService.printToConsole(this.constructor.name,'menuActionWhoAmI', '@Start');

        this.displayWhoAmIForm = true;
    }

    menuActionLoginLogout() {
        // Pops up form for logging in
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
                        detail:   'Goodbye ' + this.globalVariableService.canvasUser.getValue().username +
                                  ', thank you for using ' + this.frontendName
                    });

                    // Logged out!
                    this.eazlService.logout(
                        this.globalVariableService.canvasUser.getValue().username
                    );

                    // Amend the menu
                    this.menuItems = this.loadMenu();

                    // Show the relevant page
                    this.displayLoginForm = true;
                    this.router.navigate(['pagenotfound']);

                }
            });
        }

        if (this.lastSelectedMenuItemLabel == 'Login') {
            // Show the login form
            this.displayLoginForm = true;
        }
    }

    userMenuResetPassword() {
        this.globalFunctionService.printToConsole(this.constructor.name,'userMenuResetPassword', '@Start');

        this.globalVariableService.growlGlobalMessage.next({
            severity: 'info',
            summary:  'User Password Reset',
            detail:   'Resetted user password'
        });
    }

    handleCanvasMessageFormSubmit(event) {
        // Is triggered after the new Message form is submitted
        this.globalFunctionService.printToConsole(this.constructor.name,'handleCanvasMessageFormSubmit', '@Start');

        // Get current user
        let currentUser: string = this.globalFunctionService.currentUser();

        // TODO - proper websocket message, remove this one
        // Send the message
        this.webSocketBasicMessage = {
            webSocketDatetime: this.canvasDate.now('standard'),
            webSocketSenderUsername: currentUser,
            webSocketMessageType: 'WebSocketRefDataMessage',
                                                // - WebSocketCanvasMessage
                                                // - WebSocketSystemMessage
                                                // - WebSocketCeleryMessage
                                                // - WebSocketRefDataMessage
            webSocketMessageBody: {
                webSocketTableName: 'SystemConfiguration',
                webSocketAction: 'Add',
                webSocketRecordID: 14,
                webSocketMessage: ''
            }
        }        
        if (event == 'Submit') {
            this.handleNotificationFromWS(this.webSocketBasicMessage);
        }

        // Rip away popup
        this.displayNewMessage = false;
    }

    public handleWhoAmISubmit(submit: boolean): void {
        // Is triggered after the login form is submitted
        this.globalFunctionService.printToConsole(this.constructor.name,'handleWhoAmISubmit', '@Start');

        // Rip away popup
        this.displayWhoAmIForm = false;
    }

    public handleFormSubmit(submit: boolean): void {
        // Is triggered after the login form is submitted
        this.globalFunctionService.printToConsole(this.constructor.name,'handleFormSubmit', '@Start');

        // Reload the menu to enable/disable according to result of login process
        this.menuItems = this.loadMenu();

        // Navigate further
        if (!this.globalVariableService.isAuthenticatedOnEazl) {
            this.router.navigate(['pagenotfound']);
        }
        else {

            if (this.globalVariableService.startupDashboardID.getValue() != 0) {
                this.router.navigate(['pagenotfound']);
            }
            else {
                this.router.navigate(['startup']);
            }
        }

        // Rip away popup
        this.displayLoginForm = false;
    }

    loadMenu(): MenuItem[] {
        // Re-get the variables, ie logged in, etc.  Then create the array of menu items for PrimeNG
        this.globalFunctionService.printToConsole(this.constructor.name,'loadMenu', '@Start');

        // Local variables
        let isLoggedIn: boolean = false;
        this.loginLabel = 'Login';
        this.isCurrentUserAdmin = false;

        // Get the current status of user -> determines menu enable/disable
        if (this.globalVariableService.canvasUser.getValue() != null) {

            this.isCurrentUserAdmin = this.globalVariableService.canvasUser.getValue().is_superuser;

            // Set label for login / logout
            if (this.globalVariableService.canvasUser.getValue().username == '' ) {
                this.loginLabel = 'Login';
                isLoggedIn = false;
            } else {
                this.loginLabel = 'Logout';
                isLoggedIn = true;
            }
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
                        label: 'Dashboard Editor',
                        icon:  'fa-table',
                        routerLink: ['dashboard'],
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
                        routerLink: ['messageManager'],
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
                        routerLink: ['group'],
                        disabled: false,
                        command: (event) => {
                            this.lastSelectedMenuItemLabel = event.item.label;
                        }
                    },
                    {
                        label: 'Data Sources',
                        icon:  'fa-database',
                        routerLink: ['dataSource'],
                        disabled: false,
                        command: (event) => {
                            this.lastSelectedMenuItemLabel = event.item.label;
                        }
                    },
                    {
                        label: 'Reports',
                        icon:  'fa-list-alt',
                        routerLink: ['report'],
                        disabled: false,
                        command: (event) => {
                            this.lastSelectedMenuItemLabel = event.item.label;
                        }
                    },
                    {
                        label: 'Dashboards',
                        icon:  'fa-dashboard',
                        routerLink: ['dashboardManager'],
                        disabled: false,
                        command: (event) => {
                            this.lastSelectedMenuItemLabel = event.item.label;
                        }
                    },
                    {
                        label: 'System Configuration',
                        icon:  'fa-wrench',
                        routerLink: ['systemconfig'],
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
                        disabled: !isLoggedIn,
                        command: (event) => {
                            this.lastSelectedMenuItemLabel = event.item.label;
                            this.menuActionWhoAmI();
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
                        routerLink: ['myprofile'],
                        disabled: !isLoggedIn,
                        command: (event) => {
                            this.lastSelectedMenuItemLabel = event.item.label;
                        }
                    },
                    {
                        label: 'Personalisation',
                        icon:  'fa-cogs',
                        disabled: !isLoggedIn,
                        routerLink: ['personalisation'],
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
                        label: 'Tutorials',
                        icon:  'fa-tags',
                        routerLink: ['doc-tutorials'],
                        disabled: false,
                        command: (event) => {
                            this.lastSelectedMenuItemLabel = event.item.label;
                        }
                    },
                    {
                        label: 'Reference guide',
                        icon:  'fa-file-text-o',
                        routerLink: ['doc-reference'],
                        disabled: false,
                        command: (event) => {
                            this.lastSelectedMenuItemLabel = event.item.label;
                        }
                    },
                    {
                        label: 'Discussions',
                        icon:  'fa-file-text',
                        routerLink: ['doc-discussions'],
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

testFn() {
// TODO - remove once done
        // Get current user
        let currentUser: string = this.globalFunctionService.currentUser();

        this.webSocketBasicMessage = {
            webSocketDatetime: this.canvasDate.now('standard'),
            webSocketSenderUsername: currentUser,
            webSocketMessageType: 'WebSocketRefDataMessage',
                                                // - WebSocketCanvasMessage
                                                // - WebSocketSystemMessage
                                                // - WebSocketCeleryMessage
                                                // - WebSocketRefDataMessage
            webSocketMessageBody: {
                webSocketTableName: 'SystemConfiguration',
                webSocketAction: 'Add',
                webSocketRecordID: 14,
                webSocketMessage: ''
            }
        }
this.handleNotificationFromWS(this.webSocketBasicMessage)
}
}
