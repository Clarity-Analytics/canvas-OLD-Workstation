# Reference Guide for Canvas

This guide aims to provide technical descriptions of the machinery and how to operate it.

## Table of Contentt

1. Overview
2. Installation
3. Login
4. Visualisation
* Dashboard Editor
* Widget Editor
6. Collaboration
* New messages
* View messages
7. Manage / Admin
* Users
* Groups
* Datasources
* Reports
* Dashboard Manager
* System Configuration
8. My Account
* Who am I
* Logout
* Profile
* Personalation
9. Help
* System info
* Feedback
* Tutorials
* Reference Guide
* Discussions
10. Design principles
11. Environments
12. Architecture
13. Backend
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

Once logged in successfully, the user will be presented with a single form containing a menu at the top.  The menu is adapted for access rights of the user, and inaccessable menu options are dimmed out.  This form will remain in focus, showing different parts of the system as the user clicks the menu options (in techno-speack, Canvas is a SPA or Single Page Application which enhances the user experience).


## 4. Visualisation

The Visualise menu option is used to display data; in fact, it is the only way for users to extract data.  The data shown can be a mixture of tabular data (tables) and graphs, customiseable by the user.  So, the term visualise includes ‘standard reports’.
The following preparations are necessary to visualise data:
Identify the data: define a Data Source using the Manage menu option tells the system where the data lives, and how how different data portions are related.  
Describe how to extract the data: define a Report using the Manage menu option will describe how the data must be manipulated and aggregated (i.e. sum the SalesVolume).

Visualisation is done onto a blank space called a Dashboard.  Each Dashboard is a collection of existing Reports, completed as part of the preparation above.  A user can create any number of Dashboards. 
A Report is placed onto the Dashboard as a Widget, which is simply the data from the selected Report as formatted by the user.  For example, lets say we have a Report that provides the sales volumes per region and per month.  Any number of Widgets can now be created using this Report, for example: Widget A can be a pie chart per region, Widget B can be a bar chart of the total sales volumes per month, Widget C can be a table with the detail data, etc.

Each Dashboard has two or more tabs, located at the top of the work space:
Manage tab: it shows an overview of the Dashboard with its tabs and Widgets, and allows for the creation of new tabs, changing tab order, sharing Dashboards, etc.  This tab is always present and cannot be deleted.  The creator of the Dashboard becomes the owner, and can optionally share the Dashboard with other users. 
Data tab(s): the Dashboard will have at least one data tab, limited to a total of 8.  Each tab is of type graphical (can contain graphical Widgets) or tabular (contains one table of tabular data).

The Manage tab contains the following portions:
Read-only information about this Dashboard.
Action buttons pertaining to it.
Table of tabs in it.  It will always have at least one row.

Dashboard information:
Dashboard Name.
Dashboard Description.
Dashboard Owner.
Dashboard dimensions: max number of rows and max number of columns.  The number of columns must be specified (as it is awkward to keep scrolling left and right), while a default value of 0 rows indicates an unlimited number of Widget rows.
Dashboard Shared with (list of users; either ReadOnly, Full).  ReadOnly access means that the user can only view the data tabs, while Full access means that the user also has access to the Manage Tab (and can thus modify the Dashboard).  In case the recipient does not have access to the Data Source of a particular Widget, it will simply show ‘No Access to underlying Data Source’.  The sender can add a password to a Widget.  The recipient will be able to see the data with the correct password, irrespective of access rights.  This password has to be entered each time to view this Widget.
Dashboard Mode: Tab mode will show the Dashboard with diferent tabs (allowing for modification), while View mode will show the Dashboard as a slideshow (and no option to modify).  
The slidehow is a view-only presentation of all the Widgets on all the tabs onto one big canvas.  By default, the tabs will be organised below each other, with the maximum number of columns are per the user default.  This user has freedom to arrange the Widgets dynamically with the mouse.  The user has the following buttons for the slideshow: Print, Show Comments or Show as full screen (allowing for the Dashboard to be used in a presentation).
The position of Widgets on the slideshow is remembered.  When Widgets are added / deleted in the tab mode, the subsequent Widgets will simply adjust their position to allow for the change.

The Dashboard actions are: 
Import / Export Layout: this option allows the user to export the structure of a Dashboard to a text file.  A Dashboards can be created elsewhere and imported.
Delete Dashboard.
Print Dashboard.

The table of tabs contains:
Tab information like Tab number, Tab name, Tab description (if added, this will be shown as a Text Box Widget at the top of the tab), number of Widgets and Tab type (tabular or graphical).
Tab Action: Delete.
Tab Action: Move up/down.
Tab Action: Show tab (nothing is refreshed).
Tab Action: Run tab (data is refreshed).
Tab Action: Manage Widgets.
All the owners have full access to the Manage tab; it is not split down to a lower level of detail.  Other user can only view it.

