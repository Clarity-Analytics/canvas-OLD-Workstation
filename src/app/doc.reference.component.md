# Reference Guide for Canvas

This guide aims to provide technical descriptions of the machinery and how to operate it.

## Table of Contentt

1. Overview
2. Design principles
3. Environments
4. Architecture
5. Installation
6. Frontend Menu
7. Login
8. Visualisation
* Dashboard Editor
* Widget Editor
9. Collaboration
* New messages
* View messages
10. Manage / Admin
* Users
* Groups
* Datasources
* Reports
* Dashboard Manager
* System Configuration
11. My Account
* Who am I
* Logout
* Profile
* Personalation
12. Help
* System info
* Feedback
* Tutorials
* Reference Guide
* Discussions
13. Backend
* Data diagram
* Eazl admin – Django console
* Overlay package and query structures
* Overlay task management

## 1. Overview

Our purpose is to create a workspace for knowledge workers to visualise any existing data sources in order to obtain information, understanding and insight, with easy collaboration.  Just like a canvas provides a painter with a workspace, our Canvas provides a knowledge worker with a working space to get information and insight in order to work.
An existing data source is any piece of data in computer readable format.  Examples are company databases, text files, Excel spreadsheets, external databases, web sites and even streaming data.  Inherent to our solutions are the provision of new data sources, data cleansing and data hygiene.

A Data Source is a block of data with associated meta-data (description that tells us more about the format and content of the data).  All Data Sources are provided by Eazl (which is the backend REST API in techno speack).  The Data Sources can be structured (rows and columns) or unstructured data (i.e. documents).
With Canvas, our web-based frontend, it is easy to extract, manipulate and visualise data.  One can store the visualisation, and event schedule recurring extractions.
The output of a visualisation can be presented graphically or in tabular format on a Dashboard.  These can be printed or exported to other destinations like Excel.

The Canvas Dashboard can be used in different ways, for example:
A novice user can easily ran an existing Report with a single click.
One can create a Dashboard with graphs to summarise monthly management information.
A more experienced user can create new Reports.
Users can collaborate with Messages and while sharing the same content.
It is easy to extract and format data used by third party packages.


## 2. Design principles

* In designing the software, we took the following principles into consideration:
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
An environment is built on a hardware platform, and consists of a backend (a collection of databases that may be accessed, users and groups, associated security access, configuration parameters like the url for REST API, etc. ) and a web-based frontend (which may be located on a different set of hardware).
Environment information (like access) is kept by the backend, from where the frontend reads it.  For production, the links are fixed with no user option to change it.
For test, the workspace (frontend) can read the list of available environments from the backend, and the user can select one to work with.  No further information is kept about it in the workspace.

One can copy and also sync the details (users, access, etc) from an existing environment.  That way, it is one click to get a new environment up and running.
In order to ensure consistent data quality, the following configurations are possible:
Prod environment (prod databases and third party read-only databases) that lives on a hardware configuration, and linked to a prod version of the frontend.  This prod-prod setup is done at installation (by us) and cannot be changed.
A test environment (test databases and potential third party read-only databases) lives on a hardware configuration, and linked to a test frontend. 

A test environment prefixes all output with TEST, for example to an ftp, url, folder or email (subject and attachment).

## 4. Architecture

There are 3 distinct software components that work together to render the data:
* Canvas is the frontend where data is visualised, either in tabular or graphical form
* Eazl is the RESTful API, to which Canvas connects
* Overlay is a descriptive data collection tool.

Backend Services
There are two types of services:
Data Services — A generic backend services that serves data based on input parameters and is not dependent on any visualisations. This layer is exposed as REST API which are generically consumed by other applications at Myntra some of which are customer facing applications as well.
UDP Services — A service layer that saves users interaction with visualisation interface. This layer is also acting as a bridge between UI and Data Services and performing very thin semantic changes on the data passing through this layer.

