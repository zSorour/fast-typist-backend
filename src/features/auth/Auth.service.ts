import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import AccountModel from '@models/Account';

import { RegisterInput, LoginInput } from '@schemas/account';
import AppError from '@errors/AppError';
import redis from '@config/redis';

type TokenPayload = { username: string };

export default class AuthService {
  accountModel: AccountModel;

  constructor() {
    this.accountModel = new AccountModel();
  }

  public async register({ username, email, password }: RegisterInput) {
    const account = await this.accountModel.getAccount(username, email);
    if (account) {
      throw new AppError('Failed to create account', ['User already exists']);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return await this.accountModel.createAccount({
      username,
      email,
      password: hashedPassword
    });
  }

  public async login({ username, password }: LoginInput) {
    const account = await this.accountModel.getAccount(username);
    if (!account) {
      throw new AppError('Failed to login', ['Account does not exist']);
    }

    const isPasswordCorrect = await bcrypt.compare(password, account.password);
    if (!isPasswordCorrect) {
      throw new AppError('Failed to login', ['Incorrect password']);
    }

    const accessToken = this.generateAccessToken({
      username: account.username
    });
    const refreshToken = await this.generateRefreshToken({
      username: account.username
    });

    return { accessToken, refreshToken };
  }

  public async logout(refreshToken: string) {
    this.verifyRefreshToken(refreshToken);

    await redis.del(`refresh:${refreshToken}`);
  }

  public async verifyRefreshToken(refreshToken: string) {
    let decodedToken: TokenPayload;
    try {
      decodedToken = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_TOKEN_SECRET!
      ) as { username: string };
    } catch (error) {
      throw new AppError('Unauthorized', ['Refresh token is invalid']);
    }

    const tokenExists = await redis.get(`refresh:${refreshToken}`);

    if (!tokenExists) {
      throw new AppError('Unauthorized', ['Refresh token does not exist']);
    }

    return decodedToken;
  }

  public verifyAccessToken(accessToken: string) {
    let decodedToken: TokenPayload;
    try {
      decodedToken = jwt.verify(
        accessToken,
        process.env.JWT_ACCESS_TOKEN_SECRET!
      ) as { username: string };
    } catch (error: any) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AppError('Unauthorized', ['Token expired.']);
      }
      console.log(error);
      throw new AppError('Unauthorized', ['Access token is invalid']);
    }
    return decodedToken;
  }

  public generateAccessToken(payload: TokenPayload) {
    const expiryDuration = parseInt(
      process.env.JWT_ACCESS_TOKEN_EXPIRY_TIME!,
      10
    );

    const accessToken = jwt.sign(
      payload,
      process.env.JWT_ACCESS_TOKEN_SECRET!,
      {
        expiresIn: expiryDuration
      }
    );
    return accessToken;
  }

  public async generateRefreshToken(payload: TokenPayload) {
    const expiryDuration = parseInt(
      process.env.JWT_REFRESH_TOKEN_EXPIRY_TIME!,
      10
    );

    const refreshToken = jwt.sign(
      payload,
      process.env.JWT_REFRESH_TOKEN_SECRET!,
      {
        expiresIn: expiryDuration
      }
    );
    await redis.set(`refresh:${refreshToken}`, 1, {
      EX: expiryDuration
    });
    return refreshToken;
  }
}
