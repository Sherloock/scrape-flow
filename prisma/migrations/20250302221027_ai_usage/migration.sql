/*
  Warnings:

  - You are about to alter the column `credits` on the `userbalance` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Decimal(10,6)`.

*/
-- AlterTable
ALTER TABLE `userbalance` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `credits` DECIMAL(10, 6) NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE `AIUsage` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `inputTokens` INTEGER NOT NULL,
    `outputTokens` INTEGER NOT NULL,
    `creditsConsumed` DECIMAL(10, 6) NOT NULL DEFAULT 0,
    `workflowId` VARCHAR(191) NULL,
    `executionPhaseId` VARCHAR(191) NULL,
    `workflowExecutionId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `AIUsage_userId_idx`(`userId`),
    INDEX `AIUsage_workflowId_idx`(`workflowId`),
    INDEX `AIUsage_executionPhaseId_idx`(`executionPhaseId`),
    INDEX `AIUsage_workflowExecutionId_idx`(`workflowExecutionId`),
    INDEX `AIUsage_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `AIUsage` ADD CONSTRAINT `AIUsage_workflowId_fkey` FOREIGN KEY (`workflowId`) REFERENCES `Workflow`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AIUsage` ADD CONSTRAINT `AIUsage_executionPhaseId_fkey` FOREIGN KEY (`executionPhaseId`) REFERENCES `ExecutionPhase`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `AIUsage` ADD CONSTRAINT `AIUsage_workflowExecutionId_fkey` FOREIGN KEY (`workflowExecutionId`) REFERENCES `WorkflowExecution`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