Data Caching
This acts as one of the key component to help provide faster data by minimising the number of database queries. Cache hits are generally served in milliseconds and database hits take few seconds depending on the type of data being requested.
Redis is used to as data cache. Data gets stored in cache once it is requested by any user and if same data is requested by other user then it is served out of cache itself. Data is cached by generating a unique key based on request parameters of data services API
A pre-cacher is implemented that scans through all the dashboards created by user or accessed by users in last X days and it caches the data with default date for all the dashboards. This ensures super fast first load of any dashboard being accessed by user.

Metadata (Data Catalog)
Metadata store acts as an understanding layer between metric data store and UDP. The metadata store is responsible to define collections, metrics and dimensions mapped to a table in SQL world. It also supports definition of each metric that is eventually displayed to end user of UDP. It supports various additional features like formula definitions, type of metrics (e.g. Aggregate Metrics Vs Snapshot Metrics), visibility of metric or dimension etc. There are set of REST API defined that enables easy discovery of collections, metrics and dimensions
MySQL is used as metadata store as well as for application data store for UDP services

## 5. Installation

Follow these steps:
cd Projects/ (parent folder to Canvas folder)
ng new canvas (install skeleton via CLI)
cd canvas
npm install --save @angular/material
npm install --save hammerjs
npm install ng2-table –save
npm install ng2-bootstrap –save
npm install angular2-grid
Install PrimeNG & font awesome
Ensure packages.json shows something like:
"dependencies": {
  //...
  "primeng": "^2.0.3",
  "font-awesome": "^4.7.0"
},
Ensure angular-cli.json shows something like (omega or other theme):
    "../node_modules/font-awesome/css/font-awesome.css",
    "../node_modules/primeng/resources/themes/omega/theme.css" , 
    "../node_modules/primeng/resources/primeng.css"
sudo npm install vega
sudo npm install vega-lite

The following has to be done to get the system ready for users (it should be automated via a script):
Create Admin group.
Create a System user for us; not visible on frontend?
Create / Import System Reports.
Setup backend details, like url, etc.

Upgrades:
Versions matter.  Period.  

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

Prime: https://stackoverflow.com/questions/43258960/update-angular2-primeng-version-1-1-4-to-last-version
https://libraries.io/npm/primeng
Ng4: https://angular-update-guide.firebaseapp.com/
Change: template tags to ng-template ?
Error: angular 4 Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource
Solution: https://stackoverflow.com/questions/44046778/no-access-control-allow-origin-for-angular-cli-localhost4200


## 6. Frontend Menu 

The Canvas frontend is a SPA (Single Page Application) that presents one form to the user instead of several web pages.  This form has the following areas:
Main menu at the top, each with a drop-down sub-menu. 
Working space in the middle (where other forms are placed).  A table will be used to display several rows at once.
On occasion, a button bar will be displayed at the top of the working space.  Actions like Add, Edit, Delete form part of the table and not part of the button bar.

This is the startup form for the frontend:

There are lots of features built in:
Share dashboards with team members, mark your favourite dashboards
Schedule the dashboards as email reports daily/weekly/monthly
Export chart widgets as image or export the data in CSV format, ability to even obtain raw data for widget in CSV format
Compare data for two date ranges, allows to visualise the comparative performance for two time periods
Explore data allows to play with data and visualisations, very helpful for exploring the datasets without need to create widgets or dashboards
Business Alerting allows ability to define rules on metrics that will trigger alert, very useful to keep check of drastic drop/increase in any metric
Data extracts provides capability to get new dataset in the metric store by writing a SQL on top of granular data in the data warehouse
Custom drill-downs, conditional formatting, derived metrics etc. are the customised features that helps more with data visualisations


## 7. Login

On startup, the system will determine if the UserName was logged previously logged in, and simply provide the screen above if the case.
If the user has not logged in before, or previous credentials cannot be found, a login form will be presented.
The user cannot perform any work on the system until the login has been completed successfully.  In techno-speak: routes are guarded in Angular using AuthGuard.


## 8. Visualisation

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
