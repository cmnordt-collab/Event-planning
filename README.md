# Event Planning Dashboard — Complete Architecture Guide

A reusable, private web dashboard for managing events. Works for solo planners, team-led events, or consultant projects.

---

## **What It Does**

The dashboard gives you one central place to:
- **Plan** events with detailed timelines and checklists
- **Track** budgets with real-time variance alerts
- **Manage** tasks with priority and ownership
- **Coordinate** vendors, their contacts, and contract status
- **View** everything in one private dashboard (no public sharing)

---

## **Two Versions**

### **1. Demo Version** (`dashboard-demo.html`)
- **Purpose:** Show prospects what they're buying
- **Access:** No login, no backend needed
- **URL:** GitHub Pages (works from browser)
- **Data:** Hardcoded test events
- **Editing:** Changes happen in-session only (don't save)
- **Share With:** Chatham Pride, West End, Lavender Social Collective, etc.

### **2. Production Version** (`dashboard-editable.html`)
- **Purpose:** Real event planning with persistent data
- **Access:** Username/password login with JWT auth
- **Backend:** Node.js/Express API
- **Database:** SQL Server
- **Data:** Saved permanently
- **Editing:** All changes persist to database
- **Hosting:** Your infrastructure

---

## **Architecture**

┌─────────────────────────────────────────────┐
│         Web Browser                         │
│  ┌──────────────────────────────────────┐   │
│  │ dashboard-editable.html (Frontend)   │   │
│  │ - Login screen                       │   │
│  │ - Event selector                     │   │
│  │ - Planning Timeline tab              │   │
│  │ - Run of Show tab                    │   │
│  │ - Budget tab                         │   │
│  │ - Tasks tab                          │   │
│  │ - Vendors tab                        │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
            ↓ HTTP/REST API
┌─────────────────────────────────────────────┐
│         Node.js Server (server.js)          │
│ ┌───────────────────────────────────────┐   │
│ │ Express Routes                        │   │
│ │ - POST /api/login                     │   │
│ │ - GET /api/events                     │   │
│ │ - GET /api/events/:id                 │   │
│ │ - PUT /api/tasks/:id                  │   │
│ │ - PUT /api/budget/:id                 │   │
│ │ - PUT /api/vendors/:id                │   │
│ │ - PUT /api/timeline/:id               │   │
│ └───────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
            ↓ SQL Queries
┌─────────────────────────────────────────────┐
│    SQL Server Database                      │
│ ┌───────────────────────────────────────┐   │
│ │ Tables:                               │   │
│ │ - users (login credentials)           │   │
│ │ - events (event metadata)             │   │
│ │ - tasks (event tasks)                 │   │
│ │ - budget_lines (budget items)         │   │
│ │ - vendors (vendor contacts)           │   │
│ │ - timeline_items (run-of-show)        │   │
│ │ - planning_timeline (pre-event)       │   │
│ └───────────────────────────────────────┘   │
└─────────────────────────────────────────────┘

---

## **Key Features**

### **Planning Timeline Tab**
- Week-by-week breakdown (e.g., "Aug 17-23", "Aug 24-26")
- Hard deadlines and focus areas for each week
- Status tracking (Pending, In Progress, Done)
- Fully editable in-dashboard

### **Run of Show Tab**
- Minute-by-minute event timeline
- Activity, time, owner, and notes for each item
- Sequence ordering
- Editable for day-of adjustments

### **Budget Tab**
- Category-by-category breakdown
- Budgeted vs. Actual tracking
- Variance calculation (remaining funds)
- Status: On Track, Over Budget, In-Kind

### **Tasks Tab**
- Task title, status, priority, due date, owner
- Color-coded by priority (High = red, Medium = default)
- Status badges (Pending, In Progress, Done)
- Full edit capability

### **Vendors Tab**
- Vendor name, service type, phone, email
- Contract status (Pending, Confirmed, Completed)
- Quick contact access
- Track vendor confirmations

### **Overview Tab**
- Budget snapshot ($X of $Y)
- Tasks snapshot (X/Y complete, % done)
- Vendor count & confirmations at a glance

---

## **Technology Stack**

Frontend: HTML/CSS/JavaScript (Tailwind) — User interface, no framework needed
Backend: Node.js + Express — REST API server
Database: SQL Server — Persistent data storage
Authentication: JWT + bcrypt — Secure login & session management
Hosting: Your infrastructure — Full control, no third-party dependencies

---

## **Data Flow (Example: Editing a Task)**

1. User clicks "Edit" on a task in the dashboard
2. Form appears with current task data
3. User updates title, status, priority, etc.
4. User clicks "Save"
5. Frontend sends PUT request to /api/tasks/:id
6. Backend validates JWT token for security
7. Backend updates SQL Server database
8. Response returns to frontend
9. Dashboard re-renders with new data

All changes persist automatically.

---

## **Security Features**

- JWT Tokens: 24-hour expiration, invalidates on logout
- Password Hashing: bcrypt (10 rounds) — passwords never stored in plain text
- CORS Protection: Frontend and backend on same domain
- SQL Injection Prevention: Parameterized queries throughout
- Private Events: Users only see their own events

---

## **Customization Guide**

### **Add a New Tab**
1. Add tab name to the tab list (e.g., 'my-new-tab')
2. Create a new render function in dashboard-editable.html
3. Add a new SQL table if you need to store new data

### **Change Colors**
Edit the Tailwind classes in dashboard-editable.html to use different color schemes.

### **Add a New Field to Tasks**
1. Add column to tasks table in schema.sql
2. Update renderTasks() function to show the new field
3. Update saveTaskItem() API call to include new field
4. Update /api/tasks/:id endpoint in server.js

### **Change the Event List**
Edit the left sidebar in renderDashboard() to customize what displays in the event list.

---

## **Limitations & Future Roadmap**

### **Current Limitations**
- Single-user per account (no team collaboration yet)
- No mobile-responsive design (desktop-first)
- No file uploads for contracts/receipts
- No email notifications

### **Phase 2 (Future)**
- Multi-user team management
- Email reminders for tasks & deadlines
- Photo/file attachments
- Approval workflows for budget/vendor changes

### **Phase 3 (Future)**
- Mobile app version
- Calendar integration (Google Calendar sync)
- PDF export for run-of-show & budgets
- Report generation & analytics

---

## **File Reference**

dashboard-demo.html — Standalone demo for prospects (GitHub Pages)
dashboard-editable.html — Production dashboard (backend-connected)
server.js — Express backend API with database endpoints
package.json — Node.js dependencies (npm install)
schema.sql — SQL Server database tables & indexes
.env.example — Environment variables template
DEPLOYMENT.md — Step-by-step deployment guide
QUICKSTART.md — Local development setup
CLAUDE.md — Project brief & conventions

---

## **Troubleshooting**

### **Dashboard loads but shows "Error loading event"**
- Check browser console (F12) for error messages
- Verify backend is running: npm start
- Check JWT token in localStorage (Devtools → Application → Storage)

### **Changes don't save**
- Verify backend API is responding: http://localhost:3000/api/health
- Check network tab in DevTools for failed requests
- Verify SQL Server database connection (see DEPLOYMENT.md)

### **Login fails**
- Verify user exists in database: SELECT * FROM users
- Check bcrypt hash is correct (password must be hashed)
- Verify .env JWT_SECRET matches server setup

---

## **Next Steps**

1. Deploy locally using QUICKSTART.md
2. Test all tabs with sample data
3. Share demo version with prospects
4. Deploy to production using DEPLOYMENT.md
5. Train team on dashboard use

---

## **Questions?**

Refer to:
- DEPLOYMENT.md — Server setup & database
- QUICKSTART.md — Local development
- CLAUDE.md — Project brief & coding conventions
