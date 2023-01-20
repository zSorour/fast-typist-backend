-- DropForeignKey
ALTER TABLE "MultiplayerGame" DROP CONSTRAINT "MultiplayerGame_gameId_fkey";

-- DropForeignKey
ALTER TABLE "SinglePlayerGame" DROP CONSTRAINT "SinglePlayerGame_gameId_fkey";

-- AddForeignKey
ALTER TABLE "SinglePlayerGame" ADD CONSTRAINT "SinglePlayerGame_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MultiplayerGame" ADD CONSTRAINT "MultiplayerGame_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;
