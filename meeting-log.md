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

**Date/Time:** March 9th, 2025

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

**Date/Time:** March 16th, 2025

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

**Date/Time:** March 19th, 2025

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
