# Meeting 1
**Date/Time:** 02/08/2025 @ 4:00 PM

**Location:** Zoom

**Objective:** Establish scope and beginning tasks

**Team Members:** Anya, Pashia, Hunter, Alejandro, Marco

**Tasks Allocated:**
- Github creation: Anya
- - Usernames: alesan99, combs-a, pashiav, hwolong, iwantexpresso
- Github profiles: Each person is responsible for their own profile

**Meeting Summary:**
We decided on team roles, team name (Orchid), our vision and scope statements, and discussed tasks for the first project milestone.

**Tasks Completed:**
Role decisions:
- Anya – Project Lead, QA Lead
- Pashia – Front-End Developer
- Hunter – Database Implementer
- Marco – Front-End Developer
- Alejandro – Database Designer

Vision Statement: We are developing this library database to facilitate the easy management of a library.

Scope Statement:
- Items 
- - Example items supported are: Books, Movies/TV, audiobooks, video games, and music
- - Different types of membership accounts
- - Staff, child, teenager, adult, senior
- Each account will have different borrowing, fee structures, and content restrictions
- Reserving items
- Making queries and reports
- A simple front-end user interface using Netlify

**Next Meeting Discussion Points:**
- Programming languages and DBMS to be used
- Expanding on the conceptual model

# Meeting 2
**Date/Time:** February 11th, 2025 @ 2:00 PM

**Location:** LEEP IHAWKe Student Lounge

**Objective:** Clarification of scope and brainstorming

**Team Members:** Anya, Pashia, Hunter, Alejandro, Marco

**Tasks Allocated:**

Anya: Contact professor for questions, label vision in README, create formal scope statement
- Ask submission rules and if we can use phpMyAdmin

Pashia: Research if phpMyAdmin is inter-OS

**Meeting Summary:**

Discussion about what to use for backend:
- phpMyAdmin, managing the database
- - Need to do research for inter-OS interactions
- Live website, sign-in will be the library card number

SQLite for an offline database was discussed briefly, but we decided on having it online.

GitHub will be used to manage tasks and issues. An example database will be uploaded for a static demonstration.

**Tasks Completed:**
- Github has been created
- Github profiles have been completed

**Next Meeting:**
Requirements engineering – outlining functional requirements formally. 

# Meeting 3
**Date/Time:** February 23rd, 2025 @ 4:00 PM

**Location:** Zoom/Discord

**Objective:** Requirements engineering discussion and formalization

**Team Members:** Anya Combs, Alejandro Sandoval, Marco Martinez, Hunter Long, Pashia Vang

**Tasks Allocated:**

This work should be completed by Wednesday, February 26th. This is so that it can be sent to a TA for review before final submission.
- Anya: Complete the functional requirements section. Edit and formalize the requirements specifications document
- Marco: Complete the account data entities
- Hunter: Complete the items data entities section
- Alejandro: Complete the loans and reservations data entities section
- Pashia: Complete the introduction and stakeholders sections

Non-time critical tasks:

- Anya will create the Discord.
- Once the EECS cycle server accounts are passed out, Marco and Alejandro will create the initial database and connection to phpMyAdmin, and Pashia will provide support if needed.

**Notes:**

We discussed the requirements specifications and formalized definitions for various parts of the projects. We assigned work for the document to each person.

We made the decision to move to Discord, as Zoom has a 40-minute time limit on its meetings. Switching to Discord will make it easier to have longer meetings 

**Tasks Completed:**

Professor was asked the questions.
- Submission rules: Project Lead is the only person who submits the project work.
- phpMyAdmin: Can be used as long as there’s a deliverable on the Github as well

# Meeting 4

**Date/Time:** March 9th, 2025 @ 4:00 PM

**Location:** Discord

**Objective:** Assign tasks for Project Part 3

**Team Members:** Anya Combs, Marco Martinez, Pashia Vang, Hunter Long, Alejandro Sandoval

**Tasks Allocated:**

- Anya: Create the drawio diagram to share via Google Drive and the conceptual modeling document

Notes:

For the ER diagram, we will use drawio. It saves to Google Drive, which allows all people to access the ER diagram and work on it. Since it’s midterms week, we expect to finish it closer to the end of the week.

When people are free they can let the team know that they’re free in the Discord to be assigned a task.

Scheduled a meeting for next week on Sunday, 4 PM to go over the ER diagram and finalize changes.

Tasks Completed:

- All tasks assigned from last week completed.

# Meeting 5

**Date/Time:** March 16th, 2025 @ 4:00 PM

**Location:** Discord

