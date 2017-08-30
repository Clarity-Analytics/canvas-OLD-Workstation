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
 




##  Points for discussion: whether to include in the system or not ?
* What Vega graph types to include?
* How and should we stream real-time data?
* Should we keep the password?  If so, add code for it.
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
