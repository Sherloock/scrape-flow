/*
  Warnings:

  - A unique constraint covering the columns `[executionPhaseId]` on the table `AIUsage` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `AIUsage_executionPhaseId_key` ON `AIUsage`(`executionPhaseId`);
