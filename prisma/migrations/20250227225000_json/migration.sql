/*
  Warnings:

  - You are about to alter the column `value` on the `credential` table. The data in that column could be lost. The data in that column will be cast from `Text` to `Json`.
  - You are about to alter the column `node` on the `executionphase` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `Json`.

*/
-- AlterTable
ALTER TABLE `credential` MODIFY `value` JSON NOT NULL;

-- AlterTable
ALTER TABLE `executionphase` MODIFY `node` JSON NOT NULL;
