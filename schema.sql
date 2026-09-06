-- Create database (run this first if needed)
-- CREATE DATABASE EventPlanningDashboard;
-- USE EventPlanningDashboard;

-- Users table
CREATE TABLE users (
  id INT PRIMARY KEY IDENTITY(1,1),
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  created_at DATETIME DEFAULT GETDATE()
);

-- Events table
CREATE TABLE events (
  id INT PRIMARY KEY IDENTITY(1,1),
  user_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  location VARCHAR(255),
  type VARCHAR(50),
  status VARCHAR(50) DEFAULT 'pending',
  budget_total DECIMAL(10, 2),
  budget_actual DECIMAL(10, 2),
  created_at DATETIME DEFAULT GETDATE(),
  updated_at DATETIME DEFAULT GETDATE(),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Tasks table
CREATE TABLE tasks (
  id INT PRIMARY KEY IDENTITY(1,1),
  event_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  priority VARCHAR(50) DEFAULT 'medium',
  due_date DATE,
  owner VARCHAR(255),
  created_at DATETIME DEFAULT GETDATE(),
  updated_at DATETIME DEFAULT GETDATE(),
  FOREIGN KEY (event_id) REFERENCES events(id)
);

-- Budget lines table
CREATE TABLE budget_lines (
  id INT PRIMARY KEY IDENTITY(1,1),
  event_id INT NOT NULL,
  category VARCHAR(255) NOT NULL,
  budgeted_amount DECIMAL(10, 2),
  actual_amount DECIMAL(10, 2),
  status VARCHAR(50) DEFAULT 'on-track',
  created_at DATETIME DEFAULT GETDATE(),
  updated_at DATETIME DEFAULT GETDATE(),
  FOREIGN KEY (event_id) REFERENCES events(id)
);

-- Vendors table
CREATE TABLE vendors (
  id INT PRIMARY KEY IDENTITY(1,1),
  event_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  service VARCHAR(255),
  contact_phone VARCHAR(20),
  contact_email VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  created_at DATETIME DEFAULT GETDATE(),
  updated_at DATETIME DEFAULT GETDATE(),
  FOREIGN KEY (event_id) REFERENCES events(id)
);

-- Timeline items table
CREATE TABLE timeline_items (
  id INT PRIMARY KEY IDENTITY(1,1),
  event_id INT NOT NULL,
  time VARCHAR(20),
  activity VARCHAR(255) NOT NULL,
  owner VARCHAR(255),
  notes VARCHAR(MAX),
  sequence INT,
  created_at DATETIME DEFAULT GETDATE(),
  updated_at DATETIME DEFAULT GETDATE(),
  FOREIGN KEY (event_id) REFERENCES events(id)
);

-- Planning timeline table
CREATE TABLE planning_timeline (
  id INT PRIMARY KEY IDENTITY(1,1),
  event_id INT NOT NULL,
  week VARCHAR(100),
  focus VARCHAR(MAX),
  status VARCHAR(50) DEFAULT 'pending',
  created_at DATETIME DEFAULT GETDATE(),
  updated_at DATETIME DEFAULT GETDATE(),
  FOREIGN KEY (event_id) REFERENCES events(id)
);

-- Sync log table (for GitHub sync tracking)
CREATE TABLE sync_log (
  id INT PRIMARY KEY IDENTITY(1,1),
  event_id INT NOT NULL,
  source VARCHAR(100),
  synced_at DATETIME DEFAULT GETDATE(),
  status VARCHAR(50),
  FOREIGN KEY (event_id) REFERENCES events(id)
);

-- Create indexes
CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_tasks_event_id ON tasks(event_id);
CREATE INDEX idx_budget_event_id ON budget_lines(event_id);
CREATE INDEX idx_vendors_event_id ON vendors(event_id);
CREATE INDEX idx_timeline_event_id ON timeline_items(event_id);
CREATE INDEX idx_planning_event_id ON planning_timeline(event_id);
CREATE INDEX idx_users_username ON users(username);

-- Insert sample user (password: demo123)
INSERT INTO users (username, password_hash, email) 
VALUES ('carrie', '$2b$10$YourHashedPasswordHere', 'carrie@example.com');

-- Insert sample event
INSERT INTO events (user_id, name, date, location, type, status, budget_total, budget_actual)
VALUES (1, 'Spring Fundraiser Gala', '2027-03-15', 'The Meadows Venue, Greensboro, NC', 'team', 'in-progress', 5300, 4275);

-- Insert sample tasks
INSERT INTO tasks (event_id, title, status, priority, due_date, owner)
VALUES 
  (1, 'Submit city event permit', 'pending', 'high', '2026-10-15', 'Carrie'),
  (1, 'Confirm primary caterer', 'pending', 'high', '2026-10-22', 'Rob'),
  (1, 'Finalize budget', 'in-progress', 'high', '2026-10-08', 'Finance'),
  (1, 'Confirm venue floor plan', 'pending', 'high', '2026-10-25', 'Logistics'),
  (1, 'Draft volunteer email', 'pending', 'medium', '2026-10-01', 'Carrie');

-- Insert sample budget
INSERT INTO budget_lines (event_id, category, budgeted_amount, actual_amount, status)
VALUES 
  (1, 'Venue', 1500, 1500, 'on-track'),
  (1, 'Catering', 2000, 1950, 'on-track'),
  (1, 'AV & Tech', 600, 600, 'on-track'),
  (1, 'Permits & Insurance', 150, 150, 'on-track'),
  (1, 'Marketing & Comms', 150, 75, 'on-track');

-- Insert sample vendors
INSERT INTO vendors (event_id, name, service, contact_phone, contact_email, status)
VALUES 
  (1, 'Trenton Events', 'Catering', '336-555-0123', 'info@trentonevents.com', 'confirmed'),
  (1, 'Clarity Audio', 'AV & Sound', '336-555-0456', 'booking@clarityaudio.com', 'confirmed'),
  (1, 'The Meadows Venue', 'Venue', '336-555-0789', 'events@themeadows.com', 'confirmed');

-- Insert sample timeline
INSERT INTO timeline_items (event_id, time, activity, owner, notes, sequence)
VALUES 
  (1, '4:00 PM', 'Setup begins', 'Sarah (Volunteer Lead)', 'AV testing, table setup', 1),
  (1, '5:30 PM', 'Doors open', 'Marcus', 'Check-in & registration', 2),
  (1, '6:00 PM', 'Welcome remarks', 'Carrie', '10 mins', 3),
  (1, '6:45 PM', 'Catering begins', 'Trenton Events', '336-555-0123', 4),
  (1, '7:45 PM', 'Closing remarks', 'Carrie', '5 mins', 5),
  (1, '8:30 PM', 'Breakdown', 'Team', 'Complete by 9:15 PM', 6);
