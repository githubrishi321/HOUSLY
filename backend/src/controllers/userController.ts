import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import pool from '../config/db';

// GET /api/users
export async function getAllUsers(_req: Request, res: Response): Promise<void> {
  try {
    const [rows] = await pool.query<any[]>(
      `SELECT
         u.id,
         u.name,
         u.email,
         r.name  AS role_name,
         d.name  AS department_name,
         u.created_at
       FROM users u
       JOIN roles       r ON u.role_id       = r.id
       JOIN departments d ON u.department_id = d.id
       ORDER BY u.id`
    );
    res.json(rows);
  } catch (err) {
    console.error('getAllUsers error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
}

// POST /api/users
export async function createUser(req: Request, res: Response): Promise<void> {
  const { name, email, password, role_id, department_id } = req.body as {
    name: string;
    email: string;
    password: string;
    role_id: number;
    department_id: number;
  };

  if (!name || !email || !password || !role_id || !department_id) {
    res.status(400).json({ message: 'All fields are required.' });
    return;
  }

  try {
    const password_hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query<any>(
      `INSERT INTO users (name, email, password_hash, role_id, department_id)
       VALUES (?, ?, ?, ?, ?)`,
      [name, email, password_hash, role_id, department_id]
    );
    res.status(201).json({ message: 'User created.', id: result.insertId });
  } catch (err: any) {
    if (err.code === 'ER_DUP_ENTRY') {
      res.status(409).json({ message: 'Email already exists.' });
      return;
    }
    console.error('createUser error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
}

// PUT /api/users/:id
export async function updateUser(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  const { name, email, role_id, department_id } = req.body as {
    name?: string;
    email?: string;
    role_id?: number;
    department_id?: number;
  };

  try {
    const [result] = await pool.query<any>(
      `UPDATE users SET
         name          = COALESCE(?, name),
         email         = COALESCE(?, email),
         role_id       = COALESCE(?, role_id),
         department_id = COALESCE(?, department_id)
       WHERE id = ?`,
      [name ?? null, email ?? null, role_id ?? null, department_id ?? null, id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    res.json({ message: 'User updated.' });
  } catch (err) {
    console.error('updateUser error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
}

// DELETE /api/users/:id
export async function deleteUser(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  try {
    const [result] = await pool.query<any>(
      `DELETE FROM users WHERE id = ?`,
      [id]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    res.json({ message: 'User deleted.' });
  } catch (err) {
    console.error('deleteUser error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
}
