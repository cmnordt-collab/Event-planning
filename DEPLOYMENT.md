# Event Planning Dashboard - Deployment Guide

This guide walks through deploying the event planning dashboard on your hosting infrastructure.

---

## System Requirements

- **Node.js** 16+ (for running the backend API)
- **SQL Server** 2016+ or Azure SQL Database
- **npm** (comes with Node.js)
- A way to serve the `dashboard.html` file (Apache, Nginx, IIS, etc.)

---

## File Structure

```
Event-planning/
├── package.json           # Node.js dependencies
├── server.js             # Express backend API
├── schema.sql            # SQL Server database schema
├── dashboard.html        # Frontend (static HTML)
├── .env.example          # Environment variables template
└── DEPLOYMENT.md         # This file
```

---

## Step 1: Create the SQL Server Database

1. Open SQL Server Management Studio (or Azure Portal if using Azure SQL)
2. Create a new database called `EventPlanning`
3. Open a new query window and copy the entire contents of `schema.sql`
4. Execute the script to create all tables and indexes

**Create a demo user (for testing):**

```sql
INSERT INTO [users] ([username], [email], [password_hash])
VALUES ('carrie', 'carrie@example.com', '$2b$10$abcdefghijklmnopqrstuvwxyz...');
```

To generate the password hash, run this locally or use an online bcrypt generator:
- Username: `carrie`
- Password: `demo123`
- Generated hash will be pasted into the query above

---

## Step 2: Set Up the Backend Node.js Server

1. Clone or download the repository to your server:
   ```bash
   cd /path/to/Event-planning
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` with your SQL Server credentials:
   ```
   PORT=3000
   JWT_SECRET=your-very-secret-key-change-this
   DB_SERVER=your-sql-server.database.windows.net
   DB_NAME=EventPlanning
   DB_USER=sa
   DB_PASSWORD=YourPassword123!
   DB_ENCRYPT=true (set to false for local SQL Server)
   ```

5. Start the server:
   ```bash
   npm start
   ```

   You should see:
   ```
   Connected to SQL Server
   Event Dashboard API running on http://localhost:3000
   ```

---

## Step 3: Deploy the Frontend

The `dashboard.html` file is static and can be served by any web server.

### Option A: Serve with Node.js (Simplest)

Add this to `server.js` before the `app.listen()` call:

```javascript
app.use(express.static('.'));
app.get('/dashboard', (req, res) => {
  res.sendFile(__dirname + '/dashboard.html');
});
```

Then access the dashboard at `http://yourserver:3000/dashboard`

### Option B: Serve with Apache/Nginx

1. Copy `dashboard.html` to your web root:
   ```bash
   cp dashboard.html /var/www/html/
   ```

2. Make sure the dashboard can reach the API:
   - If the API runs on the same server, the frontend JS will call `http://localhost:3000/api`
   - If different servers, update the `API_URL` in `dashboard.html`:
     ```javascript
     const API_URL = 'http://your-api-server:3000/api';
     ```

### Option C: Azure App Service

1. Deploy Node.js app to App Service
2. Update `dashboard.html` API_URL to point to your App Service URL
3. Configure CORS in `server.js` to allow requests from your frontend domain

---

## Step 4: Enable CORS (if frontend and backend are on different servers)

Edit `server.js` and update the CORS configuration:

```javascript
const corsOptions = {
  origin: 'https://your-frontend-domain.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
```

---

## Step 5: Set Up SSL/HTTPS (Recommended for Production)

For production, always use HTTPS:

1. Obtain an SSL certificate (Let's Encrypt is free)
2. Configure your web server to use HTTPS
3. Update `dashboard.html` API_URL to use `https://` instead of `http://`

---

## Step 6: Test the Deployment

1. Open a browser and go to your dashboard URL
2. Log in with:
   - Username: `carrie`
   - Password: `demo123`
3. You should see your events and be able to view/edit tasks

---

## Managing the Application

### Stop/Start the Backend

```bash
# Stop (Ctrl+C in terminal)
# Start
npm start

# Or use a process manager like PM2 for auto-restart:
npm install -g pm2
pm2 start server.js --name "event-dashboard"
pm2 save
pm2 startup
```

### View Logs

```bash
# Check if connected to database
curl http://localhost:3000/api/health

# Or check PM2 logs
pm2 logs event-dashboard
```

### Create New Users

Run this SQL to add new users:

```sql
-- Generate password hash for password "MyPassword123!" at https://bcrypt-generator.com/
INSERT INTO [users] ([username], [email], [password_hash])
VALUES ('username', 'email@example.com', '$2b$10$generatedHashHere');
```

---

## Syncing with GitHub (Optional)

To automatically sync tasks from your GitHub TASKS.json:

1. Generate a GitHub Personal Access Token at https://github.com/settings/tokens
2. Add it to `.env`:
   ```
   GITHUB_TOKEN=ghp_your_token
   ```
3. Call the sync endpoint:
   ```bash
   curl -X POST http://localhost:3000/api/sync-github/gala-2027-spring \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"github_url":"https://api.github.com/repos/cmnordt-collab/Event-planning/contents/TASKS.json","github_token":"ghp_your_token"}'
   ```

---

## Troubleshooting

### "Cannot connect to database"
- Verify SQL Server is running and accessible
- Check DB_SERVER, DB_USER, DB_PASSWORD in `.env`
- Ensure the `EventPlanning` database exists
- Check firewall rules (port 1433 for SQL Server)

### "CORS error in browser"
- Update CORS configuration in `server.js`
- Ensure frontend and backend URLs match the allowed origins

### "Module not found"
- Run `npm install` again
- Check that `package.json` is in the same directory as `server.js`

### "Port 3000 already in use"
- Change PORT in `.env` to a different port
- Or kill the process: `lsof -i :3000` (Mac/Linux) or `netstat -ano | findstr :3000` (Windows)

---

## Support & Questions

For issues or questions about the deployment:
1. Check the error messages in the console
2. Verify database connectivity
3. Test the API directly: `curl http://localhost:3000/api/health`

---

## Next Steps

1. **Add real events** to the database
2. **Create user accounts** for team members
3. **Configure backups** for your SQL Server
4. **Set up SSL/HTTPS** for production
5. **Monitor logs** and performance regularly
