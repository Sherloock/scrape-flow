/*
  Warnings:

  - You are about to alter the column `credits` on the `userbalance` table. The data in that column could be lost. The data in that column will be cast from `Decimal(10,6)` to `Decimal(20,6)`.

*/
-- AlterTable
ALTER TABLE `userbalance` MODIFY `credits` DECIMAL(20, 6) NOT NULL DEFAULT 0;
