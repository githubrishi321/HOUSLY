import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../config/db';
import type { DbUser } from '../types';

// POST /api/auth/login
export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body as { email: string; password: string };

  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required.' });
    return;
  }

  try {
    const [rows] = await pool.query<any[]>(
      `SELECT
         u.id,
         u.name,
         u.email,
         u.password_hash,
         u.role_id,
         r.name  AS role_name,
         u.department_id,
         d.name  AS department_name,
         u.created_at
       FROM users u
       JOIN roles       r ON u.role_id       = r.id
       JOIN departments d ON u.department_id = d.id
       WHERE u.email = ?`,
      [email]
    );

    const user: DbUser | undefined = (rows as DbUser[])[0];

    if (!user) {
      res.status(401).json({ message: 'Invalid credentials.' });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      res.status(401).json({ message: 'Invalid credentials.' });
      return;
    }

    const [permRows] = await pool.query<any[]>(
      `SELECT p.name
       FROM role_permissions rp
       JOIN permissions p ON rp.permission_id = p.id
       WHERE rp.role_id = ?`,
      [user.role_id]
    );

    const permissions: string[] = (permRows as { name: string }[]).map(
      (r) => r.name
    );

    const secret = process.env['JWT_SECRET'] ?? 'fallback_secret';
    const expiresIn = process.env['JWT_EXPIRES_IN'] ?? '8h';

    const payload = {
      userId:         user.id,
      roleId:         user.role_id,
      roleName:       user.role_name,
      departmentName: user.department_name,
      name:           user.name,
      email:          user.email,
      permissions,
    };

    const token = jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);

    res.status(200).json({
      token,
      user: {
        id:             user.id,
        name:           user.name,
        email:          user.email,
        roleName:       user.role_name,
        departmentName: user.department_name,
        permissions,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
}
