const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sql = require('mssql');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Database configuration
const sqlConfig = {
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  authentication: {
    type: 'default',
    options: {
      userName: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    }
  },
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

let pool;

async function connectDB() {
  try {
    pool = new sql.ConnectionPool(sqlConfig);
    await pool.connect();
    console.log('Connected to SQL Server');
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
}

// Middleware: Verify JWT
function verifyToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

// ============ AUTH ============

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const result = await pool.request()
      .input('username', sql.VarChar, username)
      .query('SELECT * FROM users WHERE username = @username');

    if (result.recordset.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.recordset[0];
    const passwordMatch = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: { id: user.id, username: user.username }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// ============ EVENTS ============

app.get('/api/events', verifyToken, async (req, res) => {
  try {
    const result = await pool.request()
      .input('user_id', sql.Int, req.user.id)
      .query('SELECT * FROM events WHERE user_id = @user_id ORDER BY date DESC');

    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

app.get('/api/events/:eventId', verifyToken, async (req, res) => {
  try {
    const eventId = req.params.eventId;

    const eventResult = await pool.request()
      .input('id', sql.Int, eventId)
      .input('user_id', sql.Int, req.user.id)
      .query('SELECT * FROM events WHERE id = @id AND user_id = @user_id');

    if (eventResult.recordset.length === 0) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const event = eventResult.recordset[0];

    const tasksResult = await pool.request()
      .input('event_id', sql.Int, eventId)
      .query('SELECT * FROM tasks WHERE event_id = @event_id');

    const budgetResult = await pool.request()
      .input('event_id', sql.Int, eventId)
      .query('SELECT * FROM budget_lines WHERE event_id = @event_id');

    const vendorsResult = await pool.request()
      .input('event_id', sql.Int, eventId)
      .query('SELECT * FROM vendors WHERE event_id = @event_id');

    const timelineResult = await pool.request()
      .input('event_id', sql.Int, eventId)
      .query('SELECT * FROM timeline_items WHERE event_id = @event_id ORDER BY sequence ASC');

    res.json({
      event,
      tasks: tasksResult.recordset,
      budget: budgetResult.recordset,
      vendors: vendorsResult.recordset,
      timeline: timelineResult.recordset
    });
  } catch (err) {
    console.error('Error fetching event detail:', err);
    res.status(500).json({ error: 'Failed to fetch event' });
  }
});

// ============ TASKS ============

app.put('/api/tasks/:taskId', verifyToken, async (req, res) => {
  try {
    const { title, status, priority, due_date, owner } = req.body;
    const taskId = req.params.taskId;

    await pool.request()
      .input('id', sql.Int, taskId)
      .input('title', sql.VarChar, title)
      .input('status', sql.VarChar, status)
      .input('priority', sql.VarChar, priority)
      .input('due_date', sql.Date, due_date)
      .input('owner', sql.VarChar, owner)
      .query(`
        UPDATE tasks 
        SET title = @title, status = @status, priority = @priority, due_date = @due_date, owner = @owner 
        WHERE id = @id
      `);

    res.json({ success: true });
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// ============ BUDGET ============

app.put('/api/budget/:budgetId', verifyToken, async (req, res) => {
  try {
    const { category, budgeted_amount, actual_amount, status } = req.body;
    const budgetId = req.params.budgetId;

    await pool.request()
      .input('id', sql.Int, budgetId)
      .input('category', sql.VarChar, category)
      .input('budgeted_amount', sql.Decimal(10, 2), budgeted_amount)
      .input('actual_amount', sql.Decimal(10, 2), actual_amount)
      .input('status', sql.VarChar, status)
      .query(`
        UPDATE budget_lines 
        SET category = @category, budgeted_amount = @budgeted_amount, actual_amount = @actual_amount, status = @status 
        WHERE id = @id
      `);

    res.json({ success: true });
  } catch (err) {
    console.error('Error updating budget:', err);
    res.status(500).json({ error: 'Failed to update budget' });
  }
});

// ============ VENDORS ============

app.put('/api/vendors/:vendorId', verifyToken, async (req, res) => {
  try {
    const { name, service, contact_phone, contact_email, status } = req.body;
    const vendorId = req.params.vendorId;

    await pool.request()
      .input('id', sql.Int, vendorId)
      .input('name', sql.VarChar, name)
      .input('service', sql.VarChar, service)
      .input('contact_phone', sql.VarChar, contact_phone)
      .input('contact_email', sql.VarChar, contact_email)
      .input('status', sql.VarChar, status)
      .query(`
        UPDATE vendors 
        SET name = @name, service = @service, contact_phone = @contact_phone, contact_email = @contact_email, status = @status 
        WHERE id = @id
      `);

    res.json({ success: true });
  } catch (err) {
    console.error('Error updating vendor:', err);
    res.status(500).json({ error: 'Failed to update vendor' });
  }
});

// ============ TIMELINE ============

app.put('/api/timeline/:timelineId', verifyToken, async (req, res) => {
  try {
    const { time, activity, owner, notes } = req.body;
    const timelineId = req.params.timelineId;

    await pool.request()
      .input('id', sql.Int, timelineId)
      .input('time', sql.VarChar, time)
      .input('activity', sql.VarChar, activity)
      .input('owner', sql.VarChar, owner)
      .input('notes', sql.VarChar, notes)
      .query(`
        UPDATE timeline_items 
        SET time = @time, activity = @activity, owner = @owner, notes = @notes 
        WHERE id = @id
      `);

    res.json({ success: true });
  } catch (err) {
    console.error('Error updating timeline:', err);
    res.status(500).json({ error: 'Failed to update timeline' });
  }
});

// ============ HEALTH CHECK ============

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// ============ START SERVER ============

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
