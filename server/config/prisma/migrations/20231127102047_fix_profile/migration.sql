/*
  Warnings:

  - You are about to drop the column `avatat` on the `profile` table. All the data in the column will be lost.
  - Added the required column `avatar` to the `profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "profile" DROP COLUMN "avatat",
ADD COLUMN     "avatar" TEXT NOT NULL;
