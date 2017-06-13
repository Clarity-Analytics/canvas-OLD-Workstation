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
import { CDAL }                       from './cdal.service';
import { GlobalFunctionService }      from './global-function.service';
import { GlobalVariableService }      from './global-variable.service';
import { NotificationService }        from './notification.service';
import { WebSocketService }           from './websocket.service';

// Our Models
import { CanvasUser }                 from './model.user';
import { EazlService }                from './eazl.service';
import { Notification }               from './model.notification';




//testFn()
import { Observable }                 from 'rxjs/Observable';
import { User } from './model.user';

@Component({
    selector:    'app-root',
    templateUrl: './app.component.html',
    styleUrls:  ['./app.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

    // Local Variables
    availableUsers: string[] = [];                  // List of UserIDs available to share with
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
    setFakeVariablesForTesting: boolean = false;    // Jass for me
    sendToTheseUsers: string[] = [];                // List of UserIDs to whom message is sent
    private notificationFromServer: Notification;   // Websocket msg

    // Define Variables - define here if a global variable is used in html.
    canvasUser: CanvasUser = this.globalVariableService.canvasUser.getValue();
    frontendName: string = this.globalVariableService.frontendName.getValue();
    growlLife: number = this.globalVariableService.growlLife.getValue();
    growlSticky: boolean = this.globalVariableService.growlSticky.getValue();
    systemTitle: string = this.globalVariableService.systemTitle.getValue();
    testEnvironmentName: string = this.globalVariableService.testEnvironmentName.getValue();

    constructor(
        private canvasDate: CanvasDate,
        private cdal: CDAL,
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
        //   Send Notification To Server
        this.globalFunctionService.printToConsole(this.constructor.name,'sendNotificationToServer', '@Start');

        // Refresh the data
        this.eazlService.cacheCanvasData();

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

        // Fake login & preferences for testing - KEEP for next time - just set to FALSE
        this.setFakeVariablesForTesting = true;
 
        if (this.setFakeVariablesForTesting) {
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

        this.eazlService.getUsers()
            .then(usr => {
                usr.forEach(sglusr => {
                    this.availableUsers.push(sglusr.username)
                })
            })
            .catch(error => console.log (error) )

        // Count Nr of unread messages for me
        this.nrUnReadMessagesForMe = this.eazlService.getCanvasMessages(-1, -1, -1).filter(
            cm => (cm.messageSentToMe == true  &&  cm.messageMyStatus == 'UnRead')).length;

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

        // TODO - proper websocket message
        // Send the message
        if (event == 'Submit') {
            this.sendNotificationToServer();
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

    personalisation(){
        // Re-get the variables, ie logged in, etc.  Then create the array of menu items for PrimeNG
        this.globalFunctionService.printToConsole(this.constructor.name,'personalisation', '@Start');

        this.globalVariableService.growlGlobalMessage.next({
            severity: 'info', 
            summary:  'Future personalistaion', 
            detail:   'Can add: 1. startup options (dark dashboard, color, theme), 2. environment, 3. defaults for new widget,  4. default report filters'
        });

    }

    loadMenu(): MenuItem[] {
        // Re-get the variables, ie logged in, etc.  Then create the array of menu items for PrimeNG
        this.globalFunctionService.printToConsole(this.constructor.name,'loadMenu', '@Start');

        // Local variables
        let isLoggedIn: boolean = false;
        
        // Get the current status of user -> determines menu enable/disable
        this.isCurrentUserAdmin = this.globalVariableService.canvasUser.getValue().is_superuser;

        // Set label for login / logout
        if (this.globalVariableService.canvasUser.getValue().username == '' ) {
            this.loginLabel = 'Login'; 
            isLoggedIn = false;
        } else {
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
                        command: (event) => {
                            this.lastSelectedMenuItemLabel = event.item.label;
                            this.personalisation();
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
// this.eazlService.cacheCanvasData()
this.sendNotificationToServer()
console.log('this.eazlService.cdalUsers', this.eazlService.getUsersArray());
// console.log('users', this.cdal.users);

// this.usersCDAL = this.cdal.getUsers()
// console.log('After this.cdal.getUsers()', this.cdal.getUsers())
// console.log('After this.cdal.getUsers()', this.eazlService.cdalGetUsers() )
let eksit: boolean = false;
eksit = true;
if (eksit) {return}

console.log('COMBINELATEST')    
    /* Have staggering intervals */
var source11 = Observable.interval(100)
  .map(function (i) { return 'First: ' + i; });

var source12 = Observable.interval(150)
  .map(function (i) { return 'Second: ' + i; });

// Combine latest of source11 and source12 whenever either gives a value
var source1 = Observable.combineLatest(
    source11,
    source12
  ).take(4);

var subscription = source1.subscribe(
  function (x) {
    console.log('Next 1: %s', JSON.stringify(x));
  },
  function (err) {
    console.log('Error 1: %s', err);
  },
  function () {
    console.log('Completed 1');
  });

// => Next: ["First: 0","Second: 0"]
// => Next: ["First: 1","Second: 0"]
// => Next: ["First: 1","Second: 1"]
// => Next: ["First: 2","Second: 1"]
// => Completed


console.log('WITH-LATEST-FROM')
/* Have staggering intervals */
var source21 = Observable.interval(140)
    .map(function (i) { return 'First: ' + i; });

var source22 = Observable.interval(50)
    .map(function (i) { return 'Second: ' + i; });

// When source1 emits a value, combine it with the latest emission from source2.
var source2 = source21.withLatestFrom(
    source22,
    function (s1, s2) { return s1 + ', ' + s2; }
).take(4);

var subscription = source2.subscribe(
    function (x) {
        console.log('Next 2: ' + x.toString());
    },
    function (err) {
        console.log('Error 2: ' + err);
    },
    function () {
        console.log('Completed 2');
    });

// => Next: First: 0, Second: 1
// => Next: First: 1, Second: 4
// => Next: First: 2, Second: 7
// => Next: First: 3, Second: 10
// => Completed


/* With a result selector */
var range = Observable.range(0, 5);

var source3 = Observable.zip(
  range,
  function (s1) {
    return s1 + ':'  + ':'  ;
  }
);

var subscription = source3.subscribe(
  function (x) {
    console.log('Next 3: %s', x);
  },
  function (err) {
    console.log('Error 3: %s', err);
  },
  function () {
    console.log('Completed 3');
  });


/* With a result selector */
var range2 = Observable.range(0, 8);

var source4 = Observable.zip(
  range2,
  range2.skip(1),
  function (s1, s2) {
    return s1 + ':' + s2 + ':' ;
  }
);

var subscription = source4.subscribe(
  function (x) {
    console.log('Next 4: %s', x);
  },
  function (err) {
    console.log('Error 4: %s', err);
  },
  function () {
    console.log('Completed 4');
  });


var source51 = Observable.interval(100)
    .timeInterval()
    .pluck('interval');
var source52 = Observable.interval(150)
    .timeInterval()
    .pluck('interval');

var source = Observable.merge(
    source51,
    source52)
    .take(5);

var subscription = source.subscribe(
    function (x) {
        console.log('Next 5: ' + x);
    },
    function (err) {
        console.log('Error 5: ' + err);
    },
    function () {
        console.log('Completed 5');
    });

// => Next: 100
// => Next: 150
// => Next: 100
// => Next: 150
// => Next: 100
// => Completed

var AA: string[] = [];

var source6 = Observable
  .range(1, 3)
  .flatMap(function(x) {
    return Observable.from([x.toString() + 'a', x.toString() + 'b']);
  });

var subscription = source6.subscribe(
  function (x) {
    AA.push(x);
    console.log('Next 6: %s', x);
  },
  function (err) {
    console.log('Error 6: %s', err);
  },
  function () {
    console.log('Completed 6');
  });

// Next: 1a
// Next: 2a
// Next: 3a
// Next: 3b
// Completed

console.log('AA', AA)
}


}
