# Multi-User Role & Department Based Permission System

A full-stack RBAC (Role-Based Access Control) application built with:

- **Frontend**: React 19 + TypeScript + CRA + React Router v6
- **Backend**: Node.js + Express 4 + TypeScript + ts-node-dev
- **Database**: MySQL

---

## 🚀 Quick Start

### 1. Database Setup

```bash
# Start MySQL and run the schema
mysql -u root -p < database/schema.sql
```

This creates the `permission_system` database, all tables, seeds departments/roles/permissions, and inserts 3 sample users with bcrypt-hashed passwords.

### 2. Backend Setup

```bash
cd backend

# Copy and edit the env file
copy .env.example .env
# Edit .env with your MySQL password

# Install dependencies (already done if you cloned fresh)
npm install

# Start development server (auto-restarts on file changes)
npm run dev
```

Server runs on **http://localhost:5000**

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

App runs on **http://localhost:3000**

---

## 🔐 Demo Accounts

All accounts use the password: **`password123`**

| Email | Role | Department | Permissions |
|---|---|---|---|
| `admin@example.com` | Admin | Engineering | All 8 permissions |
| `manager@example.com` | Manager | HR | 5 permissions (no create/delete/settings) |
| `employee@example.com` | Employee | Sales | 2 permissions (dashboard + reports) |

---

## 🔑 Generating bcrypt hashes manually

```bash
node -e "const b=require('bcrypt'); b.hash('password123',10).then(h=>console.log(h))"
```

---

## 📋 Permission Matrix

| Permission | Admin | Manager | Employee |
|---|:---:|:---:|:---:|
| `view_dashboard` | ✅ | ✅ | ✅ |
| `view_users` | ✅ | ✅ | ❌ |
| `create_user` | ✅ | ❌ | ❌ |
| `edit_user` | ✅ | ✅ | ❌ |
| `delete_user` | ✅ | ❌ | ❌ |
| `view_reports` | ✅ | ✅ | ✅ |
| `create_report` | ✅ | ✅ | ❌ |
| `manage_settings` | ✅ | ❌ | ❌ |

---

## 🧪 Test Instructions

### Login as Admin (`admin@example.com`)
- ✅ Can see all 8 action cards on Dashboard
- ✅ Can see the **Users** nav link
- ✅ Can see and use the **Create User** button and form
- ✅ Can **Edit** (pencil icon) any user
- ✅ Can **Delete** (trash icon) any user

### Login as Manager (`manager@example.com`)
- ✅ Can see 5 action cards (no Create User, Delete User, Settings)
- ✅ Can see the **Users** nav link
- ❌ **Create User** button is hidden
- ✅ Can **Edit** users (pencil icon visible)
- ❌ **Delete** button is hidden
- ✅ Visiting `/users` directly → page loads (has `view_users`)

### Login as Employee (`employee@example.com`)
- ✅ Can see only 2 action cards (Dashboard, Reports)
- ❌ **Users** nav link is hidden
- ❌ Visiting `/users` directly → shows **403 Access Denied** page
- All user management actions are hidden

---

## 📁 Project Structure

```
permission-system/
├── database/
│   └── schema.sql              # All tables + seed data
├── backend/
│   ├── src/
│   │   ├── config/db.ts        # MySQL2 connection pool
│   │   ├── types/index.ts      # TypeScript interfaces + Express augmentation
│   │   ├── middleware/
│   │   │   ├── auth.ts         # JWT verify middleware
│   │   │   └── permission.ts   # requirePermission() factory
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── userController.ts
│   │   │   └── permissionController.ts
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   ├── userRoutes.ts
│   │   │   └── permissionRoutes.ts
│   │   └── index.ts            # Express app entry
│   ├── .env                    # Your env vars
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
└── frontend/
    ├── src/
    │   ├── types/index.ts      # User, UserRow, Permission types
    │   ├── context/AuthContext.tsx  # Auth state + localStorage
    │   ├── hooks/usePermission.ts
    │   ├── components/
    │   │   ├── PermissionGuard.tsx
    │   │   └── Navbar.tsx
    │   ├── pages/
    │   │   ├── Login.tsx
    │   │   ├── Dashboard.tsx
    │   │   └── Users.tsx
    │   ├── utils/api.ts        # Fetch wrapper with JWT header
    │   ├── App.tsx             # Router + ProtectedRoute
    │   ├── index.tsx
    │   └── index.css           # Premium dark theme
    └── package.json
```

---

## 🔗 API Endpoints

| Method | Path | Auth | Permission |
|---|---|---|---|
| POST | `/api/auth/login` | ❌ | — |
| GET | `/api/users` | ✅ | `view_users` |
| POST | `/api/users` | ✅ | `create_user` |
| PUT | `/api/users/:id` | ✅ | `edit_user` |
| DELETE | `/api/users/:id` | ✅ | `delete_user` |
| GET | `/api/permissions` | ✅ | `manage_settings` |
| GET | `/api/permissions/roles` | ✅ | `manage_settings` |
| GET | `/health` | ❌ | — |
