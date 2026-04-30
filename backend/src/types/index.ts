// ─── Backend Types ────────────────────────────────────────────────────────────

export interface DbUser {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role_id: number;
  role_name: string;
  department_id: number;
  department_name: string;
  created_at: string;
}

export interface JwtPayload {
  userId: number;
  roleId: number;
  roleName: string;
  departmentName: string;
  name: string;
  email: string;
  permissions: string[];
}

// Extend Express Request to carry the decoded JWT payload
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
