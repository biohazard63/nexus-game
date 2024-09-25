/*
  Warnings:

  - You are about to drop the `_categories` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_categories" DROP CONSTRAINT "_categories_A_fkey";

-- DropForeignKey
ALTER TABLE "_categories" DROP CONSTRAINT "_categories_B_fkey";

-- DropTable
DROP TABLE "_categories";

-- CreateTable
CREATE TABLE "GameCategory" (
    "gameId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,

    CONSTRAINT "GameCategory_pkey" PRIMARY KEY ("gameId","categoryId")
);

-- AddForeignKey
ALTER TABLE "GameCategory" ADD CONSTRAINT "GameCategory_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameCategory" ADD CONSTRAINT "GameCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
