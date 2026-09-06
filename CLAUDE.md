# CLAUDE.md — Event Planning Dashboard Project Brief

This file is permanent project context for Claude. Update it as priorities shift.

---

## **Project Overview**

Building a reusable, private event planning dashboard for Carrie Rogers and her nonprofit development/events work.

- **Owner:** Carrie Rogers, NC Piedmont area
- **Repository:** https://github.com/cmnordt-collab/Event-planning
- **Claude Project:** https://claude.ai/project/019e9d8a-f79c-7037-a9a8-2bc9498b7147
- **Status:** Core features complete; demo live; production ready for deployment

---

## **Current Role**

Claude assists with:
1. **Code refinement** — concise, token-efficient changes (use diff placeholders)
2. **Feature additions** — new tabs, fields, database schema updates
3. **Documentation** — keep README-DASHBOARD.md, DEPLOYMENT.md, QUICKSTART.md current
4. **Demo maintenance** — update test data in dashboard-demo.html as needed
5. **Troubleshooting** — debug backend/frontend issues, database connectivity

---

## **Two Product Versions (Know the Difference)**

### **Demo Version: `dashboard-demo.html`**
- No login, no backend
- Works from GitHub Pages
- Hardcoded test data (Spring Gala + Beach Bash 2027)
- Changes don't persist
- Shared with prospects (Chatham Pride, West End, Lavender Social Collective, etc.)
- URL: https://cmnordt-collab.github.io/Event-planning/dashboard-demo.html

### **Production Version: `dashboard-editable.html`**
- JWT login + password auth
- Connects to Node.js backend (server.js)
- SQL Server database (persistent)
- All changes save automatically
- For Carrie's actual event planning use
- URL: http://localhost:3000/dashboard (or deployed server)

---

## **Core Files & Their Purpose**

| File | Purpose | When to Touch |
|------|---------|--------------|
| `dashboard-demo.html` | Standalone demo for prospects | Add new test events, update marketing copy, test new tabs |
| `dashboard-editable.html` | Production dashboard | Add new tabs, refactor UI, fix bugs, add features |
| `server.js` | Express backend API | Add new endpoints, fix auth, update database calls |
| `schema.sql` | SQL Server database schema | Add tables, indexes, sample data for new features |
| `package.json` | Node.js dependencies | Add libraries (rarely needed) |
| `.env.example` | Environment variables template | Document new config vars |
| `DEPLOYMENT.md` | Production setup guide | Keep step-by-step accurate for contact's deployment |
| `README-DASHBOARD.md` | Architecture & features overview | Update when adding major features |
| `QUICKSTART.md` | Local development setup | Update if setup process changes |
| `TASKS.json` | Sample task data | Add/remove example tasks as needed |
| `budget_tracker.md` | Sample budget | Keep realistic and current |
| `run_of_show.md` | Sample event timeline | Keep detailed for demo use |
| `CLAUDE.md` | This file — project brief | Update priorities, status, role changes |

---

## **Technology Stack (Non-Negotiable)**

- **Frontend:** HTML/CSS/JavaScript + Tailwind CDN (simple, no framework)
- **Backend:** Node.js + Express + bcrypt + JWT
- **Database:** SQL Server (client provides & hosts)
- **Hosting:** Client's infrastructure (not Netlify/Vercel/Firebase)
- **Authentication:** JWT tokens (24-hour expiration)

**Why these choices:** Client has SQL Server expertise, wants minimal dependencies, prefers to host everything.

---

## **Current Feature Set**

### **Tabs (Complete)**
1. **Overview** — Budget snapshot, task count, vendor confirmations
2. **Planning Timeline** — Week-by-week pre-event milestones
3. **Run of Show** — Minute-by-minute event timeline (day-of)
4. **Budget** — Budgeted vs. actual, variance tracking
5. **Tasks** — Task list with priority, status, owner, due date
6. **Vendors** — Vendor contacts, services, contract status

### **Authentication (Complete)**
- Login screen with username/password
- Bcrypt password hashing
- JWT tokens (24-hour expiration)
- Private events (users only see their own)

### **Database (Complete)**
- Users, Events, Tasks, Budget Lines, Vendors, Timeline Items, Planning Timeline tables
- Indexes for performance
- Sample data for testing

---

## **Priorities (Current)**

1. **✅ Demo works flawlessly** — Core demo live, GitHub Pages accessible
2. **✅ Production code deployable** — Backend + database schema ready
3. **🔄 Stability first** — No breaking changes without discussion
4. **📝 Documentation accurate** — DEPLOYMENT.md, QUICKSTART.md kept current
5. **Future:** Multi-user team management (Phase 2)

---

## **Constraints & Rules**

### **Code Style**
- Be concise — avoid filler, no full file rewrites for small fixes
- Use diff placeholders (// ... rest of code remains the same ...)
- Prefer inline CSS over external dependencies
- No framework bloat (React, Vue, etc.) — keep it simple

### **Naming Conventions**
- Files: kebab-case (dashboard-demo.html, run_of_show.md)
- Variables: camelCase (currentTab, selectedEventId)
- Database tables: snake_case (budget_lines, timeline_items)
- API routes: /api/resource/:id (standard REST)

### **Communication Preferences**
- Formal, professional tone (see user preferences)
- Avoid em dashes — use alternative punctuation
- Respect Carrie's NC location in language/geography references
- No token waste — concise explanations, no repetition

### **GitHub Workflow**
- Commit messages: Action + what changed (e.g., "Add Planning Timeline tab")
- Keep README files current after major changes
- Demo and production versions stay in sync structurally
- All files in root directory (no subdirectories)

---

## **Known Limitations (Document for Users)**

- Single-user per login (no team collaboration yet)
- Desktop-first design (no mobile responsive)
- No file uploads for contracts/receipts
- No email notifications
- No calendar sync
- No PDF export (Phase 2+)

---

## **When to Ask for Clarification**

- Anything affecting database schema or API structure
- Major UI changes or feature additions
- Security-related changes
- Deployment or infrastructure questions
- Changes to demo vs. production workflow

---

## **Weekly Check-In Cadence (If Applicable)**

If working regularly with Carrie:
- **Monday:** Review completed tasks, plan week
- **Friday:** Demo progress, discuss blockers, update priorities

(Carrie will indicate when/if recurring sessions happen)

---

## **Success Criteria**

✅ Demo accessible from GitHub Pages with full functionality
✅ Production version deployable on Carrie's infrastructure
✅ All tabs editable and save correctly
✅ Documentation guides prospects and developers
✅ No security vulnerabilities (password hashing, JWT validation)
✅ Budget under 5MB total repo size (keep it lean)

---

## **Git Commit Message Examples**

Good:
- "Add Planning Timeline tab with week-by-week status tracking"
- "Fix budget variance calculation (actual - budgeted)"
- "Update DEPLOYMENT.md with SQL Server TCP/IP setup"

Bad:
- "changes"
- "Update files"
- "Fix stuff"

---

## **Questions or Changes?**

Update this file and commit with message: "Update CLAUDE.md: [describe change]"

All future work references this brief.
