import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sql from 'mssql';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// SQL Server Configuration
const sqlConfig = {
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_NAME || 'EventPlanning',
  authentication: {
    type: 'default',
    options: {
      userName: process.env.DB_USER || 'sa',
      password: process.env.DB_PASSWORD || ''
    }
  },
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true' || false,
    trustServerCertificate: true
  }
};

let pool;

// Initialize SQL connection pool
async function initializeDb() {
  try {
    pool = new sql.ConnectionPool(sqlConfig);
    await pool.connect();
    console.log('Connected to SQL Server');
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
}

// Authentication Middleware
function authenticate(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

// Routes

// 1. Login Endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  try {
    const request = pool.request();
    const result = await request
      .input('username', sql.NVarChar, username)
      .query('SELECT * FROM users WHERE username = @username');

    if (result.recordset.length === 0) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const user = result.recordset[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Update last login
    await pool.request()
      .input('userId', sql.Int, user.id)
      .query('UPDATE users SET last_login = GETDATE() WHERE id = @userId');

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// 2. Get All Events for Current User
app.get('/api/events', authenticate, async (req, res) => {
  try {
    const request = pool.request();
    const result = await request
      .input('userId', sql.Int, req.user.id)
      .query(`
        SELECT id, name, date, location, type, status, budget_total, budget_actual, created_at, updated_at
        FROM events
        WHERE user_id = @userId
        ORDER BY date DESC
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error('Get events error:', err);
    res.status(500).json({ error: 'Failed to retrieve events' });
  }
});

// 3. Get Single Event with Related Data
app.get('/api/events/:eventId', authenticate, async (req, res) => {
  const { eventId } = req.params;

  try {
    const request = pool.request();
    
    // Get event
    const eventResult = await request
      .input('eventId', sql.NVarChar, eventId)
      .input('userId', sql.Int, req.user.id)
      .query(`
        SELECT * FROM events
        WHERE id = @eventId AND user_id = @userId
      `);

    if (eventResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const event = eventResult.recordset[0];

    // Get tasks
    const tasksResult = await pool.request()
      .input('eventId', sql.NVarChar, eventId)
      .query('SELECT * FROM tasks WHERE event_id = @eventId ORDER BY due_date');

    // Get budget
    const budgetResult = await pool.request()
      .input('eventId', sql.NVarChar, eventId)
      .query('SELECT * FROM budget_lines WHERE event_id = @eventId');

    // Get vendors
    const vendorsResult = await pool.request()
      .input('eventId', sql.NVarChar, eventId)
      .query('SELECT * FROM vendors WHERE event_id = @eventId');

    // Get timeline
    const timelineResult = await pool.request()
      .input('eventId', sql.NVarChar, eventId)
      .query('SELECT * FROM timeline_items WHERE event_id = @eventId ORDER BY sequence');

    res.json({
      event,
      tasks: tasksResult.recordset,
      budget: budgetResult.recordset,
      vendors: vendorsResult.recordset,
      timeline: timelineResult.recordset
    });
  } catch (err) {
    console.error('Get event detail error:', err);
    res.status(500).json({ error: 'Failed to retrieve event details' });
  }
});

// 4. Update Task Status
app.put('/api/tasks/:taskId', authenticate, async (req, res) => {
  const { taskId } = req.params;
  const { status, title, notes } = req.body;

  try {
    const request = pool.request();
    await request
      .input('taskId', sql.NVarChar, taskId)
      .input('status', sql.NVarChar, status)
      .input('title', sql.NVarChar, title)
      .input('notes', sql.NVarChar, notes)
      .query(`
        UPDATE tasks
        SET status = @status, title = @title, notes = @notes, updated_at = GETDATE()
        WHERE id = @taskId
      `);

    res.json({ success: true });
  } catch (err) {
    console.error('Update task error:', err);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// 5. Update Budget Line
app.put('/api/budget/:budgetId', authenticate, async (req, res) => {
  const { budgetId } = req.params;
  const { actual_amount, status } = req.body;

  try {
    await pool.request()
      .input('budgetId', sql.Int, budgetId)
      .input('actualAmount', sql.Decimal(10, 2), actual_amount)
      .input('status', sql.NVarChar, status)
      .query(`
        UPDATE budget_lines
        SET actual_amount = @actualAmount, status = @status, updated_at = GETDATE()
        WHERE id = @budgetId
      `);

    res.json({ success: true });
  } catch (err) {
    console.error('Update budget error:', err);
    res.status(500).json({ error: 'Failed to update budget' });
  }
});

// 6. Update Vendor Status
app.put('/api/vendors/:vendorId', authenticate, async (req, res) => {
  const { vendorId } = req.params;
  const { status, contact_phone, contact_email, notes } = req.body;

  try {
    await pool.request()
      .input('vendorId', sql.Int, vendorId)
      .input('status', sql.NVarChar, status)
      .input('phone', sql.NVarChar, contact_phone)
      .input('email', sql.NVarChar, contact_email)
      .input('notes', sql.NVarChar, notes)
      .query(`
        UPDATE vendors
        SET status = @status, contact_phone = @phone, contact_email = @email, notes = @notes, updated_at = GETDATE()
        WHERE id = @vendorId
      `);

    res.json({ success: true });
  } catch (err) {
    console.error('Update vendor error:', err);
    res.status(500).json({ error: 'Failed to update vendor' });
  }
});

// 7. Sync TASKS.json from GitHub (Admin endpoint)
app.post('/api/sync-github/:eventId', authenticate, async (req, res) => {
  const { eventId } = req.params;
  const { github_url, github_token } = req.body;

  if (!github_url || !github_token) {
    return res.status(400).json({ error: 'GitHub URL and token required' });
  }

  try {
    // Fetch TASKS.json from GitHub
    const response = await axios.get(github_url, {
      headers: { 'Authorization': `token ${github_token}` }
    });

    const tasksData = response.data.tasks;
    
    // Sync to database
    for (const task of tasksData) {
      await pool.request()
        .input('id', sql.NVarChar, task.id)
        .input('eventId', sql.NVarChar, eventId)
        .input('title', sql.NVarChar, task.title)
        .input('status', sql.NVarChar, task.status)
        .input('dueDate', sql.Date, task.dueDate)
        .input('priority', sql.NVarChar, task.priority)
        .input('owner', sql.NVarChar, task.owner)
        .input('category', sql.NVarChar, task.category)
        .input('notes', sql.NVarChar, task.notes)
        .input('dependencies', sql.NVarChar, JSON.stringify(task.dependencies))
        .query(`
          MERGE tasks AS target
          USING (SELECT @id AS id) AS source
          ON target.id = source.id
          WHEN MATCHED THEN
            UPDATE SET title = @title, status = @status, due_date = @dueDate, priority = @priority, owner = @owner, category = @category, notes = @notes, dependencies = @dependencies
          WHEN NOT MATCHED THEN
            INSERT (id, event_id, title, status, due_date, priority, owner, category, notes, dependencies)
            VALUES (@id, @eventId, @title, @status, @dueDate, @priority, @owner, @category, @notes, @dependencies);
        `);
    }

    // Log sync
    await pool.request()
      .input('eventId', sql.NVarChar, eventId)
      .input('sourceFile', sql.NVarChar, 'TASKS.json')
      .query(`
        INSERT INTO sync_log (event_id, source_file, status)
        VALUES (@eventId, @sourceFile, 'success')
      `);

    res.json({ success: true, synced: tasksData.length });
  } catch (err) {
    console.error('GitHub sync error:', err);
    
    // Log failed sync
    await pool.request()
      .input('eventId', sql.NVarChar, eventId)
      .input('sourceFile', sql.NVarChar, 'TASKS.json')
      .input('notes', sql.NVarChar, err.message)
      .query(`
        INSERT INTO sync_log (event_id, source_file, status, notes)
        VALUES (@eventId, @sourceFile, 'failed', @notes)
      `);
    
    res.status(500).json({ error: 'Failed to sync from GitHub' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Initialize and start server
initializeDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Event Dashboard API running on http://localhost:${PORT}`);
    console.log('Endpoints:');
    console.log('  POST   /api/login');
    console.log('  GET    /api/events');
    console.log('  GET    /api/events/:eventId');
    console.log('  PUT    /api/tasks/:taskId');
    console.log('  PUT    /api/budget/:budgetId');
    console.log('  PUT    /api/vendors/:vendorId');
    console.log('  POST   /api/sync-github/:eventId');
  });
});
