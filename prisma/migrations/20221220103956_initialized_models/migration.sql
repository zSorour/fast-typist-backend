-- CreateTable
CREATE TABLE "Account" (
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("username")
);

-- CreateTable
CREATE TABLE "Player" (
    "accountId" TEXT NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("accountId")
);

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "startDateTime" TIMESTAMP(3) NOT NULL,
    "endDateTime" TIMESTAMP(3) NOT NULL,
    "wpm" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SinglePlayerGame" (
    "gameId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "MultiplayerGame" (
    "gameId" TEXT NOT NULL,
    "winnerId" TEXT NOT NULL,

    CONSTRAINT "MultiplayerGame_pkey" PRIMARY KEY ("gameId")
);

-- CreateTable
CREATE TABLE "_Player_MultiplayerGames" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_email_key" ON "Account"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Player_accountId_key" ON "Player"("accountId");

-- CreateIndex
CREATE UNIQUE INDEX "SinglePlayerGame_gameId_key" ON "SinglePlayerGame"("gameId");

-- CreateIndex
CREATE UNIQUE INDEX "MultiplayerGame_gameId_key" ON "MultiplayerGame"("gameId");

-- CreateIndex
CREATE UNIQUE INDEX "_Player_MultiplayerGames_AB_unique" ON "_Player_MultiplayerGames"("A", "B");

-- CreateIndex
CREATE INDEX "_Player_MultiplayerGames_B_index" ON "_Player_MultiplayerGames"("B");

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("username") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SinglePlayerGame" ADD CONSTRAINT "SinglePlayerGame_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SinglePlayerGame" ADD CONSTRAINT "SinglePlayerGame_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("accountId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MultiplayerGame" ADD CONSTRAINT "MultiplayerGame_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MultiplayerGame" ADD CONSTRAINT "MultiplayerGame_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "Player"("accountId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Player_MultiplayerGames" ADD CONSTRAINT "_Player_MultiplayerGames_A_fkey" FOREIGN KEY ("A") REFERENCES "MultiplayerGame"("gameId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Player_MultiplayerGames" ADD CONSTRAINT "_Player_MultiplayerGames_B_fkey" FOREIGN KEY ("B") REFERENCES "Player"("accountId") ON DELETE CASCADE ON UPDATE CASCADE;
