# Event Planning Dashboard

A private, secure web dashboard for managing event planning tasks, budgets, timelines, and vendors. Built for Carrie's event planning workflow.

---

## What You Get

**A complete event management system with:**

- ✓ Secure login authentication
- ✓ Multiple events (click to open)
- ✓ Tabs for Run of Show, Budget, Tasks, Vendors
- ✓ Real-time editing (updates saved to database)
- ✓ One source of truth (no version conflicts)
- ✓ Private hosting on your own infrastructure

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    BROWSER                              │
│         dashboard.html (Login + UI)                     │
└─────────────┬───────────────────────────────────────────┘
              │ HTTP Requests (with JWT token)
┌─────────────▼───────────────────────────────────────────┐
│                   BACKEND API                           │
│              server.js (Node.js/Express)                │
│  • Authentication (login/JWT)                           │
│  • API endpoints (read/write events, tasks, budget)     │
│  • GitHub sync (TASKS.json)                             │
└─────────────┬───────────────────────────────────────────┘
              │ SQL Queries
┌─────────────▼───────────────────────────────────────────┐
│                  SQL SERVER                             │
│  • users • events • tasks • budget • vendors •timeline  │
└─────────────────────────────────────────────────────────┘
```

---

## Files Explained

### `package.json`
Lists all Node.js dependencies needed to run the backend.
```bash
npm install  # Installs everything listed here
npm start    # Starts the server
```

### `server.js`
The Express.js backend API. Runs on your server and handles:
- User login with password hashing (bcrypt)
- JWT authentication tokens
- API endpoints that the frontend calls
- SQL Server queries
- GitHub file syncing (optional)

**Endpoints provided:**
- `POST /api/login` - User authentication
- `GET /api/events` - List all events
- `GET /api/events/:eventId` - Get event details
- `PUT /api/tasks/:taskId` - Update task status
- `PUT /api/budget/:budgetId` - Update budget
- `PUT /api/vendors/:vendorId` - Update vendor
- `POST /api/sync-github/:eventId` - Sync from GitHub

### `schema.sql`
SQL Server database structure. Run this once to create all tables:
- `users` - Login accounts
- `events` - Event details
- `tasks` - Event tasks/checklist
- `budget_lines` - Budget items
- `vendors` - Vendor contacts
- `timeline_items` - Run of show schedule
- `sync_log` - GitHub sync history

### `dashboard.html`
The frontend that users see in their browser. Features:
- Login screen (username/password)
- Event list sidebar
- Event detail pages with tabs
- Click to update tasks, budget, vendors
- Displays real data from the database

### `.env.example`
Template for environment variables. Copy to `.env` and fill in your actual values:
```
PORT=3000
JWT_SECRET=your-secret-key
DB_SERVER=your-sql-server
DB_NAME=EventPlanning
DB_USER=sa
DB_PASSWORD=YourPassword123!
```

### `DEPLOYMENT.md`
Step-by-step guide for your contact to deploy the system.

---

## How It Works

### 1. User Logs In
```
Browser → dashboard.html shows login form
User enters username/password
→ Form sends to server.js /api/login endpoint
← Server hashes password, checks database
← Sends back JWT token (valid for 24 hours)
→ Browser stores token in localStorage
→ Dashboard appears with user's events
```

### 2. User Views an Event
```
Browser: User clicks on "Spring Fundraiser Gala"
→ Sends GET request to /api/events/:eventId (with JWT token)
← Server queries all data: tasks, budget, vendors, timeline
← Returns JSON with all event details
→ Dashboard renders the event with all tabs available
```

### 3. User Updates a Task
```
Browser: User clicks checkbox to mark task done
→ Sends PUT request to /api/tasks/:taskId with status='done'
← Server updates SQL Server database
← Returns success confirmation
→ Browser refreshes the task list
✓ Task marked as complete
```

### 4. GitHub Sync (Optional)
```
You push updates to TASKS.json in GitHub
→ Call /api/sync-github/:eventId endpoint
← Server fetches TASKS.json from GitHub
← Parses tasks and syncs to database
← All changes appear in the dashboard automatically
```

---

## For Your Contact

Your contact needs to:
1. Set up SQL Server database (run `schema.sql`)
2. Install Node.js dependencies (`npm install`)
3. Configure `.env` with database credentials
4. Start the server (`npm start`)
5. Point a web server to `dashboard.html`
6. Done. The app is live.

See `DEPLOYMENT.md` for detailed instructions.

---

## Security Notes

✓ **Passwords hashed** with bcrypt (one-way encryption)
✓ **JWT tokens** expire in 24 hours
✓ **HTTPS recommended** for production
✓ **Private database** on your own infrastructure
✓ **No third-party dependencies** for data storage
✓ **CORS enabled** to prevent cross-origin attacks

---

## Local Testing (Before Deployment)

Before handing off to your contact:

1. **Install Node.js** from nodejs.org
2. **Create a local SQL Server** (or use SQL Server Express, free)
3. **Run schema.sql** to create database
4. **Copy `.env.example` to `.env`** and update credentials
5. **Run `npm install`**
6. **Run `npm start`** (starts server on port 3000)
7. **Open `dashboard.html`** in browser at `http://localhost:3000/dashboard`
8. **Test login** with demo credentials (if you added them)
9. **Test creating/editing events**

---

## Adding Real Events

Once deployed, add events to the database:

```sql
INSERT INTO [events] 
  ([id], [name], [date], [location], [type], [status], [budget_total], [user_id])
VALUES 
  ('gala-2027-spring', 'Spring Fundraiser Gala', '2027-03-15', 'The Meadows Venue, Greensboro, NC', 'team', 'in-progress', 5300, 1);
```

Then the event appears in the dashboard's event list.

---

## Customization

### Change Login Style
Edit `dashboard.html` - look for `renderLoginScreen()` function

### Add More Tabs
Edit `renderEventDetail()` function in `dashboard.html` - add new `${currentTab === 'tab-name' ?` block

### Change Database Fields
Update `schema.sql` and add corresponding API endpoints to `server.js`

### Change API URL (if frontend/backend on different servers)
Edit `dashboard.html` line ~7:
```javascript
const API_URL = 'http://your-api-server:3000/api';
```

---

## Troubleshooting

**"Cannot connect to database"**
- Check SQL Server is running
- Verify credentials in `.env`
- Run `npm start` and check console for errors

**"Login failed"**
- Make sure you created a user in the database
- Check password hash is correct

**"API calls returning 401"**
- JWT token may have expired
- Refresh the page to get a new token

**"Frontend not connecting to API"**
- Check CORS settings in `server.js`
- Verify `API_URL` in `dashboard.html` points to correct server
- Check firewall allows port 3000

---

## Support

Questions? Check:
1. Console errors in browser (press F12)
2. Server logs (look at `npm start` output)
3. Database connection (test with SQL Server Management Studio)
4. `DEPLOYMENT.md` troubleshooting section

---

**Version:** 1.0.0  
**Built for:** Carrie Rogers  
**Last Updated:** September 2026
