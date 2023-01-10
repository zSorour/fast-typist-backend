/*
  Warnings:

  - You are about to drop the column `score` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the `_Player_MultiplayerGames` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `score` to the `SinglePlayerGame` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_Player_MultiplayerGames" DROP CONSTRAINT "_Player_MultiplayerGames_A_fkey";

-- DropForeignKey
ALTER TABLE "_Player_MultiplayerGames" DROP CONSTRAINT "_Player_MultiplayerGames_B_fkey";

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "score";

-- AlterTable
ALTER TABLE "SinglePlayerGame" ADD COLUMN     "score" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_Player_MultiplayerGames";

-- CreateTable
CREATE TABLE "PlayersOnMultiplayerGames" (
    "playerId" TEXT NOT NULL,
    "gameId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "PlayersOnMultiplayerGames_pkey" PRIMARY KEY ("playerId","gameId")
);

-- AddForeignKey
ALTER TABLE "PlayersOnMultiplayerGames" ADD CONSTRAINT "PlayersOnMultiplayerGames_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("accountId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayersOnMultiplayerGames" ADD CONSTRAINT "PlayersOnMultiplayerGames_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "MultiplayerGame"("gameId") ON DELETE RESTRICT ON UPDATE CASCADE;
