/*
  Warnings:

  - A unique constraint covering the columns `[firebase_id]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "firebase_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_firebase_id_key" ON "User"("firebase_id");
