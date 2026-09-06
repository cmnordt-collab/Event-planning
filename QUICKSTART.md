# Event Planning Dashboard — Quick Start Guide

Get the dashboard running locally on your computer in 5 minutes.

---

## **What You'll Need**

- Node.js 14+ (download from https://nodejs.org/)
- SQL Server Express (download from https://www.microsoft.com/en-us/sql-server/sql-server-express)
- This repository cloned or downloaded

---

## **Step 1: Install Node.js**

1. Go to https://nodejs.org/
2. Download the LTS version
3. Run the installer, accept defaults
4. Restart your computer
5. Verify installation:

Open Terminal/Command Prompt and run:
node --version
npm --version

You should see version numbers. If you get "command not found", restart your computer.

---

## **Step 2: Install SQL Server Express**

1. Go to https://www.microsoft.com/en-us/sql-server/sql-server-express
2. Download SQL Server Express
3. Run installer
4. Choose "Basic" installation (easiest)
5. Accept defaults
6. Note the instance name (usually "SQLEXPRESS")

---

## **Step 3: Create the Database**

1. After SQL Server installs, open SQL Server Management Studio (SSMS)
   - Search for "SQL Server Management Studio" in Windows Start menu
2. In the connection dialog:
   - Server name: localhost\SQLEXPRESS
   - Authentication: Windows Authentication
   - Click Connect
3. Right-click on "Databases" → New Database
4. Name: EventPlanningDashboard
5. Click OK
6. Expand Databases → EventPlanningDashboard
7. Right-click, select "New Query"
8. Open schema.sql from this repository
9. Copy all the SQL code
10. Paste into the query window
11. Click Execute (F5)

Wait for all tables to be created. You should see "Command(s) completed successfully."

---

## **Step 4: Clone the Repository**

Open Terminal/Command Prompt and run:

git clone https://github.com/cmnordt-collab/Event-planning.git
cd Event-planning

(If you don't have Git, just download the repository as a ZIP file and extract it)

---

## **Step 5: Create .env File**

1. In the Event-planning folder, create a new file named .env
2. Copy the contents of .env.example
3. Replace the values:

PORT=3000
NODE_ENV=development

JWT_SECRET=MyTestSecretKey123

DB_SERVER=localhost\SQLEXPRESS
DB_NAME=EventPlanningDashboard
DB_USER=sa
DB_PASSWORD=YourSQLServerPassword

Replace "YourSQLServerPassword" with the password you set during SQL Server installation.

4. Save the file

---

## **Step 6: Install Dependencies**

In Terminal/Command Prompt (in the Event-planning folder), run:

npm install

This downloads all the packages. Wait for it to finish (1-2 minutes).

---

## **Step 7: Start the Server**

Still in Terminal/Command Prompt, run:

npm start

You should see:
Connected to SQL Server
Server running on port 3000

Leave this window open. The server stays running.

---

## **Step 8: Open the Dashboard**

Open your web browser and go to:

http://localhost:3000/dashboard

You should see the login screen.

Login with:
Username: carrie
Password: demo123

---

## **Step 9: Explore the Dashboard**

- Click on "Spring Fundraiser Gala" event
- Try each tab: Overview, Planning Timeline, Run of Show, Budget, Tasks, Vendors
- Click "Edit" on any item to test inline editing
- Changes save to the database instantly

---

## **Troubleshooting**

### **"Cannot connect to SQL Server"**

Make sure:
- SQL Server is running (check Services in Windows)
- DB_SERVER in .env matches your SQL Server instance name
- DB_PASSWORD is correct
- Database "EventPlanningDashboard" exists

### **"Port 3000 already in use"**

Change PORT in .env to 3001 or another number, save, and restart npm start

### **"Cannot find module 'mssql'"**

Run:
npm install

Again, make sure it completes without errors.

### **"npm: command not found"**

Node.js not installed. Go back to Step 1 and restart your computer after installing.

### **Dashboard shows but login fails**

- Verify schema.sql was executed (check in SSMS that tables exist)
- Verify .env values are correct
- Check that SQL Server is running

---

## **Stop the Server**

Press Ctrl+C in the Terminal window where npm start is running.

---

## **Next Time You Use It**

1. Open Terminal/Command Prompt
2. Navigate to Event-planning folder:

cd Event-planning

3. Run:

npm start

4. Open browser to http://localhost:3000/dashboard

---

## **Need Help?**

Check these files:
- README-DASHBOARD.md — What the dashboard does
- DEPLOYMENT.md — Production setup
- CLAUDE.md — Project details

---

## **When You're Ready for Production**

Follow DEPLOYMENT.md for setting up on a real server with proper hosting.

Happy planning!