**Objective:** Discuss what needs to be completed for Project Part 3

**Team Members:** Anya Combs, Pashia Vang, Alejandro Sandoval, Marco Martinez, Hunter Long

**Tasks Allocated:**

- Everyone must complete their sections of Project Part 3.
- Anya: Review the document.

**Notes:**

Over the week, we assigned each team member to a section of the Conceptual Database document in the Discord. We met to check the progress before the submission deadline. The majority of the document was complete by the time of this meeting, with review needed.

We will meet to discuss Project Part 4 and potential needed changes to the database on Wednesday afternoon.

**Tasks Completed:**

- Anya created the document and drawio.

# Meeting 6

**Date/Time:** March 19th, 2025 @ 4:00 PM

**Location:** Discord

**Objective:** Discuss changes to the ER diagram

**Team Members:** Anya Combs, Marco Martinez, Pashia Vang, Hunter Long, 

**Tasks Allocated:**

- Anya: Document creation for Part 4

**Notes:**

We discussed potential updates to the database schema.
- Contributor (including Authors from the Book specialization): First and Last name, ID
  - There may be a Contributors table to allow for multiple creators to be credited?
  - If above is too difficult, fall back on a single primary creator
- Additional fields for items:
  - Descriptions
  - Quantity
  - Number of reservations
  - Available
- Specific relations for the Staff specialization need to be captured
  - Manages items
  - Manages other users
- Changes to the user attributes
  - First Name, Middle Initial, Last Initial

The Conceptual Model should be updated before work on the relational schema is started.

**Tasks Completed:**

- Project Part 3 was completed and turned in on-time.

# Meeting 7

**Date/Time:** March 30th, 2025 @ 4:00 PM

**Location:** Discord

**Objective:** Discuss the logical model and create a roadmap for the finished database

**Team Members:** Anya Combs, Marco Martinez-Reyez, Pashia Vang, Alejandro Sandoval, Hunter Long

**Tasks Allocated:**

- Anya: Review and edit the logical model document and add the connections in the diagram.
- Anya: Adding in the new entities/relations to represent picklists to older documents
- Anya: Send the draft of part 4 for review to a TA
- Everyone: Install the KU Anywhere VPN in order to work on the database and complete their section of the database implementation
- Marco: UI Wireframe
- Hunter: Sample Records

**Notes:**

While we did not meet in call for the past few weeks due to scheduling conflicts, we discussed the logical model in the Discord channel and allocated tasks to complete it.

There were a few considerations that needed to be added, such as:
- Picklists (Account Roles, Contributor Roles, Genres, Ratings)
- Potential audit logs (For restriction updates, etc.) as a new optional requirement
- Timestamp created/timestamp modified fields
- Library Card Number needs to be added to accounts

Team members should install the KU Anywhere VPN to access the database.

We also decided on due dates for each section of the final database, so that we could be sure that we would be on-time with the completion.
- Database completion (April 6th)
  - Each person will create their own SQL tables.
  - It will be hosted on Pashia's EECS database server.
- Sample Records (April 10th)
- Default SQL queries (April 13th)
  - Each person will manage their own default SQL queries for updating database records, etc.
- UI Wireframe (April 13th)
- Report implementation (?)
- Refinement will take place from the 20th to the 27th.

Some concerns are with everyone logging into the database at the same time using the same credentials. On trial, Marco had issues logging in while Pashia was logged in, but otherwise no issues with multiple people being on the same account at the same time.

Meeting at some point next week; tentative Sunday meeting in the evening. If not then, then Tuesday afternoon after class or later in the day as a check-in.

**Tasks Completed:**

- All updates to the schema were added.
- Majority of Project Part 4 was completed.

# Meeting 8

**Date/Time:** April 13th, 2025 @ 4:00 PM

**Location:** Discord

**Objective:** Discuss the necessary pages and check-in

**Team Members:** Anya Combs, Marco Martinez-Reyez, Pashia Vang, Alejandro Sandoval, Hunter Long

**Tasks Allocated:**
- Hunter and Alejandro: Complete inserting tables, create sample data
- Marco: Wireframe by Monday, if not finished then Pashia will set it up
- Anya: Update documents, create Project Part 5 documents
- Frontend should be complete by 23rd latest to ensure thorough testing.

**Notes:**

We noted down all the necessary pages and features.

Necessary pages:
- Login page
- Account page
  - Account details
  - Loan history
  - Reservations
  - Settings?
- Search and results page
  - Item dropdown
  - Loan

**Tasks Completed:**
- Pashia, Marco and Anya completed table insertion
- Logical model was turned in on time
