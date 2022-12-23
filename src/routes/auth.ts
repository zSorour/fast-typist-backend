import { Router } from 'express';

import AuthController from '@controllers/Auth';
import validate from '@middlewares/validator';
import { loginSchema, registerSchema } from '@schemas/account';

const authRouter = Router();
const authController = new AuthController();

authRouter.post(
  '/login',
  validate(loginSchema, 'Unable to log you in'),
  authController.login
);
authRouter.post(
  '/register',
  validate(registerSchema, 'Unable to create an account'),
  authController.register
);

export default authRouter;