A popop form provides a table with Widgets per tab:
Widget number.
Widget ID / unique name.
Widget type (tabular, pie, bar, etc).
Widget Report and parameters set linked to.
Widget fields (list with mapping to Widget axis fields, for example region mapped to X-axis).
Widget filters (list).
Widget Comments.

As mentioned, there are two types of Data tabs: tabular and graphical.  Tabular tabs contain one table (grid) with data, a filter included as a row in the table and a button bar at the top of the display area with the following buttons: 
Properties:
Data Source of the underlying Report.
Data Source Owner.
Data issues (if any on the Data Source).
Report Name and Parameter set.
Report Owner.
Report Description (shown at top if entered).
Reason why Report cannot be run (something has changed and broken something).  This allows to temporary suspend Reports.
DateTime tab was created.
DateTime tab was last updated.
DateTime tab was last refreshed.
RefreshMode: Manual, onOpen (refreshes automatically each time the Widget is shown), Repeatedly and number of seconds (refreshes automatically on open and repeatedly thereafter).
Edit allows to select / amend the:
Title (edited with a popup, where the default is the Report name), with a checkbox to display it or not.
Report that provides the data for this Widget (name and parameter set).
Fields to show in the table on the Dashboard.
Filters (one per field, taken together as AND conditions).
Widget type, which is tabular in this case but can be pie, bar, etc for grahpical Widgets which are discused next.
Sorting (optional): for now the table can only be sorted on one field, ASC or DESC.
Edit (continues):
ShowLimitedRows (optional) to restrict the number of data rows to show (for example, only use the top 5 rows from the Report).  This option should ideally only be used with Sorting (for example sort the data DESC on SalesVolume).
AddRestRow (optional) to add a data row with the rest.  This can only be used with ShowLimitedRows. For example, show the SalesVolume for the top 5 regions, and add a row with region = Rest and SalesVolume equal to the sum of the remaining regions.
Edit (continues): 
Aggregated fields (optional), for example SUM(TotalSales).  This can only be used with Grouping, or alternatively only Aggregated fields can be shown (as a single row).  For example, show only the TotalSalesVolume. 
Grouping (optional), for example Group By Region.  Once Grouping is used, un-aggregated fields cannot be included in the table.  It can only contain the grouped fields and optionally any aggregated fields.  It is thus possible to get a unique list of regions by only showing the grouped field of region.
Edit (continues): 
Having is a filter on aggregated fields (this corresponds to the HAVING clause in SQL).  It can only be used on aggregated fields.  Note: filtering takes place before aggregration, Having takes place after aggregation.
Send to: email Recipient(s), Subject, Body and format of the attached table (Excel, CSV, JSON).
Export: open the table in Excel or store it to a folder in a selected format (Excel, JSON, PDF, PowerPoint, Jupyter or csv).  Graphical Widgets can be exported a .png files.
Lock / Unlock: this is a simple toggle that can be used by the owner or a recipient that has Full rights to the Dashboard.  This is used to prevent accidental changes.
Comments: any user (Full shared) can add comments, which is a list with Author, Datetime created, Comment.  All users can read all comments.  All comments are stored and cannot be editted or deleted.  Comments is currently restricted to text, which is limited in length to n characters.  There will be a visual clue that a comment has been added to a Widget since the user has last seen the Dashboard.  Comments are linked to the Widget, and cannot be placed randomly.  
Liked: each user can like a Report.

Refresh (re-reads data from the database).  This is only needed if the RefreshMode is set to Manual.  This means that the underlying Report is run again, and a fresh Result set is created.  When not refreshed, the data is simply read from the Result set, which will be significantly faster for large amounts of data.
Password: this locks a Widget to other users, and it can only be seen by entering this password, irrespective of the access rights to the underlying Data Source.
The Access button shows who has access to a selected Widget (it is inheritted from the underlying Data Source access).   This data is readonly, as changes can only be made using the Manage menu option.
Drill down: this is possible when the table is showing aggregated data or in case of a graphical Widget.  This will add a new tab to the Dashboard, called ‘Drill down detail for ...’ and show the detail of the output (which is the underlying Result set in the database).
Hyperlink: it is possible to link a Widget to another tab, for example one can click on a graph which will then open another tab with more graphs.
Delete Widget (with Y/N confirmation).
Print: each Widget can be printed individually.
Data Quality: indicates the quality of the Data Source.
It has the same buttons as the tabular Widget described above, except that the Edit button includes the field mappings to Widget axis (for example Region → X-axis).

Example of a graphical Widget:
The filters have to be placed at the top of the graphical tab, in a similar fashion to Widgets (one can see them as special Widgets).  Filters are defined per Data Source.  These filters apply to all the Widgets on the tab with the same Data Source, but not to other tabs.  Any number of filters can be added to a tab, and even more than one per Data Source.  In this case, they will all be applied prior to presenting the data in the Widgets linked to this Data Source.  More than one Data Source can be filtered in this way.  
The design goal is to make these dynamic (think Crossfilter).

