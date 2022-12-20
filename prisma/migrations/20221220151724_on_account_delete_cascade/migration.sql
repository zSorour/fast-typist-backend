-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_accountId_fkey";

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("username") ON DELETE CASCADE ON UPDATE CASCADE;
