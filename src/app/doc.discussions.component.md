# Discussions for Canvas

This document aims to to enhance understanding of the product with explanations that clarify and illuminate a particular topic.  It gives context, provides an explaining why,
use multiple examples, and alternative approaches while making connections between different
aspects of the system.

## Table of Content

1. Basic philospophy 
2. The flow / steps in creating a report
3. The actions when running a report
4. Why some reports take longer / async processing
5. How a deleted a user is treated
6. Audit information kept by the system
7. Explain datastructures in Canvas (ER in words)
8. Different types and uses of a Dashboard
9. Dashboard design principles
10. Problem solving / fault finding
11. Technology and software used
12. Design limits
13. Passwords

## 1. Basic philospophy 

The goal is to make any required information available easily.  That is a tall order by any standard.  In order to achieve this, we have created two components that can interact with your existing environment:
* backend: a server that runs in the background, connects to the required datasource (database or file) and makes the data available.
* frontend: a web page that links to the backend, and can show (visualise) the data, either as a tabular report or in graphical format.

It is possible to mix and match the above with your existing environment.  The following products can link to the backend:
* Power BI
* Excel
* Python programming language
* R programming language
* Javascript programming language
* Typescript programming language
* Jupyter Notebook (popular with data scientists)

The frontend can connect to any dataprovider that use a REST API (technical term for a general way to obtain data from servers).

In order to make as many datasources available as possible, the following are supported:
* Microsoft SQL
* Mongo DB
* MySQL
* SQLite
* Postgress
* text files
* Excel files

The ability for a programming language to connect to the backend makes the solution very powerful: one can integrate the data from the backend with existing solutions, perform any possible data manipulation and use existing data libraries (like Pandas, Numpy, D3, Matplotlib, etc).


## 2. The flow / steps in creating a report
// TODO - Bradley to confirm ...
Lets assume we want to create a simple report that show a list in tabular format.  And lets also assume that the data is available in a database supported by the backend.  The following steps are involved:
* create a connection string to the datasource
* create a SQL string to extract the data from the database; this is a query string
* create a query (report) definition in the backend
* create a Dashboard on the frontend
* create a Widget on the frontend that points to the report (query)


## 3. The actions when running a report
// TODO - refine !!!
A report can be run on demand (ad hoc) or it can be scheduled.  A report is run when the Widget that displays it is refreshed.  Widgets can be set to refresh when they are displayed, on demand or recurring (say every 20 seconds).  

## 4. Why some reports take longer / async processing
All reports are run asynchronisely.  This simply means that the frontend issues the request for the data to the backend, and then continues without waiting for the answer.  Once the backend has retrieved the data, it stores the result set and then sends a message to the frontend to let it know.  If the user is signed on, a message (growl) will popup to notify the user that the results of the report is ready. 

The user can retrieve the results by opening the Widget based on it, which will obtain the data from the result set.

Unless specified specifically, the result set will be deleted within a set time.  This time is a system parameter that can be set by the user.  For as long as the result set remains available, the Widget will refresh immediately as it does not have to run the extraction process again from the database.  Caution should be taken not to let result sets get stale unnecessarily, as updates to the database will not be reflected.


## 5. How a deleted a user is treated

After a user is created, the record is written to the database.  Deleting a user depends on whether he has been active in the system.  If this user has not had any activity, for example not logged in or run any reports, the record will physically be deleted.  This caters for the situation where a user was entered in error.  However, if the user has logged in at least once, the record cannot be deleted.  The record can only be made inactive.  This way the log and history for the user is kept indefinately.


## 6. Audit information kept by the system
// TODO - finalise


## 7. Explain datastructures in Canvas (ER in words)

Canvas keeps a list of valid users that may use the system.  Associated information is username, admin user or not, date created and so on.  A list of groups are also kept.  A user can belong to zero or many groups, and a group can have zero or many users.  Groups are flat: a group cannot belong to another group.

Canvas also keeps the following:
* Datasources (created in the backend)
* Reports (created in the backend)
* Dashboards
* Widgets

The Dashboard is the canvas on which information is displayed, and the Widget is the presentation of data.  This can be a tabular report, text, image or a graph.  Each Dashboard can contain zero or more Widgets.

The creator of a Dashboard is the owner, and at that point in time the Dashboard is only visible and accessable by the owner.  The Owner can however assign permissions to other users.  Permissioning states the specific actions that another user may perform to the Dashboard.


## 8. Different types and uses of a Dashboard

A Dashboard is just a blank canvas where information can be used.  Think of it as a blank Excel workbook.  Each Dashboard can have one or more tabs, similar to worksheets in Excel.  Each tab can contain one or more Widgets; similar to a tables and graphs on an Excel worksheet.

