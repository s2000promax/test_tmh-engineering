/*
  Warnings:

  - The `category` column on the `tasks` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "CategoryEnum" AS ENUM ('DEVELOPMENT', 'PRODUCTION', 'TESTS', 'REPAIR', 'PURCHASE');

-- AlterTable
ALTER TABLE "tasks" DROP COLUMN "category",
ADD COLUMN     "category" "CategoryEnum";

-- CreateTable
CREATE TABLE "profile" (
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "avatat" TEXT NOT NULL,

    CONSTRAINT "profile_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "profile" ADD CONSTRAINT "profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
