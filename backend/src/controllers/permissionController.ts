import { Request, Response } from 'express';
import pool from '../config/db';

export async function getAllPermissions(_req: Request, res: Response): Promise<void> {
  try {
    const [rows] = await pool.query<any[]>(
      `SELECT id, name FROM permissions ORDER BY id`
    );
    res.json(rows);
  } catch (err) {
    console.error('getAllPermissions error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
}

export async function getRolePermissions(_req: Request, res: Response): Promise<void> {
  try {
    const [rows] = await pool.query<any[]>(
      `SELECT r.id AS role_id, r.name AS role_name, p.id AS permission_id, p.name AS permission_name
       FROM roles r
       LEFT JOIN role_permissions rp ON r.id = rp.role_id
       LEFT JOIN permissions p ON rp.permission_id = p.id
       ORDER BY r.id, p.id`
    );
    res.json(rows);
  } catch (err) {
    console.error('getRolePermissions error:', err);
    res.status(500).json({ message: 'Internal server error.' });
  }
}