The Widget format is predefined for now, for example the user cannot change the colours, font size, etc.
A Widget can be positioned anywhere on the canvas using the grid tool: for now this is only possible using the mouse.
If the average run-time of the Report on which the Widget is based is longer than 1 minute, the user will be warned and asked if he really wants to continue.  In addition, it will explain where and how to get the results.  If a long-running Report is requested again before it has completed successfully, the user will be warned to prevent a series of unintentional requests.
Each Widget can be customised in terms of the information shown on it; for example show only the graph, show the title, graph and Refresh button, etc.  The default setting can be amended under My Account, and all new Widgets will have this configuration when created.  The configuration for each Widget can however be changed individually after creation.

The Visualise menu option has the following sub-menu items:
Show all: shows all Dashboards that exists in the system.  Note that Canvas comes pre-installed with Dashboards to show system information (for example, a list of users, access, etc).  These belong to a Dashboard Group called Admin Dashboards.  
New tabular: this is a shortcut to create a new Dashboard that contains tabular data.  Once created, more tabs (graphical or tabular) can be added.
New graphical: this is a shortcut to create a new Dashboard that contains graphs.  Once created, more tabs (graphical or tabular) can be added.

This shows a list of all available Dashboards in a single table with the following columns:
Dashboard name.
Dashboard description.
Dashboard owner.
Dashboard group.  
Dashboard shared with (list of users).
Print Dashboard (for now, this is using the print function on the web page).
Delete Dashboard.  All shared users and the owner (if deleted by another user) will be notified via a Message.
Export Dashboard: 
PowerPoint deck, where each Widget will be inserted on a new slide (using only top 15 rows of each table).
Excel, with each tab as a separate worksheet.
Show Dashboard (refresh of the data will be done according to the RefreshMode of each Widget).
Refresh Dashboard: will refresh all Widgets, while the focus remains on the current tab.  The refresh DateTime is stored.
Tab number to open at startup of Dashboard.
This option opens a new (blank) Dashboard, creates a tabular tab, update the Manage tab and opens the form to select a Report and parameters.  The purpose of this option is to make it easy for users to create a new ‘report’ (which is just a table of data).  It also reduces training time as it acts like a wizard.  
It is not necessary for the user to save Dashboards as all actions on a Dashboard are stored automatically.  This means that the Dashboard will look exactly like it was before when the user opens Canvas again.  There is no undo functionality.
This options is similar to the New tabular option, but creates a graphical tab instead.  As is the case with the tabular tab, all possible actions will be created in the background and the form to select a Report will be shown.  
Once completed, the user will have a Dashboard with one data (graphical) tab which contains one (graphical) Widget.  The user is now free to add more Widgets on the same tab, or to add more tabs (using the Manage tab).
The New tabular and graphical menu options are the only ways to create a new Dashboard.  Also, Dashboards always belong to its owner (creator) who is the only user who can share it with other users.
Having multiple graphic Widgets on a Dashboard helps to tell a story:  one can present different views of the same Report (set of data): given the trades for 2016, one can for example show a bar graph of trades by month, value per trade type, top 5 brokers by volume and so on next to each other.
There is a special type of Widgets: text box.  This is useful for headings and descriptions, or even a general comment applicable to the whole Dashboard.  A portion of the text will be shown instead of a graph. This Widget will only have the relevant buttons, and an additional button to Edit the text.

## 9. Collaboration
* New messages
* View messages

A key objective of the system is to make collaboration easier.  In addition to emailing of output, the following are available:
Reports can be liked.  This is an indication of popularity / usefulness of Reports.
The natural display order of Reports and Dashboards are per number of times used.
Report suggestions: it will show the top n Reports used by other users that belong to the same groups as a user, and not yet run by this user.
Widgets allows for comments between users.

Messages can be sent to one or more users, and / or to one or more groups: note that each user will only get one message even if a member of multiple groups.  A user can only share Dashboards to which he has access, and to recipients with whom this Dashboard has been shared.  If a user is online in the system, his name will be shown in green (and not black).  When hovering on a user, the last datetime logged into the system will be shown as a tooltippie text.  For now, it will not read Outlook to determine Out of office notification status.  Messages do not have any priority (i.e. urgent).
Linking messages to a specific Dashboard makes it more useful than email since the Dashboard under discussion is shared, and not duplicated.  This avoids the document versioning problems common with email.  In addition, specific comments can be included on Widgets.    

The icon for the Collaborate menu option will change when a new message has arrived.  New messages can result from: 
A previously requested (async) Report has completed and the Result set is ready.
A Message from another user has arrived.
Alerts (system generated messages, i.e. an error occurred).

Messages are non-intrusive; the user can send and receive Messages while leaving the forms on their work space intact.

The Messages sub-menu option opens up a popup form with these portions:
Drop-down of the Dashboard to which the messages are related.  Default is the current Dashboard if anyone is currently visibile.
List of favourite users (all previous recipients are automatically added), most active at the top.  This has a button to remove a recipient as a favourite. 
A drop-down to select new recipients (can only be those with whom the Dashboard has been shared).
Messages (New ones at the top in a different colour, followed by the Historical ones).

