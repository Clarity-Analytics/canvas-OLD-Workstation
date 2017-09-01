# Reference Guide for Canvas

This guide aims to provide technical descriptions of the machinery and how to operate it.

## Table of Content

1. Overview
2. Installation
3. Login
4. Visualisation
* Dashboard Editor
* Widget Editor
5. Collaboration
* New messages
* View messages
6. Manage / Admin
* Users
* Groups
* Datasources
* Reports
* Dashboard Manager
* System Configuration
7. My Account
* Who am I
* Logout
* Profile
* Personalation
8. Help
* System info
* Feedback
* Tutorials
* Reference Guide
* Discussions
9. Design principles
10. Environments
11. Architecture
12. Backend
* Data diagram
* Eazl admin – Django console
* Overlay package and query structures
* Overlay task management



## 1. Overview

Our purpose is to create a workspace for knowledge workers to visualise any existing data sources in order to obtain information, understanding and insight, with easy collaboration.  Just like a canvas provides a painter with a workspace, our Canvas provides a knowledge worker with a working space.

Canvas is a web-based frontend which makes it easy to extract, manipulate and visualise data.  Here the user can create and manage workspaces, each called a Dashboard.  The Canvas Dashboard can be used in different ways, for example:
* A novice user can easily ran an existing Report with a single click.
* One can create a Dashboard with graphs to summarise monthly management information.
* A more experienced user can create new Reports.
* Users can collaborate with Messages and while sharing the same content.
* It is easy to extract and format data used by third party packages.

Data is visualised on the Dashboard by means of one or more Widgets.  Each Widget can contain text, tables, graphs or images.  Canvas provide tools to create and easily customise Widgets.  The data shown in the Widget is extracted from a Datasource.  Widget templates can be created to facilitate the creation of new Widgets.  In addition, a user can create very sophisticated graphical presentation using custom code.

A Datasource is any piece of data in computer readable format, with associated meta-data (description that tells us more about the format and content of the data).  The Data Sources can be structured (rows and columns) or unstructured data (i.e. documents).  Examples are company databases, text files, Excel spreadsheets, external databases, web sites and even streaming data.  Inherent to our solutions is the provision of new data sources, data cleansing and data hygiene.

A key feature of Canvas is collaboration, making it easy for users to discuss results and add comments.  Additional automation is included, for example all results can be scheduled and exported to other systems (like Excel). There is integration with other products, like Python Notebooks.  Other features include:
* Share dashboards with team members, mark your favourite dashboards
* Schedule the dashboards as email reports daily/weekly/monthly
* Export chart widgets as image or export the data in CSV format, ability to even obtain raw data for widget in CSV format
* Compare data for two date ranges, allows to visualise the comparative performance for two time periods
* Explore data allows to play with data and visualisations, very helpful for exploring the datasets without need to create widgets or dashboards
* Business Alerting allows ability to define rules on metrics that will trigger alert, very useful to keep check of drastic drop/increase in any metric
* Data extracts provides capability to get new dataset in the metric store by writing a SQL on top of granular data in the data warehouse
* Custom drill-downs, conditional formatting, derived metrics etc. are the customised features that helps more with data visualisations

Data Sources are provided by Eazl (which is the backend REST API in techno speack).  This loosely coupled architecture make it possible for other applications to connect to Eazl and extract data.  The solution provide admin functionality to manage users, groups, access and so on.  


## 2. Installation

Canvas is written in Angular and Typescript, and installation for a user is a single instruction:
// TODO - after build, finalise this whole section !!!

Create datasources, reports and users as described in the admin section of the document.  Assign access where required.  Create or import Dashboards via Canvas.

The above assumes that you are connected to an Eazl server.  The instructions to install a new server are provided towards the end of the document.


## 3. Login

On startup of Canvas a login form will be presented, requesting a username and password.  These must have been created before by the system administrator.  The password is case sensitive, and the user will remain logged in until he closes the tab in the browser.  When the tab is re-opened, he / she will have to log in again.

