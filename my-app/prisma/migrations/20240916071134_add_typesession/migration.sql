-- CreateEnum
CREATE TYPE "SessionType" AS ENUM ('PUBLIC', 'PRIVATE');

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "type_session" "SessionType" NOT NULL DEFAULT 'PUBLIC';
