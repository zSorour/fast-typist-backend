import { Request, Response, Router } from 'express';

import AuthController from '@controllers/Auth';

const authRouter = Router();
const authController = new AuthController();

authRouter.post('/login', authController.login);
authRouter.post('/register', authController.register);

export default authRouter;
