import React, { useEffect, useState, FormEvent } from 'react';
import { PermissionGuard } from '../components/PermissionGuard';
import { api } from '../utils/api';
import { UserRow } from '../types';

interface EditState {
  id: number;
  name: string;
  email: string;
  role_id: string;
  department_id: string;
}

const ROLES = [
  { id: 1, name: 'Admin' },
  { id: 2, name: 'Manager' },
  { id: 3, name: 'Employee' },
];

const DEPARTMENTS = [
  { id: 1, name: 'HR' },
  { id: 2, name: 'Finance' },
  { id: 3, name: 'Engineering' },
  { id: 4, name: 'Sales' },
];

export default function Users() {
  const [users,   setUsers]   = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  // Create form
  const [showCreate, setShowCreate] = useState(false);
  const [newName,    setNewName]    = useState('');
  const [newEmail,   setNewEmail]   = useState('');
  const [newPass,    setNewPass]    = useState('');
  const [newRole,    setNewRole]    = useState('3');
  const [newDept,    setNewDept]    = useState('1');
  const [createMsg,  setCreateMsg]  = useState('');

  // Edit state
  const [editState, setEditState] = useState<EditState | null>(null);
  const [editMsg,   setEditMsg]   = useState('');

  async function fetchUsers() {
    try {
      const data = await api.get<UserRow[]>('/users');
      setUsers(data);
    } catch (err: any) {
      setError(err.message ?? 'Failed to load users.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchUsers(); }, []);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setCreateMsg('');
    try {
      await api.post('/users', {
        name: newName,
        email: newEmail,
        password: newPass,
        role_id: parseInt(newRole),
        department_id: parseInt(newDept),
      });
      setCreateMsg('✅ User created successfully!');
      setNewName(''); setNewEmail(''); setNewPass(''); setNewRole('3'); setNewDept('1');
      fetchUsers();
    } catch (err: any) {
      setCreateMsg(`❌ ${err.message}`);
    }
  }

  async function handleEdit(e: FormEvent) {
    e.preventDefault();
    if (!editState) return;
    setEditMsg('');
    try {
      await api.put(`/users/${editState.id}`, {
        name:          editState.name,
        email:         editState.email,
        role_id:       parseInt(editState.role_id),
        department_id: parseInt(editState.department_id),
      });
      setEditMsg('✅ User updated!');
      setEditState(null);
      fetchUsers();
    } catch (err: any) {
      setEditMsg(`❌ ${err.message}`);
    }
  }

  async function handleDelete(id: number, name: string) {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (err: any) {
      alert(`Failed to delete: ${err.message}`);
    }
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h2 className="page-title">👥 User Management</h2>
          <p className="page-sub">Manage all users, roles, and departments.</p>
        </div>

        {/* Create User button — only visible if permitted */}
        <PermissionGuard permission="create_user">
          <button
            id="toggle-create-user"
            className="btn-primary"
            onClick={() => setShowCreate((s) => !s)}
          >
            {showCreate ? '✕ Cancel' : '+ New User'}
          </button>
        </PermissionGuard>
      </div>

      {/* Create User Form */}
      <PermissionGuard permission="create_user">
        {showCreate && (
          <div className="form-card">
            <h3 className="form-card-title">Create New User</h3>
            <form onSubmit={handleCreate} className="create-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text" placeholder="Jane Doe"
                    value={newName} onChange={(e) => setNewName(e.target.value)} required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email" placeholder="jane@example.com"
                    value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password" placeholder="Min 8 characters"
                    value={newPass} onChange={(e) => setNewPass(e.target.value)} required
                  />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                    {ROLES.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <select value={newDept} onChange={(e) => setNewDept(e.target.value)}>
                    {DEPARTMENTS.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
              </div>
              {createMsg && <div className="form-msg">{createMsg}</div>}
              <button type="submit" className="btn-primary">Create User</button>
            </form>
          </div>
        )}
      </PermissionGuard>

      {/* Edit User Modal */}
      {editState && (
        <div className="modal-overlay" onClick={() => setEditState(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 className="form-card-title">Edit User #{editState.id}</h3>
            <form onSubmit={handleEdit} className="create-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text" value={editState.name}
                  onChange={(e) => setEditState({ ...editState, name: e.target.value })} required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email" value={editState.email}
                  onChange={(e) => setEditState({ ...editState, email: e.target.value })} required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Role</label>
                  <select
                    value={editState.role_id}
                    onChange={(e) => setEditState({ ...editState, role_id: e.target.value })}
                  >
                    {ROLES.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Department</label>
                  <select
                    value={editState.department_id}
                    onChange={(e) => setEditState({ ...editState, department_id: e.target.value })}
                  >
                    {DEPARTMENTS.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
              </div>
              {editMsg && <div className="form-msg">{editMsg}</div>}
              <div className="modal-actions">
                <button type="button" className="btn-ghost" onClick={() => setEditState(null)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Users Table */}
      {loading ? (
        <div className="loading-state">Loading users…</div>
      ) : error ? (
        <div className="error-state">⚠️ {error}</div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Department</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="td-id">{u.id}</td>
                  <td className="td-name">
                    <div className="user-avatar-sm">{u.name.charAt(0)}</div>
                    {u.name}
                  </td>
                  <td>{u.email}</td>
                  <td>
                    <span className={`role-badge role-${u.role_name.toLowerCase()}`}>
                      {u.role_name}
                    </span>
                  </td>
                  <td>{u.department_name}</td>
                  <td className="td-date">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="td-actions">
                    <PermissionGuard permission="edit_user">
                      <button
                        id={`edit-user-${u.id}`}
                        className="btn-icon edit"
                        title="Edit user"
                        onClick={() =>
                          setEditState({
                            id:            u.id,
                            name:          u.name,
                            email:         u.email,
                            role_id:       String(ROLES.find((r) => r.name === u.role_name)?.id ?? 3),
                            department_id: String(DEPARTMENTS.find((d) => d.name === u.department_name)?.id ?? 1),
                          })
                        }
                      >
                        ✏️
                      </button>
                    </PermissionGuard>

                    <PermissionGuard permission="delete_user">
                      <button
                        id={`delete-user-${u.id}`}
                        className="btn-icon delete"
                        title="Delete user"
                        onClick={() => handleDelete(u.id, u.name)}
                      >
                        🗑️
                      </button>
                    </PermissionGuard>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={7} className="td-empty">No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
