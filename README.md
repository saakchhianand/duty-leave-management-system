🚀 Duty Leave Management System (DLMS)
A robust, multi-role web application designed to automate and verify student duty leave requests through a Triple-Check verification system.

📌 Project Overview
The DLMS streamlines the process of applying for and approving duty leaves. It ensures integrity by cross-referencing three data points:

Student: Submits the leave request with a reason and image proof.

Organiser: Uploads attendance logs from the actual event.

Mentor: Syncs classroom attendance to confirm the student's absence from class.

The Coordinator then uses a unified dashboard to reconcile this data and provide final approval.

🛠️ Tech Stack
Frontend: React.js (Vite), Context API, CSS3

Backend: Node.js, Express.js

Database: MySQL

Authentication: Custom Role-based Auth (Student, Mentor, Organiser, Coordinator)

📖 Features
Student: Apply for leave, upload image proof (posters/tickets), and track application status.

Organiser: Create/Publish events and upload event attendance via .xlsx or manual entry.

Mentor: Monitor section-specific requests and sync daily classroom attendance.

Coordinator: Master panel with bulk approval/rejection, section filtering, and real-time attendance reconciliation (P/A status).

⚙️ Setup Instructions
1. Prerequisites
Node.js installed

MySQL Server running

Git

2. Database Setup
Open your MySQL terminal.

Run the provided schema file to build the structure:

Bash
mysql -u root -p < dlms_db.sql
If you don't have the .sql file, refer to the table structures in the /database folder.

3. Backend Configuration
Navigate to the server directory:

Bash
cd server
Install dependencies:

Bash
npm install
Create a .env file in the server folder:

Code snippet
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=duty_leave_db
PORT=5000
Start the server:

Bash
node index.js
4. Frontend Configuration
Navigate to the root directory:

Bash
cd ..
npm install
Start the development server:

Bash
npm run dev
Open http://localhost:5173 in your browser.