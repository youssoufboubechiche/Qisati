/*
  Warnings:

  - Added the required column `imagePrompt` to the `StoryPage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StoryPage" ADD COLUMN     "imagePrompt" TEXT NOT NULL DEFAULT '';
