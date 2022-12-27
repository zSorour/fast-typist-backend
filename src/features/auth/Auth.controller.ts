import { NextFunction, Request, Response } from 'express';

import AuthService from './Auth.service';
import { LoginInput, RegisterInput } from '@schemas/account';
import AppError from '@errors/AppError';
import HTTPError from '@errors/HTTPError';

export default class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password } = req.body as LoginInput;
      const { accessToken, refreshToken } = await this.authService.login({
        username,
        password
      });
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production'
      });
      return res.json(accessToken);
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

  public logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        throw new HTTPError('Failed to logout', 401, ['Unauthorized']);
      }
      await this.authService.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.json('Logged out');
    } catch (err: any) {
      if (err instanceof AppError) {
        res.status(401);
      }
      next(err);
    }
  };

  public refresh = async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      throw new HTTPError('Failed to refresh token', 401, ['Unauthorized']);
    }

    try {
      const { username } = await this.authService.verifyRefreshToken(
        refreshToken
      );
      const accessToken = this.authService.generateAccessToken({ username });
      return res.json(accessToken);
    } catch (err: any) {
      if (err instanceof AppError) {
        res.status(401);
      }
      next(err);
    }
  };

  public dummyVerifyLoggedIn = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      throw new HTTPError('Failed to verify logged in', 401, ['Unauthorized']);
    }
    const token = authorizationHeader.split(' ')[1];
    try {
      console.log(token);
      const { username } = await this.authService.verifyAccessToken(token);
      return res.json('Already Logged In...');
    } catch (error) {
      if (error instanceof AppError) {
        res.status(401);
      }
      next(error);
    }
  };
}
