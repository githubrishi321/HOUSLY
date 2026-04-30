import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PermissionGuard } from './PermissionGuard';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <span className="nav-logo">🔐</span>
        <span className="nav-brand-name">PermissionOS</span>
      </div>

      <div className="nav-links">
        <PermissionGuard permission="view_dashboard">
          <NavLink
            id="nav-dashboard"
            to="/dashboard"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            📊 Dashboard
          </NavLink>
        </PermissionGuard>

        <PermissionGuard permission="view_users">
          <NavLink
            id="nav-users"
            to="/users"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            👥 Users
          </NavLink>
        </PermissionGuard>
      </div>

      {user && (
        <div className="nav-user">
          <div className="nav-user-info">
            <div className="nav-avatar">{user.name.charAt(0)}</div>
            <div className="nav-user-details">
              <span className="nav-user-name">{user.name}</span>
              <span className={`role-badge-sm role-${user.roleName.toLowerCase()}`}>
                {user.roleName}
              </span>
            </div>
          </div>
          <button
            id="logout-button"
            className="btn-logout"
            onClick={logout}
            title="Logout"
          >
            ⎋ Logout
          </button>
        </div>
      )}
    </nav>
  );
}