One use of a Dashboard is to show monthly management accounts.  Another can be a single report.  Or ....  // TODO

// TODO - show examples (fancy ones too !!!)


## 9. Dashboard design principles

Canvas provides for both reports or dashboard.  These could be produced in an automated fashion or ad hoc on request.  Automated or scheduled reports improves productivity since the user dont have to run it, and can provide the required information in a timely fashion.  For example, it can produce the information about the performance of different departments on a daily or weekly basis.  It could also be triggered by an event, typically used for exception reporting.  For example, it will alert business that a certain level has been reached that requires action.

We make no distinction between reporting and business intelligence.  Most often, a report provides a view on historic information - what has happened or what is the status.  The format is usually static.  In contrast, a dashboard summarises information from different sources to help make proactive decisions.  The different sources may be from different systems inside the company, or it may be external sources.  Dashboards allows to user to slice and dice the information, answering questions as the data is consumed.  Dashboards are also better at telling stories, telling why something happened, discover new relationships and possibilities.  In both cases, the ultimate goal is to better understand your business and enhance decisions based on data.

Building an effective dashboard is no different from building a report: it needs a clear goal and requirements, and has to be cognisent about the data.  Often the required data is not availalbe, or incomplete and dirty at best.

In designing your dashboard, consider the following:
* quick to understand the information
It should take a few seconds to observe and understand the relevant information.  It is thus aimed at answering the frequently asked business questions at a glance, and not intended to provide all the detail on all the information.  
* pyramid of relevant information 
Display the most relevant information on the top part of the dashboard, trends in the middle, and lower level details towards the bottom.  This is similar to the layout of a newpaper report.
* simplify (less is more)
The dashboard must be simple to understand, irrespective of the complexity of the data or the business.  Guard against craming in too much information: it should contain no more than 7+-2 visualisations, which is easy to comprehend.  An effective technical is to use filters, hierarchies and drill down to reduce clutter.
* tell a story
The dashboard must relate to the context of the business, and address the user's questions. 
* honest
The layout and data visualisations used must express the meaning of the data accurately, and help the user to make the correct conclusions.
* type of data visualization
The appropriate data visualization must be chosen fit for purpose.  The following purposes of the information must be considered: relationship (between data sets), comparison, composition, and distribution.


## 10. Problem solving / fault finding

## 11. Technology and software used

## 12. Design limits

## 13. Passwords

The passwords of users are stored in the backend database, but encrypted.  This means that it is not human readable, and will never be displayed.  It is possible to change one's own password.  If a user has admin rights, he can change the password of any user.

##  Points for discussion: whether to include in the system or not ?
* What Vega graph types to include?
* How and should we stream real-time data?
* How should we do drill-down - to see more detail?
* How do we activate the hyperlink to another tab or widget?
* How and where do we keep data quality info?
* Do we have complete colour schemes, like PrimeNG or just some colour options?
* How do we link (select) dashboard and widget on a message?  And how to open it from message?
* How to send messages to Groups, and where is it unfolded into individual users?
* How to mark a whole filtered table / list of messages as read or unread
* Should we keep some blank fields that the user can customise (ie per User record)?
* How to make current access work easily per user AND group?
* Where does admin reset user password?
* Where is scheduling of reports done - form, flow, results, etc?
* Do we have a group called Everyone?
* How are Datasource and Report parameters entered and managed and shown in dropdown?
* How do we work with Datasource versions, can we show changes / delta?
* How to we create Datasources and Reports easily in canvas?
* How do we easily import data from a web url or Excel or file etc?
* How do we import / export Datasource and Report definitions?
* How and where is sorting done?  Overlay?
* How do we manage versioning on Reports, and make sure we always get the latest?
* How is the meta-data per Datasource or Report shown?
* Are we going to work with report bundles concept at all?
* There a Many system reports - how and where are they created?
* How can a user sample data easliy - just see the top 10 rows of many?
* How will it work for other software to link to Overlay?
* What do we have to make takon easier - load users from HR report or db?
* Can users do actions on Datasources and Reports, ie Join or Union?
* What functions will make sense on a cell phone, given the size of the form?
* How will central logging and feedback be done?
* To what extent will we allow / make available white labelling?


## Design / Technical aspects to resolve
* How to Deploy (& Build)
* How to create and work with Environments (to do Dev and Test)
* How to test the software on different OSs (ie Windows, Arch) and different versions
* How to make a slideshow - view only dashboard
* How to integrate to PowerPoint
* How to print a Dashboard / Widget
* How limited rows per graph, with Additional row (the rest)?
* Where to do aggregation: SQL, overlay, vega, canvas?
* How to import / export graphs (json <-> vega )
* How is startup DB populated, and what is in it (ie admin users, etc)
* How is central error logging and bubbling done?
