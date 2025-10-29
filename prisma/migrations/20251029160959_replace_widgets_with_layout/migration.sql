/*
  Warnings:

  - You are about to drop the column `widgets` on the `Entities` table. All the data in the column will be lost.
  - You are about to drop the column `widgetsCustom` on the `Entities` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Entities` DROP COLUMN `widgets`,
    DROP COLUMN `widgetsCustom`,
    ADD COLUMN `layout` JSON NULL;
