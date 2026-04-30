import React, { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import { PermissionGuard } from './components/PermissionGuard';

// ── Protected Route ───────────────────────────────────────────
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return (
    <>
      <Navbar />
      <main className="main-content">{children}</main>
    </>
  );
}

// ── App Routes ────────────────────────────────────────────────
function AppRoutes() {
  const { token } = useAuth();

  return (
    <Routes>
      {/* Public */}
      <Route
        path="/login"
        element={token ? <Navigate to="/dashboard" replace /> : <Login />}
      />

      {/* Protected */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <PermissionGuard
              permission="view_users"
              fallback={
                <div className="access-denied">
                  <div className="denied-icon">🚫</div>
                  <h2>Access Denied</h2>
                  <p>You don't have permission to view this page.</p>
                  <p className="denied-perm">Required: <code>view_users</code></p>
                </div>
              }
            >
              <Users />
            </PermissionGuard>
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to={token ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
}

// ── Root ──────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
