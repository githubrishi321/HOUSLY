import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { User } from '../types';

interface LoginResponse {
  token: string;
  user: User;
}

export default function Login() {
  const { login } = useAuth();
  const navigate   = useNavigate();

  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.post<LoginResponse>('/auth/login', { email, password });
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message ?? 'Login failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-bg">
      <div className="login-card">
        {/* Logo / Brand */}
        <div className="login-brand">
          <div className="brand-icon">🔐</div>
          <h1 className="brand-title">PermissionOS</h1>
          <p className="brand-sub">Role-Based Access Control System</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="form-error">⚠️ {error}</div>}

          <button
            id="login-submit"
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="login-demo-accounts">
          <p className="demo-title">Demo Accounts (password: <code>password123</code>)</p>
          <div className="demo-grid">
            <button
              className="demo-chip admin"
              onClick={() => { setEmail('admin@example.com'); setPassword('password123'); }}
            >
              👑 Admin
            </button>
            <button
              className="demo-chip manager"
              onClick={() => { setEmail('manager@example.com'); setPassword('password123'); }}
            >
              🏢 Manager
            </button>
            <button
              className="demo-chip employee"
              onClick={() => { setEmail('employee@example.com'); setPassword('password123'); }}
            >
              👤 Employee
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
