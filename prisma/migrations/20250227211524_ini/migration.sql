-- CreateTable
CREATE TABLE `Workflow` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `definition` JSON NOT NULL,
    `executionPlan` TEXT NULL,
    `creditsCost` INTEGER NOT NULL DEFAULT 0,
    `cron` VARCHAR(50) NULL,
    `status` VARCHAR(20) NOT NULL,
    `lastRunAt` DATETIME(3) NULL,
    `lastRunId` VARCHAR(100) NULL,
    `lastRunStatus` VARCHAR(50) NULL,
    `nextRunAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Workflow_userId_name_key`(`userId`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WorkflowExecution` (
    `id` VARCHAR(191) NOT NULL,
    `workflowId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `trigger` VARCHAR(20) NOT NULL,
    `status` VARCHAR(20) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `startedAt` DATETIME(3) NULL,
    `completedAt` DATETIME(3) NULL,
    `definition` JSON NOT NULL,
    `creditsConsumed` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExecutionPhase` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `status` VARCHAR(20) NOT NULL,
    `number` INTEGER NOT NULL,
    `node` VARCHAR(100) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `startedAt` DATETIME(3) NULL,
    `completedAt` DATETIME(3) NULL,
    `inputs` TEXT NULL,
    `outputs` TEXT NULL,
    `creditsConsumed` INTEGER NULL,
    `workflowExecutionId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExecutionLog` (
    `id` VARCHAR(191) NOT NULL,
    `logLevel` VARCHAR(20) NOT NULL,
    `message` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `timestamp` DATETIME(3) NULL,
    `executionPhaseId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserBalance` (
    `userId` VARCHAR(191) NOT NULL,
    `credits` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Credential` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `value` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Credential_userId_name_key`(`userId`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserPurchase` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `stripeId` VARCHAR(100) NOT NULL,
    `description` VARCHAR(255) NOT NULL,
    `credits` INTEGER NOT NULL,
    `price` INTEGER NOT NULL,
    `currency` VARCHAR(3) NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `WorkflowExecution` ADD CONSTRAINT `WorkflowExecution_workflowId_fkey` FOREIGN KEY (`workflowId`) REFERENCES `Workflow`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExecutionPhase` ADD CONSTRAINT `ExecutionPhase_workflowExecutionId_fkey` FOREIGN KEY (`workflowExecutionId`) REFERENCES `WorkflowExecution`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExecutionLog` ADD CONSTRAINT `ExecutionLog_executionPhaseId_fkey` FOREIGN KEY (`executionPhaseId`) REFERENCES `ExecutionPhase`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
