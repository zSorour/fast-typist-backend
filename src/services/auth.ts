import bcrypt from 'bcrypt';

import AccountModel from '@models/Account';

import { RegisterInput, LoginInput } from '@schemas/account';
import { AppError } from '@models/AppError';

export default class AuthService {
  accountModel: AccountModel;

  constructor() {
    this.accountModel = new AccountModel();
  }

  public login = async ({ username, password }: LoginInput) => {
    const account = await this.accountModel.getAccount(username);
    if (!account) {
      throw new AppError('Failed to login', ['Account does not exist']);
    }

    const isPasswordCorrect = await bcrypt.compare(password, account.password);
    if (!isPasswordCorrect) {
      throw new AppError('Failed to login', ['Incorrect password']);
    }
    // TODO: generate token
    return account;
  };

  public register = async ({ username, email, password }: RegisterInput) => {
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
  };
}
