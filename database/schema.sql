-- =============================================================
-- Multi-User Role & Department Based Permission System
-- Database Schema + Seed Data
-- =============================================================

CREATE DATABASE IF NOT EXISTS permission_system;
USE permission_system;

-- ----------------------------------------------------------------
-- 1. DEPARTMENTS
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS departments (
  id   INT          AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO departments (name) VALUES
  ('HR'),
  ('Finance'),
  ('Engineering'),
  ('Sales');

-- ----------------------------------------------------------------
-- 2. ROLES
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS roles (
  id   INT          AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO roles (name) VALUES
  ('Admin'),
  ('Manager'),
  ('Employee');

-- ----------------------------------------------------------------
-- 3. PERMISSIONS
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS permissions (
  id   INT          AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO permissions (name) VALUES
  ('view_dashboard'),
  ('view_users'),
  ('create_user'),
  ('edit_user'),
  ('delete_user'),
  ('view_reports'),
  ('create_report'),
  ('manage_settings');

-- ----------------------------------------------------------------
-- 4. ROLE_PERMISSIONS  (many-to-many)
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS role_permissions (
  role_id       INT NOT NULL,
  permission_id INT NOT NULL,
  PRIMARY KEY (role_id, permission_id),
  FOREIGN KEY (role_id)       REFERENCES roles(id)       ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- Admin (id=1) → all permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 1, id FROM permissions;

-- Manager (id=2) → view_dashboard, view_users, edit_user, view_reports, create_report
INSERT INTO role_permissions (role_id, permission_id)
SELECT 2, id FROM permissions WHERE name IN (
  'view_dashboard', 'view_users', 'edit_user', 'view_reports', 'create_report'
);

-- Employee (id=3) → view_dashboard, view_reports
INSERT INTO role_permissions (role_id, permission_id)
SELECT 3, id FROM permissions WHERE name IN (
  'view_dashboard', 'view_reports'
);

-- ----------------------------------------------------------------
-- 5. USERS
-- ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id            INT           AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(150)  NOT NULL,
  email         VARCHAR(150)  NOT NULL UNIQUE,
  password_hash VARCHAR(255)  NOT NULL,
  role_id       INT           NOT NULL,
  department_id INT           NOT NULL,
  created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id)       REFERENCES roles(id),
  FOREIGN KEY (department_id) REFERENCES departments(id)
);

-- Passwords are all "password123" hashed with bcrypt (10 rounds)
-- To regenerate:  node -e "const b=require('bcrypt'); b.hash('password123',10).then(h=>console.log(h))"

INSERT INTO users (name, email, password_hash, role_id, department_id) VALUES
  (
    'Alice Admin',
    'admin@example.com',
    '$2b$10$M5BTkPWmWobd.i1gCSt3mezNPTx.x./OZwl1fP0xPmiRyzXTGX6Se',
    1,  -- Admin
    3   -- Engineering
  ),
  (
    'Mark Manager',
    'manager@example.com',
    '$2b$10$M5BTkPWmWobd.i1gCSt3mezNPTx.x./OZwl1fP0xPmiRyzXTGX6Se',
    2,  -- Manager
    1   -- HR
  ),
  (
    'Eve Employee',
    'employee@example.com',
    '$2b$10$M5BTkPWmWobd.i1gCSt3mezNPTx.x./OZwl1fP0xPmiRyzXTGX6Se',
    3,  -- Employee
    4   -- Sales
  );
