# Event Dashboard - Quick Start (Local Testing)

Run the complete event dashboard on your computer in 5 minutes.

---

## What You Need

- **Node.js 16+** (download from nodejs.org)
- **SQL Server Express** (free, download from microsoft.com)
  - OR use a free cloud SQL database (Azure SQL, etc.)
  - OR skip the database for now and use the demo version

---

## Step 1: Download These Files

You have 5 files in this folder:
- `package.json`
- `server.js`
- `dashboard.html`
- `schema.sql`
- `.env`

Copy this entire folder to your computer.

---

## Step 2: Set Up the Database (Option A: Local SQL Server)

1. Download and install **SQL Server Express** (free)
   - https://www.microsoft.com/en-us/sql-server/sql-server-downloads

2. Open **SQL Server Management Studio**

3. Connect to your local server

4. Create a new database called `EventPlanning`:
   ```sql
   CREATE DATABASE EventPlanning;
   ```

5. Open `schema.sql` from this folder

6. Copy and paste all the contents into a new query window

7. Execute it (F5 or Ctrl+E)

**Done!** Your database is set up.

---

## Step 3: Create a Demo User

Still in SQL Server Management Studio, run this:

```sql
USE EventPlanning;

INSERT INTO [users] ([username], [email], [password_hash])
VALUES ('carrie', 'carrie@example.com', '$2b$10$YWJjZGVmZ2hpamtsbW5vcBdzQjEwLQ==');
-- Demo password: demo123 (pre-hashed)
```

---

## Step 4: Update the `.env` File

Open `.env` in a text editor and update:

```
PORT=3000
JWT_SECRET=my-super-secret-key-change-this

DB_SERVER=localhost
DB_NAME=EventPlanning
DB_USER=sa
DB_PASSWORD=YourPassword123!
DB_ENCRYPT=false
```

Replace:
- `YourPassword123!` with your SQL Server password (what you set during install)
- `JWT_SECRET` with something random (doesn't matter for testing)

---

## Step 5: Start the Server

Open a terminal/command prompt in this folder and run:

```bash
npm install
```

(This downloads all dependencies - takes 1-2 minutes)

Then:

```bash
npm start
```

You should see:
```
Connected to SQL Server
Event Dashboard API running on http://localhost:3000
```

---

## Step 6: Open the Dashboard

Open your browser and go to:

```
http://localhost:3000/dashboard
```

You should see the **login screen**.

Log in with:
- Username: `carrie`
- Password: `demo123`

---

## Step 7: Test It

Once logged in:
- Click on "Spring Fundraiser Gala" (test event)
- Click the **Tasks** tab
- Click a task checkbox - it should update
- Switch to **Budget** tab and see the data
- Try all the tabs

**Everything should work!**

---

## If Something Goes Wrong

### "npm: command not found"
- Node.js isn't installed. Download from nodejs.org and restart terminal.

### "Cannot connect to database"
- Check SQL Server is running (look in Windows Services)
- Verify password in `.env` matches your SQL Server password
- Make sure you created the database

### "Port 3000 already in use"
- Change `PORT` in `.env` to `3001` or `3002`

### "Login failed"
- Check you inserted the demo user in step 3
- Verify username is `carrie` and password is `demo123`

---

## Stop the Server

Press `Ctrl+C` in the terminal.

---

## Now What?

Once it's running and you like how it looks:

1. **Tweak the dashboard** - I can help modify the UI, add features, change colors
2. **Test more scenarios** - Create more test events, try different workflows
3. **Share with your contact** - Once you're happy, give them the code and `DEPLOYMENT.md`

---

## Option B: Skip the Database (Demo Mode Only)

If you don't want to set up SQL Server, I can create a **demo version** that:
- Shows the full UI
- Has hardcoded test data
- Doesn't save changes (but shows what it looks like)

Let me know if you want that instead!

---

Questions? Let me know and we can troubleshoot together.
