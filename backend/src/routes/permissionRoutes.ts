import { Router } from 'express';
import { authenticate }      from '../middleware/auth';
import { requirePermission } from '../middleware/permission';
import {
  getAllPermissions,
  getRolePermissions,
} from '../controllers/permissionController';

const router = Router();

router.use(authenticate);

router.get('/',      requirePermission('manage_settings'), getAllPermissions);
router.get('/roles', requirePermission('manage_settings'), getRolePermissions);

export default router;
