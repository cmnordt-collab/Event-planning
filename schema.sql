-- Event Planning Dashboard Database Schema
-- SQL Server

-- Users Table
CREATE TABLE [users] (
    [id] INT PRIMARY KEY IDENTITY(1,1),
    [username] NVARCHAR(255) NOT NULL UNIQUE,
    [email] NVARCHAR(255) NOT NULL UNIQUE,
    [password_hash] NVARCHAR(MAX) NOT NULL,
    [created_at] DATETIME DEFAULT GETDATE(),
    [last_login] DATETIME NULL
);

-- Events Table
CREATE TABLE [events] (
    [id] NVARCHAR(100) PRIMARY KEY,
    [name] NVARCHAR(MAX) NOT NULL,
    [date] DATE NOT NULL,
    [location] NVARCHAR(MAX) NOT NULL,
    [type] NVARCHAR(50) NOT NULL, -- 'solo', 'team', 'consultant'
    [status] NVARCHAR(50) DEFAULT 'pending', -- 'pending', 'in-progress', 'completed'
    [budget_total] DECIMAL(10, 2) DEFAULT 0,
    [budget_actual] DECIMAL(10, 2) DEFAULT 0,
    [user_id] INT NOT NULL,
    [created_at] DATETIME DEFAULT GETDATE(),
    [updated_at] DATETIME DEFAULT GETDATE(),
    FOREIGN KEY ([user_id]) REFERENCES [users]([id])
);

-- Tasks Table
CREATE TABLE [tasks] (
    [id] NVARCHAR(100) PRIMARY KEY,
    [event_id] NVARCHAR(100) NOT NULL,
    [title] NVARCHAR(MAX) NOT NULL,
    [status] NVARCHAR(50) NOT NULL, -- 'pending', 'in-progress', 'done'
    [due_date] DATE NOT NULL,
    [priority] NVARCHAR(50) NOT NULL, -- 'high', 'medium', 'low'
    [owner] NVARCHAR(MAX) NOT NULL,
    [category] NVARCHAR(100) NOT NULL, -- 'Permits & Legal', 'Vendors', etc.
    [notes] NVARCHAR(MAX),
    [dependencies] NVARCHAR(MAX), -- JSON array of task IDs
    [created_at] DATETIME DEFAULT GETDATE(),
    [updated_at] DATETIME DEFAULT GETDATE(),
    FOREIGN KEY ([event_id]) REFERENCES [events]([id])
);

-- Budget Line Items Table
CREATE TABLE [budget_lines] (
    [id] INT PRIMARY KEY IDENTITY(1,1),
    [event_id] NVARCHAR(100) NOT NULL,
    [category] NVARCHAR(255) NOT NULL, -- 'Venue', 'Catering', 'AV & Tech', etc.
    [budgeted_amount] DECIMAL(10, 2) NOT NULL,
    [actual_amount] DECIMAL(10, 2) DEFAULT 0,
    [status] NVARCHAR(50) DEFAULT 'pending', -- 'on-track', 'over-budget', 'in-kind'
    [notes] NVARCHAR(MAX),
    [created_at] DATETIME DEFAULT GETDATE(),
    [updated_at] DATETIME DEFAULT GETDATE(),
    FOREIGN KEY ([event_id]) REFERENCES [events]([id])
);

-- Vendors Table
CREATE TABLE [vendors] (
    [id] INT PRIMARY KEY IDENTITY(1,1),
    [event_id] NVARCHAR(100) NOT NULL,
    [name] NVARCHAR(255) NOT NULL,
    [service] NVARCHAR(255) NOT NULL,
    [contact_phone] NVARCHAR(20),
    [contact_email] NVARCHAR(255),
    [status] NVARCHAR(50) DEFAULT 'pending', -- 'pending', 'confirmed', 'completed'
    [notes] NVARCHAR(MAX),
    [created_at] DATETIME DEFAULT GETDATE(),
    [updated_at] DATETIME DEFAULT GETDATE(),
    FOREIGN KEY ([event_id]) REFERENCES [events]([id])
);

-- Run of Show Timeline Table
CREATE TABLE [timeline_items] (
    [id] INT PRIMARY KEY IDENTITY(1,1),
    [event_id] NVARCHAR(100) NOT NULL,
    [time] NVARCHAR(10) NOT NULL, -- "4:00 PM"
    [activity] NVARCHAR(MAX) NOT NULL,
    [owner] NVARCHAR(255) NOT NULL,
    [notes] NVARCHAR(MAX),
    [sequence] INT NOT NULL, -- Order in timeline
    [created_at] DATETIME DEFAULT GETDATE(),
    [updated_at] DATETIME DEFAULT GETDATE(),
    FOREIGN KEY ([event_id]) REFERENCES [events]([id])
);

-- Sync Log (tracks when TASKS.json was last synced)
CREATE TABLE [sync_log] (
    [id] INT PRIMARY KEY IDENTITY(1,1),
    [event_id] NVARCHAR(100),
    [source_file] NVARCHAR(255), -- 'TASKS.json', 'budget_tracker.md', etc.
    [last_sync] DATETIME DEFAULT GETDATE(),
    [status] NVARCHAR(50) DEFAULT 'success', -- 'success', 'failed'
    [notes] NVARCHAR(MAX)
);

-- Create indexes for faster queries
CREATE INDEX idx_events_user ON [events]([user_id]);
CREATE INDEX idx_tasks_event ON [tasks]([event_id]);
CREATE INDEX idx_budget_event ON [budget_lines]([event_id]);
CREATE INDEX idx_vendors_event ON [vendors]([event_id]);
CREATE INDEX idx_timeline_event ON [timeline_items]([event_id]);