Each messages has action buttons: 
Toggle current Message as Read / Unread.
Toggle all Unread Messages as Read (once done, those message can be toggled back to Unread).  This is useful in case a swarm of Messages were generated by the system.
Reply (which will create a new message).
Show Linked Widget (if the Message is from the backend to indicate that a Report has completed).
Show Dashboard (if a link was supplied).  This will close the current Dashboard and open a new one on the tab where the link was created. 

The recipients can be one or more users, or one or more groups.  A comma separated list will be shown.
Additional fields: 
Conversation ID (users can start a new ID at any time.  All subsequent messages will be linked to it, until a new ID is created).
Dashboard name associated with this message.
Date and time sent.
List of Reports and parameters included in this Dashboard.
List of Data Sources included in this Report, etc.


## 10. Manage / Admin
The Manage menu option is used to manage the following entities in the system:
Users.
Groups.
Data Sources.
Reports.
Dashboards.
System configuration.

Manage in the context above includes the following functions:
Add.
Edit.
Delete.
Membership (for users and groups).
Access permission (to Data Sources for users and groups).
Ownership (to groups and Data Sources).
History (audit trail / activity log).

* Users

A data table of users will be display, with the following buttons built into each row:
Add / Edit / Delete user.
Group Membership.
Access rights to Data Sources.
Related Dashboards: owned, shared with others, shared by others.
Message history.
History of Reports run in a Dashboard.

On registration, only a Username (say max 50 characters with no spaces that must be UNIQUE) and Password are required.  The Username could be the UserID in a big company, or a friendly name in a smaller company.  Adding a user requires the appropriate access rights.
On clicking Add User, the following popup will appear (the popup for Group is similar with Group-Name and Group-Description) :

A user can only be deleted if he/she has never used the system; for example was added in error.  In this case the record is physically deleted.  Once a user has start using the system, the record cannot be deleted – it can only be made inactive by setting the InactiveDate field.  An inactive user (and its memberships) can be re-activated again. 
Deleting or inactivating a user requires the appropriate access rights.  Like all Delete actions, a Are you sure - Yes/No confirmation will popup.  
If the user belongs to one or more groups, the membership will be either deleted physically or made inactive using the InactiveDate field.  There is no undo button for a physical delete.

Additional user fields are optional, and can be completed by the user himself, or for all users by an Admin person:
Firstname, Lastname, Nickname, Photo.
Limited transactional info: last Datetime logged in, last Datetime a Report was run, etc.
Email address, Cell, Work Telephone, WorkExtension.
A button for the user to reset his password.  Admin can use this to reset the password for any user.  The new password will be a 4 digit truly random number.  On the next login, the user will be forced to select a new password (no work can be done with this random password at all).  

ActiveFromDate (useful to be able to set in advance), InactiveDate (can only be editted by Admin), DateCreated, DateLastLogin, IsStaff.
There are also 10 text, 10 date, 10 number and 10 boolean fields that can be customised (the user provides the label and the form validates input according to the data type before saving it).

Group Membership:
A user can belong to zero or many groups.  Groups live in a flat structure, with no hierarchy.  So, groups cannot belong to groups.
Users, Groups, Reports, Access, etc. exist per environment.  This way one can introduce a new Report into test without the production environment knowing about it.
Once a group or membership has been editted, the affected users will be send a message.

Access:
Access is assigned per group and / or per user.  No access is not given by default, and must be explicitly assigned.  The only exception is Admin who has rights to all entities.
Access rights are granted to Data Sources.  All the Reports based on a this Data Source inherits its access; and similarly the Widgets based on the Report.  A Dashboard can have one or more Data Sources.  When a Dashboard is shared, the recipient may will only see those Widgets where he has access to.
Access assignments are inclusive: if a user has no access to a Report, but belongs to a group that does have access, the user will have access to the Report.  There are no exclusion rights (once included via a group, the user stays included).
Admin rights are not granted to individual users; users get admin rights when they belong to the Admin group.  

Admin has access to all users, groups, Reports and Dashboards.  Once part of the Admin group, specific access cannot be excluded (its all of nothing).

Admin can reset a user password, but the user will be notified and has to change his password at the next logon.

Admin can also change the system configuration: for example the location of the backend server.  It goes without saying that Admin rights should be used sparingly.

History:
History of previous activity is not on a separate form, but build into each entity.  This provides a readonly history of all Reports previously requested by the user.  Each Report already processed has a status of Completed Successfully or Failed, with additional information like StartDateTime, CompletionDateTime, ErrorMessage, etc.  When a Report has been submitted, but not yet completed is has a status of Pending.  In case it has been scheduled to only start at a later time, the ScheduledDateTime will be displayed.  Each record in the history has a Requestor, which is the UserName of the user who requested the Report, or scheduled it.

