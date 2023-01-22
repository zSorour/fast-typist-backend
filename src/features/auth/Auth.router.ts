import { Router } from 'express';

import AuthController from './Auth.controller';
import validate from '@middlewares/validator';
import { loginSchema, registerSchema } from '@schemas/account';

const authRouter = Router();
const authController = new AuthController();

authRouter.post(
  '/login',
  validate(loginSchema, 'Unable to log you in'),
  authController.login.bind(authController)
);
authRouter.post(
  '/register',
  validate(registerSchema, 'Unable to create an account'),
  authController.register.bind(authController)
);
authRouter.post('/logout', authController.logout.bind(authController));

authRouter.post('/refresh', authController.refresh.bind(authController));

authRouter.post(
  '/verify-logged-in',
  authController.dummyVerifyLoggedIn.bind(authController)
);

export default authRouter;
