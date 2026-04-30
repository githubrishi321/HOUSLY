import { Request, Response, NextFunction } from 'express';

export function requirePermission(permission: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.user;
    if (!user) {
      res.status(401).json({ message: 'Not authenticated.' });
      return;
    }

    if (!user.permissions.includes(permission)) {
      res.status(403).json({
        message: `Forbidden. Missing permission: ${permission}`,
      });
      return;
    }

    next();
  };
}
