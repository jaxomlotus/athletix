-- AlterTable
ALTER TABLE `Entities` ADD COLUMN `widgets` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `widgetsCustom` JSON NULL;
