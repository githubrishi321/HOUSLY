// ─── Frontend Types ───────────────────────────────────────────────────────────

export interface User {
  id: number;
  name: string;
  email: string;
  roleName: string;
  departmentName: string;
  permissions: string[];
}

export interface UserRow {
  id: number;
  name: string;
  email: string;
  role_name: string;
  department_name: string;
  created_at: string;
}

export type Permission =
  | 'view_dashboard'
  | 'view_users'
  | 'create_user'
  | 'edit_user'
  | 'delete_user'
  | 'view_reports'
  | 'create_report'
  | 'manage_settings';
