/*
  Warnings:

  - You are about to drop the column `workflowExecutionId` on the `aiusage` table. All the data in the column will be lost.
  - You are about to drop the column `workflowId` on the `aiusage` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `aiusage` DROP FOREIGN KEY `AIUsage_workflowExecutionId_fkey`;

-- DropForeignKey
ALTER TABLE `aiusage` DROP FOREIGN KEY `AIUsage_workflowId_fkey`;

-- DropIndex
DROP INDEX `AIUsage_workflowExecutionId_idx` ON `aiusage`;

-- DropIndex
DROP INDEX `AIUsage_workflowId_idx` ON `aiusage`;

-- AlterTable
ALTER TABLE `aiusage` DROP COLUMN `workflowExecutionId`,
    DROP COLUMN `workflowId`;
