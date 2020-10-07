import { AuthController } from '../controller/AuthController';
import { checkJwt } from '../middleware/jwt';
import { Router } from 'express';

const routes = Router();

// Login
routes.use('/login', AuthController.login);
routes.use('/changePassword', [checkJwt], AuthController.changePassword);



export default routes;