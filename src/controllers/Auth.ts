import { NextFunction, Request, Response } from 'express';

import AuthService from '@services/Auth';

import { LoginInput, RegisterInput } from '@schemas/account';
import { HTTPError } from '@models/HTTPError';
import { AppError } from '@models/AppError';

export default class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password } = req.body as LoginInput;
      const account = await this.authService.login({ username, password });
      // TODO: respond with token
      return res.json(account);
    } catch (err: any) {
      if (err instanceof AppError) {
        res.status(401);
      }
      next(err);
    }
  };

  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, email, password } = req.body as RegisterInput;

      const account = await this.authService.register({
        username,
        email,
        password
      });
      return res.json(account);
    } catch (err: any) {
      if (err instanceof AppError) {
        res.status(422);
      }
      next(err);
    }
  };
}
