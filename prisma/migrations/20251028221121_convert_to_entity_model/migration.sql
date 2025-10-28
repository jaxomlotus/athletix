/*
  Warnings:

  - The primary key for the `Accounts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Accounts` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `userId` on the `Accounts` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `Clips` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Clips` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `Sessions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Sessions` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `userId` on the `Sessions` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `UserClips` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `UserClips` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `userId` on the `UserClips` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to alter the column `clipId` on the `UserClips` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - The primary key for the `Users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to drop the `Leagues` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Sport` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TeamUsers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Teams` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Accounts` DROP FOREIGN KEY `Accounts_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Leagues` DROP FOREIGN KEY `Leagues_sportId_fkey`;

-- DropForeignKey
ALTER TABLE `Sessions` DROP FOREIGN KEY `Sessions_userId_fkey`;

-- DropForeignKey
ALTER TABLE `TeamUsers` DROP FOREIGN KEY `TeamUsers_teamId_fkey`;

-- DropForeignKey
ALTER TABLE `TeamUsers` DROP FOREIGN KEY `TeamUsers_userId_fkey`;

-- DropForeignKey
ALTER TABLE `Teams` DROP FOREIGN KEY `Teams_leagueId_fkey`;

-- DropForeignKey
ALTER TABLE `Teams` DROP FOREIGN KEY `Teams_sportId_fkey`;

-- DropForeignKey
ALTER TABLE `UserClips` DROP FOREIGN KEY `UserClips_clipId_fkey`;

-- DropForeignKey
ALTER TABLE `UserClips` DROP FOREIGN KEY `UserClips_userId_fkey`;

-- DropIndex
DROP INDEX `Accounts_userId_fkey` ON `Accounts`;

-- DropIndex
DROP INDEX `Sessions_userId_fkey` ON `Sessions`;

-- DropIndex
DROP INDEX `UserClips_clipId_fkey` ON `UserClips`;

-- DropIndex
DROP INDEX `UserClips_userId_fkey` ON `UserClips`;

-- AlterTable
ALTER TABLE `Accounts` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `userId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Clips` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Sessions` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `userId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `UserClips` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `userId` INTEGER NOT NULL,
    MODIFY `clipId` INTEGER NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `Users` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- DropTable
DROP TABLE `Leagues`;

-- DropTable
DROP TABLE `Sport`;

-- DropTable
DROP TABLE `TeamUsers`;

-- DropTable
DROP TABLE `Teams`;

-- CreateTable
CREATE TABLE `Entities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(50) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `name` VARCHAR(256) NOT NULL,
    `description` TEXT NULL,
    `logo` TEXT NULL,
    `banner` TEXT NULL,
    `parentId` INTEGER NULL,
    `childEntities` VARCHAR(100) NULL,
    `ownerId` INTEGER NULL,
    `modsJson` JSON NULL,
    `followerCount` INTEGER NOT NULL DEFAULT 0,
    `metadata` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Entities_slug_key`(`slug`),
    INDEX `Entities_type_idx`(`type`),
    INDEX `Entities_parentId_idx`(`parentId`),
    INDEX `Entities_ownerId_idx`(`ownerId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Follows` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `entityId` INTEGER NOT NULL,
    `followedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Follows_userId_idx`(`userId`),
    INDEX `Follows_entityId_idx`(`entityId`),
    UNIQUE INDEX `Follows_userId_entityId_key`(`userId`, `entityId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EntityClips` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entityId` INTEGER NOT NULL,
    `clipId` INTEGER NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `addedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `EntityClips_entityId_clipId_key`(`entityId`, `clipId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Accounts` ADD CONSTRAINT `Accounts_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Sessions` ADD CONSTRAINT `Sessions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Entities` ADD CONSTRAINT `Entities_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Entities`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Entities` ADD CONSTRAINT `Entities_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Follows` ADD CONSTRAINT `Follows_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Follows` ADD CONSTRAINT `Follows_entityId_fkey` FOREIGN KEY (`entityId`) REFERENCES `Entities`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserClips` ADD CONSTRAINT `UserClips_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserClips` ADD CONSTRAINT `UserClips_clipId_fkey` FOREIGN KEY (`clipId`) REFERENCES `Clips`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EntityClips` ADD CONSTRAINT `EntityClips_entityId_fkey` FOREIGN KEY (`entityId`) REFERENCES `Entities`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EntityClips` ADD CONSTRAINT `EntityClips_clipId_fkey` FOREIGN KEY (`clipId`) REFERENCES `Clips`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
