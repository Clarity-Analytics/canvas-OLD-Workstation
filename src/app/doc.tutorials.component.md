# Tutorials for Canvas

Tutorials are a series of steps that take the reader by hand through the completion
of a small project.  It is aimed at learning by doing, helps the user to get started and
build confidence.  After each tutorial there should be an immediate sense of achievement.
The tutorials do not provide abstractions and explanations.

## Table of Content

1. Installing / running Canvas, Overlay and Eazl

Canvas
2. Log in and open a Dashboard
3. See your preferences
4. Manipulate widgets on a Dashboard
5. Change (edit) a text box widget
6. Add a new bar chart widget (using sample data)
7. Add a new table widget (using sample data)
8. Collaborate about a Dashboard
9. See all notifications (messages) about a Dashboard
10. Add a user
11. Delete a user
12. See all Datasources
13. Give a user access to a Datasource
14. Create a group
15. Add a user to a group
16. See the reports available for a Datasource
17. See your profile
18. After adding your own Datasource, add a pie chart widget for it
19. 

Overlay
20. Add a new Datasources / packages (sample data)
21. Add Reports / queries (sample data)
22. Manage scheduled tasks in Overlay
23. Add your own Datasource
24. Add your own Report

Eazl
25. How to start the Django console
26. How to connect to the REST API from the command line

...

# 26. How to connect to the REST API from the command line

**cURL**

 curl -s -H "Content-Type: application/json" 
      -X POST 
      -d '{"username":"admin","password":"canvas100*"}' localhost:8000/api/auth-token/

 curl -X GET 
      -H 'Authorization: Token a06cde11c930393b73e04278daa21c68f06aa875' 
      localhost:8000/api/users/

The -H is for headers, -X is the verb and -d is the payload.


**httpie**

  http POST :8000/api/auth-token/ username=admin password=canvas100*
  http GET :8000/api/users/ Authorization:'Token 
               a06cde11c930393b73e04278daa21c68f06aa875'
               
  Append ‘ > filename’ without the quotes to pipe the result to a file.

A \ character the end of a line will give a shell continue more commands, making it slightly easier to read.



___

# MD cheatsheet

Things you'll need:

* [node](https://nodejs.org)
* [markdown-it](https://www.npmjs.com/package/markdown-it)
* [tasks.json](/docs/editor/tasks)

## Section Title

> This block quote is here for your information.