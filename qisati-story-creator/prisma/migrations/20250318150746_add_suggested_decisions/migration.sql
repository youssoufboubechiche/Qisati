/*
  Warnings:

  - You are about to drop the column `suggestedDecision1` on the `StoryPage` table. All the data in the column will be lost.
  - You are about to drop the column `suggestedDecision2` on the `StoryPage` table. All the data in the column will be lost.
  - Added the required column `suggestedDecisions` to the `StoryPage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StoryPage" DROP COLUMN "suggestedDecision1",
DROP COLUMN "suggestedDecision2",
ADD COLUMN     "suggestedDecisions" JSONB NOT NULL DEFAULT '[]';
