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
