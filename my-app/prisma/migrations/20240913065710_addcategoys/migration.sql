/*
  Warnings:

  - The values [ROLE_PLAYING] on the enum `GameType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `categoryId` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `maxPlayer` on the `Game` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "GameType_new" AS ENUM ('VIDEO_GAME', 'BOARD_GAME', 'TABLETOP_RPG');
ALTER TABLE "Category" ALTER COLUMN "type" TYPE "GameType_new" USING ("type"::text::"GameType_new");
ALTER TYPE "GameType" RENAME TO "GameType_old";
ALTER TYPE "GameType_new" RENAME TO "GameType";
DROP TYPE "GameType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_categoryId_fkey";

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "categoryId",
DROP COLUMN "maxPlayer",
ADD COLUMN     "player_max" INTEGER;

-- CreateTable
CREATE TABLE "_categories" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_categories_AB_unique" ON "_categories"("A", "B");

-- CreateIndex
CREATE INDEX "_categories_B_index" ON "_categories"("B");

-- AddForeignKey
ALTER TABLE "_categories" ADD CONSTRAINT "_categories_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_categories" ADD CONSTRAINT "_categories_B_fkey" FOREIGN KEY ("B") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;
