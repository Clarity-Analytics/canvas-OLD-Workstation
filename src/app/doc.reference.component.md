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