* Groups
The table for groups will have the following buttons:

Add group.
Edit group.
Delete group.
Users-in-this-Group.  Group membership can be editted on the user or the group forms.
Data Source access.
Shared Dashboards.

A group can contain zero or more users.  A user can belong to zero or many groups.  Groups are flat, with no hierarchy.
The Add Group and Delete Group buttons function exactly the same as the Add User or Delete User buttons.
The following groups are permanent and not deleteable:
Admin – can be used to easily manage admin access.  By default, no one belongs to the Admin group.
Everyone – simplified access to innocent Reports. On creation, a user belongs by default to this group.  This membership can be deleted.  Only the owner has access to a new Report, other users or Everyone has to be explicitly added.

The Edit Group button brings up a form with group properties and access rights, similar to Edit User.
The Users-in-this-Group button brings up a form similar to the Group Membership form: it shows a list of all users and whether they belong to this group or not.  It also allows toggling of membership.  Note that one can edit on both forms (User or Group), and it will reflect on the other one.
The Data Source Access and Related Dashboards buttons are similar to those for users.  
There are no built-in groups for roles (i.e. Can-manage-Reports, Can-manage-Dashboard, etc) – each company will decide on the groups required and create accordingly.

The group structure is flat, while most companies have a hierarchy of groups or departments.  Given the complexity and amount of admin involved, we will not try to mimic the company structure using groups.  We assume that the company structure is available for HR reporting, and up to date.  It is the user’s decision how to link groups to the hierarchy, if at all.  
Canvas has no functionality to import or sync to the company hierarchy.  Groups and group member ship can be exported to Excel as per usual, where it can be compared if necessary.
It also does not cater for restructuring (where for example all users from Group A and Group B are merged into Group C).

Each group has an owner, which is the creator.  This owner and Admin are the only ones that can add / delete other users as owners.  These owners manage group membership.
Each group can be marked a public (visible by all users) or private (only visible to owners and members).  The latter is a similar feature to groups on WhatsApp, and equates to a personal distribution list.  All lists can be edited and deleted by an Admin person.  Once a group or membership has been editted, the affected users will be send a message.
Currently Canvas does not access Active Directory (users or groups) and does not authenticate against it.

Data Sources are defined in the backend.  In techno speak: they are SQL packages that collect data from one or more databases or other sources, and collate it in a rectangular block of data.  The table of Data Sources has the following actions:
Add / Edit / Delete a Data Source.
Manage parameters via a popup form.
Each Data Source has a maximum one set of parameters, it is however optional.
The parameters are embedded filters that are required to make the SQL work.  It also serves to limit the amount of data returned.


* Datasources
A Data Source (called a base package in the backend) is a large block of data from which Reports are constructed.  In the case of a list of codes, the Data Source will be used as is in the Reports (select all records), while it will be too large in some cases (and the Report will have to filter down the data to selected columns and rows, say to a particular month). 
It is the basic building block for overlay, which is a backend component.  Each Data Source is versioned, keeping all associated data for each version.  When a Data Source changes, it will recompile all Reports (queries) based on it and mark the bad / dirty ones (which cannot be run).

The frontend provides basic information on Data Sources from the backend:
List of Data Sources with information like databases, connections, etc.
State (compiled, or compile errors).
Delta between two different Data Sources (base packages) or two different versions of the same Data Source.
Delta between two different queries, making it easy to understand what is different, or in case one won’t compile. 
Data issues per Data Source, which can be stored per Data Source, per table or per table & field.  Each issue has a Logger-UserName, DateTime, Description.  Issues can be added, deleted, edited. 


The SQL for a Data Source is created outside of Canvas.  Data Source may require parameters and default values for some fields; indicating which are changeable by users.  Examples will be a date range for very large amounts of data.  Some values will be set conservatively to ensure that a Report does not return 1bn rows if the user does not enter a value.
The system stores a list of all fields.  This can be supplemented, for example: field description (allowing to build a data dictionary if this is not available in the underlying database), quality of the data, and so on.

The Data Source is supplied by the backend (Eazl REST API with data provided by the overlay module).
In future, overlay will have a generic feature to read from the following (constructed by us, or simply available in Canvas by the use of basic parameters like file name and file format, or table and field names):
Database (provide connection string and SQL / table and field names and JOINs).  
File (we provide location and format).
Web url & say table name.   

* Reports
The Reports sub-menu option will show a table with the following buttons inside the grid:
Add / Edit / Delete Report (the form for Reports deviates from the standard table for other entities, due to the complexity of the workflow).  
Access (users and groups to the underlying Data Source).
Schedules.
Parameters.
Import / Export.
Report history (who ran it when, including Pending ones).

State: Reports can be suspended, with a user-friendly message that will pop up when used anywhere.
Access are not explicitly granted to Reports; they inherit the access of the Data Source that they are based on.  Security access is not content sensitive; so it cannot be restricted to a specific department or number of user IDs.  From experience this get really complicated and only needed in specific cases.
If the underlying Data Source requires parameters, the Report must have at least one default parameter set.  At start, the values are set to the parameter set from the Data Source.  Note that certain parameters may not be editable by the user, and will be included in the Report as it is essential for it to run.

