import React from 'react';
import { useAuth } from '../context/AuthContext';
import { PermissionGuard } from '../components/PermissionGuard';

interface ActionCard {
  permission: string;
  icon: string;
  title: string;
  description: string;
  color: string;
}

const ACTION_CARDS: ActionCard[] = [
  {
    permission:  'view_dashboard',
    icon:        '📊',
    title:       'Dashboard',
    description: 'View key metrics and system overview.',
    color:       'card-blue',
  },
  {
    permission:  'view_users',
    icon:        '👥',
    title:       'View Users',
    description: 'Browse all users in the system.',
    color:       'card-purple',
  },
  {
    permission:  'create_user',
    icon:        '➕',
    title:       'Create User',
    description: 'Onboard a new user to the platform.',
    color:       'card-green',
  },
  {
    permission:  'edit_user',
    icon:        '✏️',
    title:       'Edit Users',
    description: 'Update user roles and departments.',
    color:       'card-orange',
  },
  {
    permission:  'delete_user',
    icon:        '🗑️',
    title:       'Delete Users',
    description: 'Remove users from the system.',
    color:       'card-red',
  },
  {
    permission:  'view_reports',
    icon:        '📈',
    title:       'View Reports',
    description: 'Access analytics and reports.',
    color:       'card-teal',
  },
  {
    permission:  'create_report',
    icon:        '📝',
    title:       'Create Report',
    description: 'Generate new analytics reports.',
    color:       'card-indigo',
  },
  {
    permission:  'manage_settings',
    icon:        '⚙️',
    title:       'Settings',
    description: 'Manage system-wide configuration.',
    color:       'card-slate',
  },
];

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  const permBadges = user.permissions.map((p) => (
    <span key={p} className="perm-badge">{p}</span>
  ));

  return (
    <div className="page-content">
      {/* Hero banner */}
      <div className="dashboard-hero">
        <div className="hero-left">
          <div className="hero-avatar">{user.name.charAt(0).toUpperCase()}</div>
          <div>
            <h2 className="hero-name">Welcome back, {user.name}!</h2>
            <div className="hero-meta">
              <span className={`role-badge role-${user.roleName.toLowerCase()}`}>
                {user.roleName}
              </span>
              <span className="dept-badge">🏢 {user.departmentName}</span>
            </div>
          </div>
        </div>
        <div className="hero-right">
          <p className="perm-label">Your Permissions</p>
          <div className="perm-badges-row">{permBadges}</div>
        </div>
      </div>

      {/* Action cards */}
      <h3 className="section-title">Available Actions</h3>
      <div className="cards-grid">
        {ACTION_CARDS.map((card) => (
          <PermissionGuard key={card.permission} permission={card.permission}>
            <div className={`action-card ${card.color}`}>
              <div className="card-icon">{card.icon}</div>
              <h4 className="card-title">{card.title}</h4>
              <p className="card-desc">{card.description}</p>
              <div className="card-perm-tag">{card.permission}</div>
            </div>
          </PermissionGuard>
        ))}
      </div>
    </div>
  );
}
