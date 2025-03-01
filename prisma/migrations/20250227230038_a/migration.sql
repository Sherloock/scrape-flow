/*
  Warnings:

  - Made the column `inputs` on table `executionphase` required. This step will fail if there are existing NULL values in that column.
  - Made the column `outputs` on table `executionphase` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `executionphase` MODIFY `inputs` JSON NOT NULL,
    MODIFY `outputs` JSON NOT NULL;
