import { UserController } from '../controller/UserController';
import { Router } from 'express';
import { checkJwt } from '../middleware/jwt';
import { checkRole } from '../middleware/role';

const router = Router();

// get all User
router.get('/',[checkJwt, checkRole(['admin'])],UserController.getAll);

// Get one User
router.get('/:id', [checkJwt, checkRole(['admin'])],UserController.getById);

// Create new User
router.post('/', [checkJwt, checkRole(['admin'])], UserController.newUser);

// edit user 
router.patch('/:id', [checkJwt, checkRole(['admin'])], UserController.editUser);

// Delete user
router.delete('/:id', [checkJwt, checkRole(['admin'])], UserController.deleteUser);


export default router;