When selecting Reports (either on the Manage menu option or in Widget creation), a user will only see those Reports that he has access to (i.e. has access to the Data Source) 
The following are readonly information per Report: 
Schedules (future dated ones).  These are only the definitions.
Messages (filtered to the current user, or for all users if an Admin user is looking at it).
Report History (all previously run Reports); filtered to the current user or all users for an Admin person. 

The above exists per environment.  In fact, all the entities (users, groups, Reports, etc) exists per environment.  This way one can introduce a new Report into test without the production environment knowing about it.  Once a Report has been created, the structure can be Exported to a text (JSON format) file.  Reports can be Imported from these files.  If the imported Report does not exist, a new one will be created.  The user performing the action will become the owner of the Report.  If the Report already exists, the result will be the same as a edit action: a new version will be created.  In both cases, the necessary validation will be performed.  If validation fails, the Report will be marked as diry (not runable).  Admin may change the owner of a Report.

A Report is defined as a rectangular block of data selected from a Data Source.  It is created by means of the following steps, some of which are optional:
Select a Data Source (which is a pre-created large block of data, and includes database location(s), database type, defined relationships / business rules between different data sets and optional parameters).  This equates to a base package in Eazl.
If the Data Source contains a parameter set, a default one must be creatd for the Report.  It will open up with the same values as that of the Data Source parameter set.  Multiple parameter sets can be defined per Data Source; each one will be uniquely identified and useable as the input to a Widget on a Dashboard. 

Select fields (columns) and rows to show, using filters.
Group and aggregate (optional).  Note that once grouping is applied, the selected fields to show can only be grouped and aggregated fields, not detail fields.  Also, if aggregated in the Report, the Widget can only use the aggregated fields in the display and cannot drill down to the detail data.  This type of aggregation is done in the backend (using SQL against the database) and useful to reduce very large datasets.
 Sort ASC or DESC on any number of fields (optional).
 Limit the number of rows returned (optional).  This is most useful when used in conjuction with sorting (otherwise the user has no control over which records are returned).

The extraction of the data only happens when the user displays the associated Widget on a Dashboard (or a Dashboard is scheduled).  It is triggered by the frontend asynchronisly, which means that the frontend can continue with other tasks while the data is being extracted.  
The backend will extract the data, store the results as a Result set (in a backend database) and then notify the user via a Message.  When the user clicks the Show Dashboard button on the Message, the related Dashboard and Widget will be shown.  
The Widget was formatted at creation.  So, at this point in time the frontend only pours in the data and presents it to the user.

Reports are versioned, and each change (or import) increments the version by one.  The history is kept per version, and so are the future dated schedules.  On editing, the system will validate the Report to ensure the parameters and fields are a subset of its Data Source parameters and fields, and that the Widgets and schedules based on this Report are still valid (uses the same fields, filters, etc).  Reports can only use the latest version of a Data Source.  Widgets do not have versions, and always use the latest version of a Report.
In reverse, the Eazl backend will validate all Reports whenever a Data Source is changed.

Reports can be created by:
The Canvas frontend.
The Import / Export facility for Reports, which will allow someone else to create a Report for a user and let him import it, or to load Reports from the test environment into the production environment.  On importing a new Report from test, the access rights are not imported as well; access in production has to be created and maintained by Admin.
Similarly, access rights to Data Sources (and thus its Reports) cannot be promoted from test to prod.

The following buttons are presented in the Reports grid:

Schedules: Shows a popup form with a table containing future dated and recurring schedules, with limited additional detail like when last the Report was run.  A user with the appropriate rights will be able to Add, Delete and Edit the schedules.
Activity History: The History shows all times the Report that have been Run before.  It gives the status: Completed, Errorred or Pending.  It also shows the metadata required for each Report (Data Source used, etc), a read-only link to the output Result set and pending Reports being run at the moment (which can be cancelled).
Access: Shows who (users & groups) have access to this Report.  Access is given to the underlying Data Source.

Delete: this is used to delete the Report; of course given that the user has rights to do so.  For now, this can only be done by an owner or Admin.  If a Report has never been run before, it will be permanently deleted.  Else, it will be made inactive.
Edit: Show the form to edit the Report.  If the user does not have rights, the data will be readonly.
Add New: allows the user to add a new Report.  This is the same form as the Show / Edit form.
Show All: by default users only see Reports that they have access to.  The Show All checkbox will show all existing Reports.  Reports to which the user do not have access will be dimmed out.

Search: opens the search form shown below, and afterwards show the results in the table of Reports above.  This is the same as the search button on the Widget.


Note that Reports cannot be run from this table – the only way to show data is to create a Dashboard using the Visualise menu option.

