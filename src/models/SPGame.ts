import Prisma from '@config/prisma';

type CreateSPGameParams = {
  username: string;
  startTimestamp: number;
  score: number;
  wpm: number;
};

export default class SPGame {
  public async createSPGame(params: CreateSPGameParams) {
    const startDateTime = new Date(params.startTimestamp).toISOString();
    const endDateTime = new Date().toISOString();
    return await Prisma.singlePlayerGame.create({
      data: {
        score: params.score,
        player: {
          connect: {
            accountId: params.username
          }
        },
        game: {
          create: {
            startDateTime: startDateTime,
            endDateTime: endDateTime,
            wpm: params.wpm
          }
        }
      }
    });
  }
  public async getPlayerTopScore(username: string) {
    const result = await Prisma.singlePlayerGame.aggregate({
      _max: {
        score: true
      },
      where: {
        playerId: username
      }
    });
    return result._max.score;
  }
}
