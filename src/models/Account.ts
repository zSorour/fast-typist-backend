import Prisma from '@config/db';

export default class Account {
  public getAccount = async (username: string, email?: string) => {
    return await Prisma.account.findFirst({
      where: {
        OR: [
          {
            username: username
          },
          {
            email: email
          }
        ]
      }
    });
  };

  public createAccount = async (account: any) => {
    const newAccount = await Prisma.account.create({
      data: account
    });
    await Prisma.player.create({
      data: {
        accountId: account.username
      }
    });
    return newAccount;
  };
}