![alt text](file:///home/jannie/Projects/canvas/src/documentation/LoginPopupForm.png)

Once logged in successfully, the user will be presented with a single form containing a menu at the top.  The menu is adapted for access rights of the user, and inaccessable menu options are dimmed out.  This form will remain in focus, showing different parts of the system as the user clicks the menu options (in techno-speack, Canvas is a SPA or Single Page Application which enhances the user experience).

A menu with the following options is displayed at the top of the page:

![alt text](file:///home/jannie/Projects/canvas/src/documentation/MainMenu.png)



## 4. Visualisation

The Visualise menu option is used to display data; in fact, it is the only way for users to extract data and show (visualise) data.  Data shown can be a mixture of tabular data (tables) and graphs, customiseable by the user.  So, the term visualise includes ‘standard reports’.

The following submenu option is available:

![alt text](file:///home/jannie/Projects/canvas/src/documentation/VisualiseSubmenu.png)

Visualisation is done onto a blank space called a Dashboard.  Each Dashboard is a collection of existing Reports, completed as part of the preparation above.  A user can create any number of Dashboards.  A Report is placed onto the Dashboard as a Widget, which is simply the data from the selected Report as formatted by the user.  For example, lets say we have a Report that provides the sales volumes per region and per month.  Any number of Widgets can now be created using this Report, for example: Widget A can be a pie chart per region, Widget B can be a bar chart of the total sales volumes per month, Widget C can be a table with the detail data, etc.

As mentioned, data is visualised using Widgets.  Each Widget reads it data from a Report; rows and columns extracted from a Datasource (like a database table).  For now it is assumed that the reports already exist (see the Admin -> Reports section on how to create or amend these).

Hover the cursor over the Visualise menu optio, and select Dashboard editor.  For a new user, a clean (blank) Dashboard is presented.  A Dashboard is a workspace, and contains one or more tabs.  This is similar to an Excel workbook with multiple tabs or worksheets.  A palette is shown in the top left corner, and provide tools to manage your Dashboard.  It contains two portions:
* Dashboard Editor to create new Dashboard, select an existing Dashboard and an advanced filter on Dashboards to show in the dropdown.
* Widget tools to manage individual Widgets.

![Dashboard Palette](file:///home/jannie/Projects/canvas/src/documentation/DashboardPalette.png)


To select an existing Dashboard, select one from the dropdown (*Dashboard to open*).  In case too many options are presented, one can filter it down using the advanced editor (*filter button next to Actions*).  The number in the heading indicats how many of the total number of Dashboards are shown in the dropdown after using the filter; for example 1/6 shows that only one of a total of 6 dashboards are shown in the dropdown.  

The Advanced Filter popup:

//TODO - fix and add

Note that the icons have tooltips, which will be shown when the cursor hovers over it.  To create a new Dashboard, click on the + sign in the Dashboard Editor to create a new Dashboard.  Canvas will assign a name to it (*'Untitled - 1' for the first one*).  In order to rename the Dashboard or change more properties (like who has access to it), please use the *Admin -> Dashboards* menu option.  To add a new Widget, drag the top left icon in the Widget tools area onto the open space of the Dashboard.

A Dashboard can have one or more tabs, and it is important to know since the required information may be on another tab in the Dashboard.  It the selected Dashboard only has one tab, this tab will be shown automatically.  In case the Dashboard has more than one tab, one has to select the desire tab from the tabs dropdown.  More actions on tabs are shown just below the tab dropdown:
- edit a dashboard, where a name or description can be amended.
- add a tab, with a name.
- delete a tab.  Note that all Widgets on a tab must be deleted before the whole tab can be deleted.

The Add or Edit buttons open a form:
   ![Dashboard Palette](file:///home/jannie/Projects/canvas/src/documentation/DashboardTabEditor.png)


Now, lets go about the practical job of creating Widgets.  The first step is to identify the source of the data: 
- define a Data Source using the Manage menu option tells the system where the data lives, and how how different data portions are related.  
- then describe how to extract the data: define a Report using the Manage menu option will describe how the data must be manipulated and aggregated (i.e. sum the SalesVolume).
- last, show the data by creating a Widget on the above report.  For now, we will assume that the Report already exists.

The Widget has the following areas:
- Container, which is the box around the Widget.  This container has properties like position, background color and so on.
- Header, which is used to manipulate the Widget.  

The header of each Widget has the following icons:
- drag handle.  To move a Widget, select it and then move it around using this handle.
- Widget Editor button.  Click this button to open the Widget Editor.
- Delete button.  When clicked, a confirmation message with prompt before permanently deleting the Widget.
- Like button.  Users can mark invidual Widgets as liked, indicating to other users what they find useful.
- Lock button.  A Widget can be locked for editing.  The lock is a temporary feature that could be useful during the Dashboard creation process, and indicates that a Widget has been fully completed.
- short title.  This is useful to show the information shown in each Widget.
- selected checkbox.  This is only active when a Widget has been selected, by clicking on it. 
- Comments button.  Users can leave comments on individual Widgets.  Click this button to show the message trail.

Widgets are manipulated with the Widgets tools, on the left of the screen:

   ![Dashboard Palette](file:///home/jannie/Projects/canvas/src/documentation/DashboardWidgetTools.png)

 The following actions are available in the Widget tools area:
- Add a new Widget to the Dashboard by dragging the icon onto the open canvas
- Left align selected Widgets.  Alignments is only applicable to multiple selected Widgets.  The selection of a Widget is indicated with a check in the right hand top corner.
- Center align selected Widgets
- Right align selected Widgets.
- Set equal horisontal distances between (3 or more) selected Widgets.
- Increase the horison distance between selected Widgets.
- Descrease the horison distance between selected Widgets.
- Align the top of selected Widget containers.
- Align the middle of selected Widgets.
- Align the bottom of selected Widgets.
- Set an equal vertical distance between (3 or more) selected Widgets.
- Increase the vertical distance between selected Widgets.
- Decrease the vertical distance between selected Widgets.
- Set the same width for the selected Widgets.
- Increase the width for the selected Widgets.
- Decrease the width for the selected Widgets.
- Set the same height for the selected Widgets.
- Increase the height for the selected Widgets.
- Decrease the height for the selected Widgets.
- Select all the Widgets on the current Tab of the Dashboard
- Toggle the Widget header between dark and light.  Remember to select one or more Widgets before using this tool.
- Copy the selected Widget(s).
- Bring the selected Widget(s) to the front (on the z-index), which is useful if Widgets are placed partially on top of one another.
- Expand the Dashboard settings area, like Background selection where the background color of the Dashboard tab, and / or the background image can be set.  If both are set, the image will take preferrence.  This setting, is remembered for future Dashboard Tabs.
- The snap-to-grid option can be toggled with this tool.  There is an invisible grid at the base of the Dashboard that can be used for alignment.  When the snap-to-grid option is set to on, all Widgets will snap to the closest grid point when manipulated.  
- The toggle headers on or off tool will show all the Widget headers, or hide them.  It may be useful to show headers during the design process, where Widgets can be dragged, editted, deleted, etc. while these headers dont any value when viewing.  
- The Widget Background tool allows the background color of the individual Widget to be modified.  Tranparent is a valid color selection, thus allowing one to 'see through' a Widget.
- The Widget border tool allows the user to set the border of the Widget container.  Valid options include None, thin black line and so on.
- The Widget box shadow tool can be used to give the Widget container an optional shadow.
- The Widget text color tool can be used to change the color of the text in the container.
- The Font Size tool changes the font size.
- The Grid Size tool allows to change the size of the grid.  This is measured in px, a technical measurement (16px is a normal line height).  A good choice is 3.  Note that if the grid size is very big, say 30px, Widgets cannot be placed closer than 30 px of each other (as they will snap to the closest grid point when created or moved).

The Widget container can have any of the following areas:
- text
- image
- graph
- table

Here are two examples of Widgets, showing different combinations of areas, borders and headers:

   ![Dashboard Palette](file:///home/jannie/Projects/canvas/src/documentation/WidgetNoBorders.png)

   ![Dashboard Palette](file:///home/jannie/Projects/canvas/src/documentation/WidgetWithBordersHeader.png)

The header has the following:
- drag handle. Note, widgets can only be dragged if selected. 
- Widget Editor: when clicking this button, the Widget Editor will be shown (discussed below in detail).
- Delete: a confirmation message will pop up, as per all deletes.  Note that only a person with the required permissions to the Dashboard can delete a Widget.
- Liked: clicking this button toggles whether a user likes a Widget or not.
- Locked: a locked Widget cannot be editted.  This feature is useful during design to indicate which Widgets have been finalised.
- Title: this is short text to indicate the content of the Widget.
- Comments: optional comments per Widget that users can add.  It is darker when the Widget has already got comments.
- Selected (shows a check).  Multiple Widgets can be selected by holding in the Shift key and clicking on them.  If the Shift key is not held down, only the last Widget clicked stays selected.

A Widget can be editted with the Widget Editor (the button to open it is in the Widget header):

   ![Dashboard Palette](file:///home/jannie/Projects/canvas/src/documentation/WidgetEditor.png)

Canvas use messages for collaboration and to describe.  See *Collaboration* for more detail.  Messages can optionally refer to a specific Dashboard or Widget.  A comment on a Widget is just a message that refers to a specific Widget.  When clicking the Widget comments button in the heading, the following information pops up:


   ![Dashboard Palette](file:///home/jannie/Projects/canvas/src/documentation/WidgetComments.png)


The Widget Editor shows the left top fo the form, and is a modal form (while open, one cannot work on other forms).  It has the following areas (which are closed by default):
- Content, which is used to indicate the 1 - 4 areas that a Widget must contain.
- Idenfication, which give information to identify the Widget.
- Behaviour, an optional area to specify how the Widget should behave.
- Text (optional)
- Image (optional)
- Graph (optional)
- Table (optional)

To open an area, click on the drop-down caret on the right hand side.  The Identification are contains the following info:
- Dashboard on which the Widget lives.
- Dashboard Tab where the Widget is placed.  If a Widget has to be shown on where than one tab, it has to be copied.
- Title, which is shown in the container.  It is thus important to be brief and concise.
- Code, an abbreviation of the Name.
- Name, which is descriptive and complete.
- Description, with detail.

The Behaviour are contains the following info:
- Export F-Type is the default file type when a Widget is exported.
- Hyper-TabNr: a Widget can be hyper linked to another Tab.  This is useful for dril down: show a summary Widget, which has a whole tab of detail information should one wants to explore further.
- Hyper-Widget, when a Widget is linked to a single Widget.
- Refresh Mode incidates the frequency when a Widget has to be refreshed.  Manual would indicate that the Widget information will only be refreshed when the user so requests.  This makes sense for static, historical information.  OnOpen would mean the information is refreshed each time the Dashboard is opened.  This is useful for daily statistics, where one always wants to see the latest info.  Take caution that the underlying set is small, as it may delay the opening of the Dashboard significantly if very large.  In future the Widget can be refreshed real-time.
- Refresh Frequency, the interval between refreshes if the frequency is set to real-time.
- Password is an optional feature to protect information.  Passwords can only be added and deleted by Owners.  Users with the appropriate access rights may see the underlying information if they know the password.
- Nr Liked is the number of users that likes this Widget.  This is a good indication of how useful the information in the Widget is.

The Data contains the following info:
- ReportName.  The data used in a Widget is provided by a predefined Report.  See Admin -> Reports for more detail.
- Rpt Params: optional report parameters.
- Limit Rows is a limit on the number of data rows to ue in the extraction of the Widget.  This is a good saveguard to prevent an accidental extraction of a million rows into a pie chart.
- Rest Row: is a useful feature to show proportion when selecting a limited dataset.  For example, show the value traded by the top 5 brokers in a pie chart.  While this is good to know in itself, it does not say what percentage the top 5 makes of the total value traded.  Check Add Rest to add a new row to the data (it will thus return 6 rows) that shows the total for the rest of the brokers.

The Text contains the following info:
- Text is the text to show in the container.  This text can include HTML tags, if the user is familiar with it.  For example, to make the word August show in bold, one can add the following text: <bold>August</bold>
- Background indicates the background color of the text area (not the whole container).
- Text Border is the border around the text area.
- Text Color is the color of the text.  Chose this in conjunction with the background color, since certain colors dont form a sufficient contrast to be readable.
- Font Size is the size of the font.
- Font Weight is the weigt of the text, for example bold.
- Text Height is the height of the text area (in px)
- Text Left is the leftmost position of the text area, relative to the container.  0 is the leftmost position.
- Text Margin is the margin (HTML style) between the text and the container.  It is best to be conservative with this option.
- Text Padding  is the space (HTML style) between the text and the text border.  It is best to be conservative with this option.
- Text Position is relative or absolute, and works together with the left and top.
- Text Align is how the text is aligned (left, center, right) in the text area.
- Text Top is the position of the top area in px.
- Text Width is the width of the text area in px.

The Graph contains the following info:
- Widget Type indicates the type of graph, i.e. Bar Chart.
- Height is the Height of the Graph area.
- Width is the Width of the Graph area.
- Padding is the area around the actual graph and the graph area.
- X Axis is the field (from the data provided by the Report selected above) shown on the x axis.
- Y Axis is the field shown on the y axis.
- Fill Color is the color with which the graph (i.e. bars in the barchar) must be filled.
- Hover Color is the color when hovering over an item, i.e. an individual bar.

The Table contains the following info:
- HideHeader is a toggle to show the headers (top row) of the table.
- Text Color is the color of the text in the table.
- Nr Cols is the optional number of columns to show from the data.  When this is larger than the total number of columns in the data, all the columns will be shown.
- Nr Rows is the optional number of rows to show from the data.  It is thus important that the data is sorted correctly in the Report if this option is used.
- Height is the height of the table area.
- Width is the width of the table area.
- Left is the left of the table in px inside the container.
- Top is the top of the table area in px.

The Image contains the following info:
- Alt is the alternative text shown when the image is not available.
- Height is the height of the image.
- Left is the left of the image, in px inside the container.
- Source is the source of the image (file name).
- Top is the top of the image area in px.
- Width is the width of the image area in px.



## 5. Collaboration

A key objective of the system is to make collaboration between users easier.  In addition to emailing of output, the following are available:
- Widgets can be liked.  This is an indication of its popularity / usefulness.
- The natural display order of Reports and Dashboards are per number of times used.
- Report suggestions: it will show the top n Reports used by other users that belong to the same groups as a user, and not yet run by this user.
- Widgets allows for comments (messages) by users.

The Collaboration menu option has two sub options:

![alt text](file:///home/jannie/Projects/canvas/src/documentation/CollaborateSubmenu.png)


The New Messages allows the user to enter the following information:
- Subject
- Body
- Recipients in the form of a picklist (the left hand column shows all available users while the right hand column shows recipients already selected).  At least one recipient is required.

The form shows the number of unread message at the top:

![alt text](file:///home/jannie/Projects/canvas/src/documentation/NewMeesageForm.png)


The *Show Messages* sub-menu option shows a grid:

![alt text](file:///home/jannie/Projects/canvas/src/documentation/MessagesTable.png)

Right clicking on a message provides the following popup menu:

![alt text](file:///home/jannie/Projects/canvas/src/documentation/MessagesPopupMenu.png)

The *Read/UnRead* option simply marks the message accordingly.  As mentioned, messages can be linked to a specific Dashboard.  The *Go Dashboard* option opens up a Dashboard if one has been linked.  The *Reply* option opens up the following popup form:

![alt text](file:///home/jannie/Projects/canvas/src/documentation/MessageReply.png)

It shows the detail for the Previous message, which is being replied to.  The detail in the Reply portion is the same as that for a new message.

Each message has a Conversation ID that can group them together.  Each new message gets a new conversation ID, while each Reply keeps the same converstation ID.   Messages in the same conversation can thus be shown together.

Messages can be sent to one or more users, and / or to one or more groups: note that each user will only get one message even if a member of multiple groups.  A user can only share Dashboards to which he has access, and to recipients with whom this Dashboard has been shared.  If a user is online in the system, his name will be shown in green (and not black).  When hovering on a user, the last datetime logged into the system will be shown as a tooltippie text.  For now, it will not read Outlook to determine Out of office notification status.  Messages do not have any priority (i.e. urgent).
    

An alert will be shown (Growl at the top right of the form) when a new message has arrived.  New messages can result from: 
- A previously requested (async) Report has completed and the Result set is ready.  This is an example of a system generated message.
- A Message from another user has arrived.
- Alerts (system generated messages, i.e. an error occurred).

Messages are non-intrusive; the user can send and receive Messages while leaving the forms on their work space intact.



## 6. Manage / Admin

Administrative tasks are performed using this menu.  It has the following sub-menu options:

![alt text](file:///home/jannie/Projects/canvas/src/documentation/ManageSubmenu.png)


Access is assigned per group and / or per user.  No access is not given by default, and must be explicitly assigned.  The only exception is Admin who has rights to all entities.  

Access to data is controlled by granting rights to Data Sources.  All the Reports based on a this Data Source inherits its access; and similarly the Widgets based on the Report.  A Dashboard can have one or more Data Sources.  When a Dashboard is shared, the recipient may will only see those Widgets where he has access to.  Access assignments are inclusive: if a user has no access to a Report, but belongs to a group that does have access, the user will have access to the Report.  There are no exclusion rights (once included via a group, the user stays included).

// TODO - where does superuser fit in?
Admin rights are not granted to individual users; users get admin rights when they belong to the Admin group.  

Admin has access to all users, groups, Reports and Dashboards.  Once part of the Admin group, specific access cannot be excluded (its all of nothing).  Admin can reset a user password, but the user will be notified and has to change his password at the next logon.  Admin can also change the system configuration: for example the location of the backend server.  It goes without saying that Admin rights should be used sparingly.

Users, Groups, Reports, Access, etc. exist per environment.  This way one can introduce a new Report into test without the production environment knowing about it.

* Users

![alt text](file:///home/jannie/Projects/canvas/src/documentation/UsersTable.png)


A data table of users will be display, with the following columns:
- Username is the unique username in the system.  In some companies this is called the UserID.  It can contain text and numbers.
- First Name of the user
- Nickname: optional.
- Photo Path: optional.
- Last logged in: date-time when the user last logged in.
- Last Report: last report ran by the user.
- Email: work email address of the user.
- Cell: optional cell number of the user.
- Work tel: work telephone number, or extension of the user.
- Active from: date from when the user has been made active, which can be in the future and can only be done by a user with admin rights.
- Inactive date: date when the user was made inactive, and can only be done by a user with admin rights.
- Date Created: date the user record was created, which may be different from the Active from date.
- Username Last Updated: who last updated this record.
- Is staff: true if the user is a staff member, thus allowing for guest logins.
- Is Superuser: true if this use has superuser or admin powers, thus being able to create and delete any user or group.

The following context menu is available by right-clicking on a record:


![alt text](file:///home/jannie/Projects/canvas/src/documentation/UsersPopupMenu.png)

- Add (a new user)
- Edit (if the user has the appropriate rights)
- Delete:  A user can only be deleted if he/she has never used the system; for example was added in error.  In this case the record is physically deleted.  Once a user has start using the system, the record cannot be deleted – it can only be made inactive by setting the InactiveDate field.  An inactive user (and its memberships) can be re-activated again.  Deleting or inactivating a user requires the appropriate access rights.  Like all Delete actions, a Are you sure - Yes/No confirmation will popup.
- Group Membership: groups to which the user belongs.  A popup form with a picklist is shown.  A user can belong to zero or many groups.  Groups live in a flat structure, with no hierarchy.  So, groups cannot belong to groups.  Groups and how they are created is described in the next section.  Once a group or membership has been editted, the affected users will be send a message.
- Related Datasources shows the Datasources to which this user has access.

![alt text](file:///home/jannie/Projects/canvas/src/documentation/UsersRelatedDatasources.png)

- Related Dashboards shows all the Dashboards that this user owns or has access to.

![alt text](file:///home/jannie/Projects/canvas/src/documentation/UserRelatedPermissionsPopupForm.png)

- Message History: all messages where this user was the Sender or one of the recipients.
- Report History: reports previously ran by this user.  History of previous activity is not on a separate form, but build into each entity.  This provides a readonly history of all Reports previously requested by the user.  Each Report already processed has a status of Completed Successfully or Failed, with additional information like StartDateTime, CompletionDateTime, ErrorMessage, etc.  When a Report has been submitted, but not yet completed is has a status of Pending.  In case it has been scheduled to only start at a later time, the ScheduledDateTime will be displayed.  Each record in the history has a Requestor, which is the UserName of the user who requested the Report, or scheduled it.
- Rest password: a popup form will be displayed where the password can be changed.  A person with Admin rights can change the password of any other user.  


![alt text](file:///home/jannie/Projects/canvas/src/documentation/UserResetPasswordPopupForm.png)

Adding a new user or editting an existing user uses the same form.  It has two tabs with information:

![alt text](file:///home/jannie/Projects/canvas/src/documentation/UserMaintenanceIdForm.png)

![alt text](file:///home/jannie/Projects/canvas/src/documentation/UserMaintenanceActForm.png)

* Groups

As noted before, groups have a flat structure: users can belong to zero or more groups, but groups cannot belong to other groups.  Also remember that the access is inclusive: if a user belongs to two different groups, he has the full rights of both groups.  The group structure is flat, while most companies have a hierarchy of groups or departments.  Given the complexity and amount of admin involved, we will not try to mimic the company structure using groups.  We assume that the company structure is available for HR reporting, and up to date.  It is the user’s decision how to link groups to the hierarchy, if at all.  
Canvas has no functionality to import or sync to the company hierarchy.  Groups and group member ship can be exported to Excel as per usual, where it can be compared if necessary.
It also does not cater for restructuring (where for example all users from Group A and Group B are merged into Group C).

![alt text](file:///home/jannie/Projects/canvas/src/documentation/GroupsTable.png)

The table for groups has the following columsn:
- ID (unique)
- Name, for example HR, Sales, etc.
- Description: detailed description.

The following context menu will be displayed when one right-clicks on a group record:

![alt text](file:///home/jannie/Projects/canvas/src/documentation/GroupsPopupMenu.png)


- Add
- Edit
- Delete
- Users in Group: shows a picklist of users that belongs to a group.


![alt text](file:///home/jannie/Projects/canvas/src/documentation/GroupsUserMembershipPopupForm.png)

- Related Datasources to which the group has access.

![alt text](file:///home/jannie/Projects/canvas/src/documentation/GroupsRelatedDatasourcesPopupForm.png)

Adding a new group or editting an existing group uses the same form:

![alt text](file:///home/jannie/Projects/canvas/src/documentation/GroupMaintenancePopupForm.png)

// TODO - fix this in code
The following groups are permanent and not deleteable:
Admin – can be used to easily manage admin access.  By default, no one belongs to the Admin group.
Everyone – simplified access to innocent Reports. On creation, a user belongs by default to this group.  This membership can be deleted.  Only the owner has access to a new Report, other users or Everyone has to be explicitly added.

// TODO - refine
Each group has an owner, which is the creator.  This owner and Admin are the only ones that can add / delete other users as owners.  These owners manage group membership.
Each group can be marked a public (visible by all users) or private (only visible to owners and members).  The latter is a similar feature to groups on WhatsApp, and equates to a personal distribution list.  All lists can be edited and deleted by an Admin person.  Once a group or membership has been editted, the affected users will be send a message.
Currently Canvas does not access Active Directory (users or groups) and does not authenticate against it.

* Datasources

![alt text](file:///home/jannie/Projects/canvas/src/documentation/DatasourcesTable.png)

A Data Source (called a base package in the backend) is a large block of data from which Reports are constructed.  In techno speak: they are SQL packages that collect data from one or more databases or other sources, and collate it in a rectangular block of data.  The Datasource thus defines the universe of information to work with.  A report is an extraction from a Datasource.  For example, in the case of a list of codes, the Datasource will be used as is in the Reports (select all records), while it will be too large in some cases (and the Report will have to filter down the data to selected columns and rows, say to a particular month). 

The Datasource is the basic building block for overlay, which is a backend component.  Each Data Source is versioned, keeping all associated data for each version.  When a Data Source changes, it will recompile all Reports (queries) based on it and mark the bad / dirty ones (which cannot be run).

When the Datasource sub-menu option is chosen, a grid is shown with the following fields:
 - ID
 - Name
 - Description

The following context menu is shown by right-clicking on a Datasource in the grid:

![alt text](file:///home/jannie/Projects/canvas/src/documentation/DatasourcesPopupMenu.png)

- Shared Users: shows a popup form to add or remove users that has access to this Datasource.

![alt text](file:///home/jannie/Projects/canvas/src/documentation/DatasourcePermissionsPopupForm.png)

The Owned permission indicates that this person is an owner, who has all rights.  The Assign permission allows a user to assign / give permissions to other users. 
// TODO get correct defs from Bradley
- Group Membership shows a popup form to add or remove groups that has access to this Datasource.

![alt text](file:///home/jannie/Projects/canvas/src/documentation/DatasourceGroupPermissionsPopupForm.png)

- Related Reports shows a table of all the reports that are based on the selected Datasource.
![alt text](file:///home/jannie/Projects/canvas/src/documentation/DatasourceRelatedReports.png)

// TODO - sort out how the parameters will work
Each Data Source has a maximum one set of parameters, it is however optional.
The parameters are embedded filters that are required to make the SQL work.  It also serves to limit the amount of data returned.

// TODO - add ReportBuilder stuffies here once done
The SQL for a Data Source is created outside of Canvas.  Data Source may require parameters and default values for some fields; indicating which are changeable by users.  Examples will be a date range for very large amounts of data.  Some values will be set conservatively to ensure that a Report does not return 1bn rows if the user does not enter a value.
The system stores a list of all fields.  This can be supplemented, for example: field description (allowing to build a data dictionary if this is not available in the underlying database), quality of the data, and so on.

The Data Source is supplied by the backend (Eazl REST API with data provided by the overlay module).  In future, overlay will have a generic feature to read from the following (constructed by us, or simply available in Canvas by the use of basic parameters like file name and file format, or table and field names):
Database (provide connection string and SQL / table and field names and JOINs).  
File (we provide location and format).
Web url & say table name.   

* Reports
![alt text](file:///home/jannie/Projects/canvas/src/documentation/ReportsTable.png)

As mentioned before, Datasources are defined in the backend and represents a (potentially) large block of data with rows and columns.  A report is an extraction from that data.  It may contain all or some rows and columns.  It may also manipulate the data.  For example, the Datasource can be a list of all trades in a given year.  One report can be the value traded by month, resulting in 12 records with 2 columns.  One or more reports can be created on each Datasource.

The Reports sub-menu option will show a table with the following columns:
- ID is the unique database ID.
- Code is a short code.
- Name is a brief, descriptive name.
- Description is a detailed description of the report.  This should include guidance on how other users should use it, exceptions and so on.
- Parameters is an optional field, that is a set of parameters required for this report.
- DS ID is the ID of the Datasource on which the report is based.
- DS Parameters is an optional field, that is a set of parameters required for this datasource.
- Fields

![alt text](file:///home/jannie/Projects/canvas/src/documentation/ReportsPopupMenu.png)

The following context menu will be shown when right-clicking on a Report:
- Shared Users shows a table with all users that have access to the selected Report.

![alt text](file:///home/jannie/Projects/canvas/src/documentation/ReportUserPermissionsPopupForm.png)

- Shared Group shows a table with all groups that have access to the selected Report.

![alt text](file:///home/jannie/Projects/canvas/src/documentation/ReportGroupPermissionsPopupForm.png)

- Report history, including who ran it when as well as the status (for example completed or still pending ones.

![alt text](file:///home/jannie/Projects/canvas/src/documentation/ReportHistory.png)

- Create Widget: this is a shortcut to quickly and easily build a Widget on the selected Report.  The user has to provide the Dashboard and Tab where the report has to live, the type of graph (i.e. BarChart), and the fields to show on the X axix and Y axis (where appropriate).

![alt text](file:///home/jannie/Projects/canvas/src/documentation/ReportCreateWidgetPopupForm.png)

- Report Builder // TODO
A Report is defined as a rectangular block of data selected from a Data Source.  It is created by means of the following steps, some of which are optional:
Select a Data Source (which is a pre-created large block of data, and includes database location(s), database type, defined relationships / business rules between different data sets and optional parameters).  This equates to a base package in Eazl.

// TODO - design & code the following paragraphs
If the Data Source contains a parameter set, a default one must be creatd for the Report.  It will open up with the same values as that of the Data Source parameter set.  Multiple parameter sets can be defined per Data Source; each one will be uniquely identified and useable as the input to a Widget on a Dashboard. 

Select fields (columns) and rows to show, using filters.
Group and aggregate (optional).  Note that once grouping is applied, the selected fields to show can only be grouped and aggregated fields, not detail fields.  Also, if aggregated in the Report, the Widget can only use the aggregated fields in the display and cannot drill down to the detail data.  This type of aggregation is done in the backend (using SQL against the database) and useful to reduce very large datasets.
 Sort ASC or DESC on any number of fields (optional).
 Limit the number of rows returned (optional).  This is most useful when used in conjuction with sorting (otherwise the user has no control over which records are returned).
Reports can be created by:
The Canvas frontend.
The Import / Export facility for Reports, which will allow someone else to create a Report for a user and let him import it, or to load Reports from the test environment into the production environment.  On importing a new Report from test, the access rights are not imported as well; access in production has to be created and maintained by Admin.
Similarly, access rights to Data Sources (and thus its Reports) cannot be promoted from test to prod.

Access are not explicitly granted to Reports; they inherit the access of the Data Source that they are based on.  Security access is not content sensitive; so it cannot be restricted to a specific department or number of user IDs.  From experience this get really complicated and only needed in specific cases.

If the underlying Data Source requires parameters, the Report must have at least one default parameter set.  At start, the values are set to the parameter set from the Data Source.  Note that certain parameters may not be editable by the user, and will be included in the Report as it is essential for it to run.

// TODO - Schedules (future dated ones).  

The above exists per environment.  In fact, all the entities (users, groups, Reports, etc) exists per environment.  This way one can introduce a new Report into test without the production environment knowing about it.  Once a Report has been created, the structure can be Exported to a text (JSON format) file.  Reports can be Imported from these files.  If the imported Report does not exist, a new one will be created.  The user performing the action will become the owner of the Report.  If the Report already exists, the result will be the same as a edit action: a new version will be created.  In both cases, the necessary validation will be performed.  If validation fails, the Report will be marked as diry (not runable).  Admin may change the owner of a Report.

The extraction of the data only happens when the user displays the associated Widget on a Dashboard (or a Dashboard is scheduled).  It is triggered by the frontend asynchronisly, which means that the frontend can continue with other tasks while the data is being extracted.  The backend will extract the data, store the results as a Result set (in a backend database) and then notify the user via a Message.  When the user clicks the Show Dashboard button on the Message, the related Dashboard and Widget will be shown.  The Widget was formatted at creation.  So, at this point in time the frontend only pours in the data and presents it to the user.

Reports are versioned, and each change (or import) increments the version by one.  The history is kept per version, and so are the future dated schedules.  On editing, the system will validate the Report to ensure the parameters and fields are a subset of its Data Source parameters and fields, and that the Widgets and schedules based on this Report are still valid (uses the same fields, filters, etc).  Reports can only use the latest version of a Data Source.  Widgets do not have versions, and always use the latest version of a Report.
In reverse, the Eazl backend will validate all Reports whenever a Data Source is changed.

For now, all results are stored as a Result set in a Postgress database.  This brings about storage size and performance considerations.  These Result sets are kept for a default period, after which they are deleted.  This period is editable, and can be increased by an Admin person.  Access to Result sets are the same as that of the Report which created it.

Each result set has additional information:
Event – who ran it when, what version, etc.
Meta-data – filters and fields used, data types, number of records, run-time, base package used, etc.

// TODO - Report bundles

// TODO - System Reports
After installation, the system contains a number of Reports out of the box.  They are normal Reports, but access to amend them has only been granted to Admin:

List of users (includes number of Data Sources owned, number of Reports owned, number of Dashboards owned, number of Dashboards shared with this user, number of Data Sources to which user has read access, number of groups that his user own, number of groups that this user belongs to).

List of Reports (including owner, number of filters, number of parameter fields, number of fields, number of Dashboards in which Report is used, owner, number of Widgets that use this Report, number of times Report has been run, number of active schedules on this Report, number of Result sets that currently exists for this Report).

List of groups (includes number of Data Sources to which group has rights, number of users, owner, number of Dashboards shared to this group).

List of Dashboards (number of Data Sources used, number of Reports used, owner, number of tabs and Widgets on this Dashboard, number of users shared with, number of groups shared with).

Users per Group (can filter on 1 or more groups, duplicating group name).
Groups per user (can be filtered on one or more users, duplicating the UserName).

List of users with rights to a Data Source (user, rights, Data Source, direct or via group, duplicating the Data Source).
List of groups with rights to a Data Source (group, rights, Data Source, duplicating the Data Source).

List of users with access to a Report (inherited from Data Source, direct or via group, duplicating the Report).

List of Data Sources (including repo, number of parameters, number of fields in the Data Source, number of fields used in at least one Report, number of Reports using it, number of Widgets using it, number of Dashboards using it, owner, number of users with rights, number of groups with rights).

List of groups with access to a Report (inherited from Data Source, duplicating the Report).

List of Report bundles (number of Reports inside the bundle, number of Data Sources used).

List of Reports per bundle (can be filtered on one or more bundles, duplicating the Report).

Filters per Report, duplicating the Report.

Fields per Report, duplicating the Report.

Parameters per Report, duplicating the Report.

Data Sources per Dashboard (can be filtered on one or more Dashboards, duplicating the Dashboard).

List of fields per Data Source (can be filtered on field or Data Source, includes number of Reports that it is used in, duplicating the Data Source.

List of fields per Dashboard (can be filtered on one or more Dashboards – includes Data Source of each field, duplicating the Dashboard).

List of Widgets per Dashboard (with Report and Data Source, duplicating the Dashboard).

Filters per Widget, duplicating the Widget.

Fields per Widget, duplicating the Widget.

Parameters per Widget, duplicating the Widget.

Report detail (all detail for one Report).

Dashboard detail (all detail for one Dashboard).

Widget detail (all properties for one Widget).

Current Result sets (can filter on Report and parameters).


* Dashboards

This shows a list of all available Dashboards in a single table with the following columns:
- ID (unique database ID)
- Name, brief and descriptive
- Dark Headers? When true, the headers for the Widgets on the Dashboard will default to dark.
- Show Headers? When true, the headers for all its Widgets will show its headers.
- BG Color: background color of the Dashboard.
- Bg Image: background image or picture.  If selectd, it will take preferrence over the background color.
- Comment: optional comment on the Dashboard.
- Export FType: file type when exported.
- Description: detailed description
- Nr Groups
- Locked
- Liked?
- Open Tab Nr
- Owner
- Password
- Refresh Mode
- Refresh Frequency
- #Users Shared: number of users with whom the selected Dashboard is shared.
- #Groups Shared: number of groups with which the selected Dashboard is shared.
- System message: optional message generated by the system.
- Refreshed by: when the Dashboard was last refreshed.
- Refreshed on
- Updated on: when information on the Dashboard was last updated. 
- Updated by
- Created on: when the Dashboard record was created. 
- Created by

The following context menu is displayed when right-clicking on a Dashboard record in the grid:
- Add
- Edit
- Delete
- Group Membership: groups with which the Dashboard is shared.
- Shared Users: users with whom the Dashboard is shared.
- Related Datasources: all the Datasources used in the creation of the selected Dashboard.
- Message History: shows a table with all messages linked to a Dashboard.
- Related Reports: all the reports used in the selected Dashboard.  Recall that a Dashboard is a collection of Widgets, and each Widget is based on a Report.
- Like: toggle whether a user likes a Dashboard.
- Lock: toggle to lock a Dashboard, in which case no Widget on it can be editted.

// TODO - update this section after permissions
Dashboard Shared with (list of users; either ReadOnly, Full).  ReadOnly access means that the user can only view the data tabs, while Full access means that the user also has access to the Manage Tab (and can thus modify the Dashboard).  In case the recipient does not have access to the Data Source of a particular Widget, it will simply show ‘No Access to underlying Data Source’.  The sender can add a password to a Widget.  The recipient will be able to see the data with the correct password, irrespective of access rights.  This password has to be entered each time to view this Widget.

// TODO - finalise how to do this
Dashboard Mode: Tab mode will show the Dashboard with diferent tabs (allowing for modification), while View mode will show the Dashboard as a slideshow (and no option to modify).  The slidehow is a view-only presentation of all the Widgets on all the tabs onto one big canvas.  By default, the tabs will be organised below each other, with the maximum number of columns are per the user default.  This user has freedom to arrange the Widgets dynamically with the mouse.  The user has the following buttons for the slideshow: Print, Show Comments or Show as full screen (allowing for the Dashboard to be used in a presentation).

* System Configuration
The system configuration includes all the necessary options and actions to make the system work.  It is typically done once off, and not changed unless something in the environment changes (i.e. servers renamed).  The following information can be editted:
- Company Name
- Company Logo
- Backend url: this is the IP address of Eazl.
- Days to Keep: this is the default period to keep Result sets, after which it will automatically be deleted.  The default value at installation is 1 day.
- Max RowsData is the maximum allowed size for Result sets.  When a new Report is added and the total storage is above this max size, result sets will be deleted accordingly (could be all of them, except the last one).
- Max RowsGraph is the maximum number of rows that will be returned for all graphs.  While this is intended as a safeguard against huge datasets in graphs, it can cause irretation if set too small.

A word about Environments:
Duplicate Environments: all or some entities (users, groups, etc) can be copied from an existing environment.  This import ask for advice when the same entity already exists in the destination system (ignore/ replace for one/all).
Edit the enviroment (production or a test environment) with all parameters.  All the data for environments is stored in the Eazl backend (REST API), including the data it contains, the database locations, database connection strings, etc.  Only Admin users can change the environment.
A database itself is neither production nor test; it always belongs to one or more environments (which determines whether it is production or test).  So, if there is only one readonly copy of a third party database (either too large or not possible to create a test version), it may be linked to test and production at the same time.  Another example: towards the end of testing a large project, the databases could become production; so the same database can be both test or production.
There is no visual clue when in a production environment, and a very clear one when in a test environment (similar to but nicer than green-screen). 


## 7. My Account

The My Account menu option allows personalisation of the system. The following sub-menu options are available:

![alt text](file:///home/jannie/Projects/canvas/src/documentation/MyAccountSubmenu.png)


- Who am I / Current UserName and DateTime logged in.

![alt text](file:///home/jannie/Projects/canvas/src/documentation/WhoAmIpopupForm.png)

- Logout (will show the initial login form, and will not proceed until successfully logged in again).  All cached data (data stored locally from the server) will be cleared.

![alt text](file:///home/jannie/Projects/canvas/src/documentation/LogoutConfirmation.png)

- My Profile: User Detail (a user can edit all details via a popup form except the blocked ones like UserName, which can only be editted by Admin).  Fields are firstname, lastname, etc.
Change password, via a popup form.  It also shows a table with my group membership (popup readonly form of the groups the current user belong to), my Data Source access (popup readonly form of actions that the current user is allowed per Data Source), my Report Ownership (popup readonly form of the Reports that the current user has created), my Dashboard Ownership (popup readonly form of the Dashboards that the current user has created, indicating which ones that have shared with others), my Shared Dashboards (Dashboards that others have shared with me) and my History (popup readonly form of previous activities, i.e. Reports run).

![alt text](file:///home/jannie/Projects/canvas/src/documentation/MyProfilePopupForm.png)

- Personalisation is where the user indicates how the system should function. 

![alt text](file:///home/jannie/Projects/canvas/src/documentation/PersonalisationPopupForm.png)

Personalistion includes:
- Startup Dashboard: optional Dashboard to open and show when the frontend starts up.
- Environment (test, prod), and option to select a new environment.  All existing Dashboards, Reports, etc will be closed, and the new account profile will be read from the selected environment.  The system will then configure accordingly.  Status information about all environments is also available under the Help menu option.
- Average Runtime: the system stores average historic runtimes per report.  When this is larger that the Average Runtime value, the user will be warn and prompted if he is certain to proceed.
- Colour Scheme applicable to the System.
- Widget Config is the default Widget configuration used when a new Widget is created.
- RptFilters is the default Report filters to apply whenever opening the table of Reports, Dashboard to open at startup, etc.
- growlSticky: when true, growl messages (shown in the right top corner) will not disappear automatically, and the user has to close each one manually.
- GrowlLife is the duration in seconds of non sticky growl messages.
- Grid Size: is the size of the grid in px to use.
- SnapToGrid: when true, Widgets snap to the grid when created or moved.


## 8. Help

Help menu options are:

![alt text](file:///home/jannie/Projects/canvas/src/documentation/HelpSubmenu.png)


- System info, for example the current version of the system that is useful for responding to support calls.

![alt text](file:///home/jannie/Projects/canvas/src/documentation/SystemConfigurationPopupForm.png)

// TODO - design and code
- Feedback: when the user wants to give feedback on the usage of the system, or log a support call.
- Tutorials: short instruction sets to get going quickly, without elaborate explanations.
- Reference Guide: this guide.
- Discussions: in-depth discussion on selected topics.


## 9. Design principles

In designing the software, we took the following principles into consideration:
* Keep it simple and clean; cut down on clutter.
* Line up things; pixels matter.
* Must be easy to access anything from anywhere.
* Use known / familiar concepts (easy to learn).
* Colours: 
1. use complimentary colours
2. use neutral colours and one bright colour for focus
3. use an established colour palette
* Fonts: 
1. only use a few different ones
2. avoid fancy fonts  
3. vary bold and italic to differentiate stuff
* As few levels of menus & forms as possible.
* Make an interface that works for the users.
* Whitespace: ultimate clutter reducer; actually increases conversion rates.
* Pay attention to your goals, and make sure the user gets them easily.  Make it easy to find * the most important things.
* Content: less is more, bullet and shorten.
* Headlines: talk value, not detail.
* Pay attention to image size and response times.
* You dont have to be original – COPY.  
* Use mockups (Gimp, balsamiq, Ai).
* Persist; design by definition is messy and requires patience.


## 10. Environments

It is important to separate develop and test from production.  In order to achieve this, we use environments.  An environment is built on a hardware platform, and consists of a backend (a collection of databases that may be accessed, users and groups, associated security access, configuration parameters like the url for REST API, etc. ) and a web-based frontend (which may be located on a different set of hardware).

Environment information (like access) is kept by the backend, from where the frontend reads it.  For production, the links are fixed with no user option to change it.  For test, the workspace (frontend) can read the list of available environments from the backend, and the user can select one to work with.  No further information is kept about it in the workspace.

One can copy and also sync the details (users, access, etc) from an existing environment.  That way, it is one click to get a new environment up and running.  In order to ensure consistent data quality, the following configurations are possible:
* Prod environment (prod databases and third party read-only databases) that lives on a hardware configuration, and linked to a prod version of the frontend.  This prod-prod setup is done at installation (by us) and cannot be changed.
* A test environment (test databases and potential third party read-only databases) lives on a hardware configuration, and linked to a test frontend. 

A test environment prefixes all output with TEST, for example to an ftp, url, folder or email (subject and attachment).


## 11. Architecture

There are 3 distinct software components that work together to render the data:
* Canvas is the frontend where data is visualised, either in tabular or graphical form
* Eazl is the RESTful API, to which Canvas connects
* Overlay is a descriptive data collection tool.

Backend Services / connections
There are two types of services / connections:
* Data provision that serves data based on input parameters and is not dependent on any visualisations. This layer is exposed as REST API which can be consumed by other applications. 
* Permanent connection to receive updates and messages.  This is implemented as a Web Socket.

System data is read at startup, and cached.  This is done in order to minimise the number of database queries.  When this data is changed on the server, a message is sent to the frontend, and the latest dataset is read again from the server.

The Canvas Development installation

This is all you that a user needs from this section.  

In the development environment however, one has to follow these steps to install Angular, etc in order to perform development work:
cd Projects/ (parent folder to Canvas folder)
ng new canvas (install skeleton via CLI)
Create canvas folder
Install Angular-cli
Install the correct version of Angular (see the packages.json file for detail)
Install PrimeNG & font awesome
Install Vega and Vega-lite

To upgrade the development environment, perform the following:
Upgrade to the latest CLI globally:
sudo npm uninstall -g angular-cli
sudo npm cache clean
sudo npm install -g angular-cli@latest 

Upgrade your local Node.js with NPM (v7.8.0):
sudo npm cache clean -f
sudo npm install -g n
sudo n stable

Upgrade TypeScript (2.2.2):
sudo npm install -g typescript@latest

Upgrade VS Code (v1.10):
Get tar from https://code.visualstudio.com/updates/v1_10

Upgrade  / Add typings for Vega (used in TS) – see http://definitelytyped.org/ for detail on classes, etc:
sudo npm install --save @types/lodash
Alternatively: try /// <reference path="..." />, see www.typescriptlang.org


## 12. Backend
* Data diagram
* Eazl admin – Django console
* Overlay package and query structures
* Overlay task management

The frontend does not store any data (other than caching user-related info).  
The system records will have Deleted / Archived flag.  Thus, the SQL must cater for this.  This is less work than a separate Archive table, and allows for an easy UNDO.  For now the system does not have an Undo button; it will be created quickly once needed.
Eazl data will not have ANY versioning in the form of EFD & ETD.  If the client has data with this feature, we will write the base Packages to cater for it.
The backend status provides an elegant way to close the REST (for say maintenance) and send the user a friendly message.

Installation:
In canvas: 
git clone https://github.com/BradleyKirton/eazl-rest.git backend  
Activate the virtual environment
pip install -r requirements.txt
Then migrate, makemigrations, migrate
Loaddate, make sure API running
To create: python manage.py loaddata fixtures.json 

Overlay Packages:
Whenever a base package changes,overlay will 
Automatically compile it with all related queries (which means Reports).
Queries (Reports) that fail, will be deemed bad / dirty, flagged as such on the frontend so that the user cannot run them.
