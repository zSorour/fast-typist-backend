-- DropIndex
DROP INDEX "MultiplayerGame_gameId_key";

-- DropIndex
DROP INDEX "SinglePlayerGame_gameId_key";

-- AlterTable
ALTER TABLE "SinglePlayerGame" ADD CONSTRAINT "SinglePlayerGame_pkey" PRIMARY KEY ("gameId");
