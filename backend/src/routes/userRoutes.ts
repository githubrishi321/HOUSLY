import { Router } from 'express';
import { authenticate }       from '../middleware/auth';
import { requirePermission }  from '../middleware/permission';
import {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController';

const router = Router();

router.use(authenticate);

router.get(   '/',    requirePermission('view_users'),   getAllUsers);
router.post(  '/',    requirePermission('create_user'),  createUser);
router.put(   '/:id', requirePermission('edit_user'),    updateUser);
router.delete('/:id', requirePermission('delete_user'),  deleteUser);

export default router;
