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

```bash
git clone https://github.com/cmnordt-collab/Event-planning.git
cd Event-planning
```

---

## **Step 2: Set Up SQL Server Database**

1. Open **SQL Server Management Studio (SSMS)**
2. Connect to your SQL Server instance
3. Open a **New Query** window
4. Copy the entire contents of `schema.sql`
5. Paste into the query window and execute (F5)
6. Wait for all tables to be created

**Result:** You now have a database called `EventPlanningDashboard` with all required tables.

---

## **Step 3: Configure Environment Variables**

1. In the project folder, create a new file named `.env`
2. Copy the contents of `.env.example` into it
3. Update the values with your actual credentials:
