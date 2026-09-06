# Event Planning Dashboard — Deployment Guide

This guide walks you through deploying the Event Planning Dashboard on your infrastructure.

---

## **Prerequisites**

- SQL Server (Express or higher)
- Node.js 14+ (https://nodejs.org/)
- Git (for cloning the repo)
- A Windows server or local machine with internet access

---

## **Step 1: Clone the Repository**

git clone https://github.com/cmnordt-collab/Event-planning.git
cd Event-planning

---

## **Step 2: Set Up SQL Server Database**

1. Open SQL Server Management Studio (SSMS)
2. Connect to your SQL Server instance
3. Open a New Query window
4. Copy the entire contents of schema.sql
5. Paste into the query window and execute (F5)
6. Wait for all tables to be created

Result: You now have a database called EventPlanningDashboard with all required tables.

---

## **Step 3: Configure Environment Variables**

1. In the project folder, create a new file named .env
2. Copy the contents of .env.example into it
3. Update the values with your actual credentials:

PORT=3000
NODE_ENV=production

JWT_SECRET=ChooseAStrongRandomSecretHere

DB_SERVER=your-server-name-or-ip
DB_NAME=EventPlanningDashboard
DB_USER=sa
DB_PASSWORD=your-sql-server-password

Save the file.

---

## **Step 4: Install Node.js Dependencies**

npm install

This downloads all required packages (express, mssql, bcrypt, etc.).

---

## **Step 5: Start the Server**

npm start

You should see:
Connected to SQL Server
Server running on port 3000

---

## **Step 6: Access the Dashboard**

**Local Testing:**
- Open browser: http://localhost:3000/dashboard
- Login with:
  - Username: carrie
  - Password: demo123

**From Another Computer:**
- Replace localhost with your server's IP address
- Example: http://192.168.1.100:3000/dashboard

---

## **Step 7: Deploy to Production (Optional)**

### **Using IIS (Windows Server)**

1. Install IIS Hosting Bundle for Node.js
2. Create an IIS application pointing to this folder
3. Configure URL rewrite to route traffic to Node.js

### **Using PM2 (Process Manager)**

Keep the server running in the background:

npm install -g pm2
pm2 start server.js --name "event-dashboard"
pm2 startup
pm2 save

---

## **Step 8: Add Users to the Database**

The database comes with one demo user (carrie / demo123).

To add more users, run this SQL query in SSMS:

INSERT INTO users (username, password_hash, email) 
VALUES ('newuser', 'hashed_password_here', 'user@example.com');

Note: Passwords must be bcrypt-hashed. Use this Node.js script to generate a hash:

node -e "const bcrypt = require('bcrypt'); bcrypt.hash('password123', 10, (err, hash) => console.log(hash));"

---

## **Troubleshooting**

### **"Cannot connect to SQL Server"**
- Verify SQL Server is running
- Check DB_SERVER, DB_USER, DB_PASSWORD in .env
- Ensure SQL Server allows TCP/IP connections (SQL Server Configuration Manager)

### **"Port 3000 already in use"**
- Change PORT in .env to a different number (e.g., 3001)
- Or stop the other process using port 3000

### **"npm install fails"**
- Ensure Node.js is installed: node --version
- Delete node_modules folder and try again
- Run: npm cache clean --force then npm install

---

## **File Structure**

Event-planning/
├── server.js              # Express backend API
├── dashboard-demo.html    # Standalone demo (GitHub Pages)
├── dashboard-editable.html # Production dashboard (backend-connected)
├── package.json          # Node.js dependencies
├── schema.sql            # Database schema
├── .env.example          # Environment template
├── DEPLOYMENT.md         # This file
└── README-DASHBOARD.md   # Architecture overview

---

## **Next Steps**

1. Test locally on your machine
2. Customize events, tasks, budget categories for your needs
3. Train team members on dashboard use
4. Deploy to production server when ready

---

## **Support**

For questions, refer to:
- README-DASHBOARD.md — Architecture & features
- QUICKSTART.md — Local development setup
- CLAUDE.md — Project brief & conventions