Each Report is based on a base package, which knows the metadata (description, datatypes, etc) of all its fields.  Thus, each Report knows (or references) the metadata of the fields it contains. 

The user can search for useful Reports using the following:
Report info: name, description, bundels, owners, favourites.
Users with access to a Report.
Data source info: repo, name, description, databases used, etc.
Table info: name and description of those used in base package.
Field info: names, aliases, description, data types, etc.

The Report form is used to add new or edit (or show) existing ones:

Data Source: As provided by the Eazl backend.  This includes the parameter set for the Data Source.
Parameter set: a Report has to have at least one parameter set if the Data Source has one, else none.  It can have multiple parameter sets.
Fields: Select Show/Not field in the output with an optional custom heading.
Filters: Users can select one optional filter per field (=, <>, between, etc.) and all filters are strung together with AND.  Else it gets too complicated.

Grouping on selected fields (optional).
Aggregation (SUM, AVG, COUNT, etc) on selected fields (optional).  Once one field has been grouped or aggregated, the output can only contain grouped and aggregated fields, and no detail fields.
Sort (ASC or DESC) on any number of fields (optional).
Limits: Show Top / Bottom n records (optional).
Having: a filter applied to an aggregated field.

For now, all results are stored as a Result set in a Postgress database.  This brings about storage size and performance considerations.  These Result sets are kept for a default period, after which they are deleted.  This period is editable, and can be increased by an Admin person.  Access to Result sets are the same as that of the Report which created it.

Each result set has additional information:
Event – who ran it when, what version, etc.
Meta-data – filters and fields used, data types, number of records, run-time, base package used, etc.

Reports can be bundled together into a Report Bundle (a group of Reports).  A Report may belong to zero or many bundles.  The Reports in the bundle are ordered, which determines the sequence in which they are run.  

Each Report added to a bundle has a checkbox: only run this Report if all previous Reports in the bundle have been executed successfully.  The default value is true.  

Each Report in the bundle may use the  same or a different Data Source.  It is possible to schedule a bundle.  This can only be done if the user has access to ALL Reports in the bundle. 

A user can filter the table of Reports on bundles.  This makes it useful to see only related Reports, say all Equity Risk reports.
Each user can tag Reports as favourites.  The user can also filter the table of Reports on favourites.

The user can have startup parameters to show all Reports in a specific bundle, or all favourite Reports.  This way the user will only start with the most useful Reports when the frontend opens.

* System Reports
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

This menu option provides a table with existing Dashboards.  Dashboards can only be created with the Visualise menu option.  
Dashboards can only be deleted by an owner or by an Admin user.
There are no predefined layout template for Dashboards; each one is unique.
Access to Dashboards are at two levels:	
Only shared Dashboards are visible.
Only Widgets with access to the underlying Data Source is visible.
Messages related to the Dashboard.

* Events
There are no specific menu options for the above:
These logs are shown on the relevant entity (Report, user, etc) as readonly information.
As usual, the user can export the results to Excel, etc.

* System Configuration
The system configuration includes all the necessary options and actions to make the system work.  It is typically done once off, and not changed unless something in the environment changes (i.e. servers renamed).  It has the following options:
The following white-labelling can be amended by a person with Admin rights:
Company Logo and Company Name.
Company theme (planned to be a CSS file).
Testing: Not sure what to do here ???
Report (query builder): No idea how …. ??
System wide parameters:
REST base url, which is set per environement.
Default period to keep Result sets, after which it will automatically be deleted.  The default value at installation is 1 day.
Max size for Result sets.  When a new Report is added and the total storage is above this max size, result sets will be deleted accordingly (could be all of them, except the last one).
Maximum number of rows per wdiget in a Dashboard Widget (i.e. max 15 lines per pie chart).
Default dimensions of a graphical Dashboard: 3 columns by 0 (infinite) rows.
System wide parameters (continues):
Average runtime for which a message is displayed (user will be prompted Y/N if the average runtime of a Report is larger than this).
Keep and read user credentials at startup: No (each user has to login each time), Yes.  
Environments:
Duplicate Environments: all or some entities (users, groups, etc) can be copied from an existing environment.  This import ask for advice when the same entity already exists in the destination system (ignore/ replace for one/all).
Edit the enviroment (production or a test environment) with all parameters.  All the data for environments is stored in the Eazl backend (REST API), including the data it contains, the database locations, database connection strings, etc.  Only Admin users can change the environment.
Environments (continues):
A database itself is neither production nor test; it always belongs to one or more environments (which determines whether it is production or test).  So, if there is only one readonly copy of a third party database (either too large or not possible to create a test version), it may be linked to test and production at the same time.  Another example: towards the end of testing a large project, the databases could become production; so the same database can be both test or production.
There is no visual clue when in a production environment, and a very clear one when in a test environment (similar to but nicer than green-screen). 


# My Account

The My Account menu option allows personalisation of the system. The following sub-menu options are available:
Who am I / Current UserName and DateTime logged in.
Logout (will show the initial login form, and will not proceed until successfully logged in again).
My Profile:
User Detail (a user can edit all details via a popup form except the blocked ones like UserName, which can only be editted by Admin).  Fields are firstname, lastname, etc.
Change password, via a popup form.
My group membership (popup readonly form of the groups the current user belong to).
My Data Source access (popup readonly form of actions that the current user is allowed per Data Source).
My Report Ownership (popup readonly form of the Reports that the current user has created).
My Dashboard Ownership (popup readonly form of the Dashboards that the current user has created, indicating which ones that have shared with others).
My Shared Dashboards (Dashboards that others have shared with me).
My History (popup readonly form of previous activities, i.e. Reports run).
Personalisation (how my system should function):
My startup options: Dashboard to open and show when the frontend starts up.
My environment (test, prod), and option to select a new environment.  All existing Dashboards, Reports, etc will be closed, and the new account profile will be read from the selected environment.  The system will then configure accordingly.  Status information about all environments is also available under the Help menu option.
My frontend colour scheme: these are pre-created via a CSS file, and the user can select a file from here.
Default Widget configuration, which determines what buttons and information is shown on Widgets when created.
Average runtime for which a message is displayed.
Default Report filters (bundle, my favourites only, name, etc) to apply whenever opening the table of Reports, Dashboard to open at startup, etc.


# Help
Help menu options are:
Current version of the system (this is needed for support).
User Manual.
Backend documentation.
System installation guidelines (frontend and backend).
Feedback …
Backend information (readonly popup form):
Configuration and status information (running/not) of current backend.
Available REST APIs with their status (up or not), usage (how to use i.e. required fields, etc) and maybe sample file, sample code, etc.

# Backend
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


## 2. Design principles

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
1.only use a few different ones
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


## 3. Environments
It is important to separate develop and test from production.  In order to achieve this, we use environments.  An environment is built on a hardware platform, and consists of a backend (a collection of databases that may be accessed, users and groups, associated security access, configuration parameters like the url for REST API, etc. ) and a web-based frontend (which may be located on a different set of hardware).

Environment information (like access) is kept by the backend, from where the frontend reads it.  For production, the links are fixed with no user option to change it.  For test, the workspace (frontend) can read the list of available environments from the backend, and the user can select one to work with.  No further information is kept about it in the workspace.

One can copy and also sync the details (users, access, etc) from an existing environment.  That way, it is one click to get a new environment up and running.  In order to ensure consistent data quality, the following configurations are possible:
* Prod environment (prod databases and third party read-only databases) that lives on a hardware configuration, and linked to a prod version of the frontend.  This prod-prod setup is done at installation (by us) and cannot be changed.
* A test environment (test databases and potential third party read-only databases) lives on a hardware configuration, and linked to a test frontend. 

A test environment prefixes all output with TEST, for example to an ftp, url, folder or email (subject and attachment).


## 4. Architecture

There are 3 distinct software components that work together to render the data:
* Canvas is the frontend where data is visualised, either in tabular or graphical form
* Eazl is the RESTful API, to which Canvas connects
* Overlay is a descriptive data collection tool.

Backend Services / connections
There are two types of services / connections:
* Data provision that serves data based on input parameters and is not dependent on any visualisations. This layer is exposed as REST API which can be consumed by other applications. 
* Permanent connection to receive updates and messages.  This is implemented as a Web Socket.

System data is read at startup, and cached.  This is done in order to minimise the number of database queries.  When this data is changed on the server, a message is sent to the frontend, and the latest dataset is read again from the server.


## Canvas Development installation

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

_____

# MD cheatsheet

## Section Title

> This block quote is here for your information.

List item 1
2.  List item 2
List item 1
List item 2
1.  List item 1 spaced out

2.  List item 2 spaced out
    with a hanging indent
    
3.  List item 3 spaced out

    With an extra paragraph.
    
        And a code block.
List item 1 spaced out

List item 2 spaced out with a hanging indent

List item 3 spaced out

With an extra paragraph.

And a code block.
2011\. Avoiding a list interpretation	2011. Avoiding a list interpretation

___


|              |          Grouping           ||
| First Header | Second Header | Third Header |
| ------------ | :-----------: | -----------: |
| Content      |          *Long Cell*        ||
| Content      |   **Cell**    |         Cell |

| New section  |     More      |         Data |
| And more     |            And more         ||
[MultiMarkdown Table]

# Heading1
## Heading2
### Headings3
#### Heading4
##### Heading5
###### Headings6

~~Strikethrough~~

|  Tables  |      Are      | Cool |
|----------|:-------------:|-----:|
| col 1 is |  left-aligned | $100 |
| col 2 is |    centered   |  $52 |
| col 3 is | right-aligned |   $9 |


[⋅] Unchecked Item

[X] Checked Item
-- → –

(C) → ©

(R) → ®

(TM) → ™

(P) → §

+- → ±

' ' → ‘ ’

'' '' → “ ”
