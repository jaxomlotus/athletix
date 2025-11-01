/*
  Warnings:

  - You are about to drop the column `access_token` on the `Accounts` table. All the data in the column will be lost.
  - You are about to drop the column `expires_at` on the `Accounts` table. All the data in the column will be lost.
  - You are about to drop the column `id_token` on the `Accounts` table. All the data in the column will be lost.
  - You are about to drop the column `provider` on the `Accounts` table. All the data in the column will be lost.
  - You are about to drop the column `providerAccountId` on the `Accounts` table. All the data in the column will be lost.
  - You are about to drop the column `refresh_token` on the `Accounts` table. All the data in the column will be lost.
  - You are about to drop the column `session_state` on the `Accounts` table. All the data in the column will be lost.
  - You are about to drop the column `token_type` on the `Accounts` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Accounts` table. All the data in the column will be lost.
  - You are about to drop the column `expires` on the `Sessions` table. All the data in the column will be lost.
  - You are about to drop the column `sessionToken` on the `Sessions` table. All the data in the column will be lost.
  - The `emailVerified` column on the `Users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `VerificationTokens` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[providerId,accountId]` on the table `Accounts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[token]` on the table `Sessions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accountId` to the `Accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `providerId` to the `Accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Accounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiresAt` to the `Sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token` to the `Sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Sessions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `Users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `Accounts_provider_providerAccountId_key` ON `Accounts`;

-- DropIndex
DROP INDEX `Sessions_sessionToken_key` ON `Sessions`;

-- AlterTable
ALTER TABLE `Accounts` DROP COLUMN `access_token`,
    DROP COLUMN `expires_at`,
    DROP COLUMN `id_token`,
    DROP COLUMN `provider`,
    DROP COLUMN `providerAccountId`,
    DROP COLUMN `refresh_token`,
    DROP COLUMN `session_state`,
    DROP COLUMN `token_type`,
    DROP COLUMN `type`,
    ADD COLUMN `accessToken` TEXT NULL,
    ADD COLUMN `accessTokenExpiresAt` DATETIME(3) NULL,
    ADD COLUMN `accountId` VARCHAR(191) NOT NULL,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `idToken` TEXT NULL,
    ADD COLUMN `password` TEXT NULL,
    ADD COLUMN `providerId` VARCHAR(191) NOT NULL,
    ADD COLUMN `refreshToken` TEXT NULL,
    ADD COLUMN `refreshTokenExpiresAt` DATETIME(3) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Entities` ADD COLUMN `commentCount` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `discussionCount` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `Sessions` DROP COLUMN `expires`,
    DROP COLUMN `sessionToken`,
    ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `expiresAt` DATETIME(3) NOT NULL,
    ADD COLUMN `ipAddress` VARCHAR(191) NULL,
    ADD COLUMN `token` VARCHAR(191) NOT NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `userAgent` TEXT NULL;

-- AlterTable
ALTER TABLE `Users` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    MODIFY `email` VARCHAR(191) NOT NULL,
    DROP COLUMN `emailVerified`,
    ADD COLUMN `emailVerified` BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE `VerificationTokens`;

-- CreateTable
CREATE TABLE `Verifications` (
    `id` VARCHAR(191) NOT NULL,
    `identifier` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Verifications_identifier_value_key`(`identifier`, `value`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DiscussionCategories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `color` VARCHAR(20) NULL,
    `icon` VARCHAR(50) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `DiscussionCategories_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DiscussionTopics` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(256) NOT NULL,
    `content` TEXT NOT NULL,
    `authorId` INTEGER NOT NULL,
    `categoryId` INTEGER NULL,
    `subjectType` VARCHAR(50) NOT NULL,
    `subjectId` INTEGER NOT NULL,
    `viewCount` INTEGER NOT NULL DEFAULT 0,
    `commentCount` INTEGER NOT NULL DEFAULT 0,
    `likeCount` INTEGER NOT NULL DEFAULT 0,
    `isPinned` BOOLEAN NOT NULL DEFAULT false,
    `isLocked` BOOLEAN NOT NULL DEFAULT false,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `lastCommentAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `DiscussionTopics_subjectType_subjectId_idx`(`subjectType`, `subjectId`),
    INDEX `DiscussionTopics_categoryId_idx`(`categoryId`),
    INDEX `DiscussionTopics_authorId_idx`(`authorId`),
    INDEX `DiscussionTopics_isPinned_lastCommentAt_idx`(`isPinned`, `lastCommentAt`),
    INDEX `DiscussionTopics_isDeleted_idx`(`isDeleted`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DiscussionComments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `authorId` INTEGER NOT NULL,
    `content` TEXT NOT NULL,
    `parentType` VARCHAR(50) NOT NULL,
    `parentId` INTEGER NOT NULL,
    `replyToCommentId` INTEGER NULL,
    `replyToUserId` INTEGER NULL,
    `likeCount` INTEGER NOT NULL DEFAULT 0,
    `replyCount` INTEGER NOT NULL DEFAULT 0,
    `isDeleted` BOOLEAN NOT NULL DEFAULT false,
    `isEdited` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `DiscussionComments_parentType_parentId_replyToCommentId_idx`(`parentType`, `parentId`, `replyToCommentId`),
    INDEX `DiscussionComments_authorId_idx`(`authorId`),
    INDEX `DiscussionComments_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DiscussionLikes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `likeableType` VARCHAR(50) NOT NULL,
    `likeableId` INTEGER NOT NULL,
    `topicId` INTEGER NULL,
    `commentId` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `DiscussionLikes_userId_idx`(`userId`),
    INDEX `DiscussionLikes_likeableType_likeableId_idx`(`likeableType`, `likeableId`),
    UNIQUE INDEX `DiscussionLikes_userId_likeableType_likeableId_key`(`userId`, `likeableType`, `likeableId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Accounts_providerId_accountId_key` ON `Accounts`(`providerId`, `accountId`);

-- CreateIndex
CREATE UNIQUE INDEX `Sessions_token_key` ON `Sessions`(`token`);

-- AddForeignKey
ALTER TABLE `DiscussionTopics` ADD CONSTRAINT `DiscussionTopics_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DiscussionTopics` ADD CONSTRAINT `DiscussionTopics_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `DiscussionCategories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DiscussionComments` ADD CONSTRAINT `DiscussionComments_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DiscussionComments` ADD CONSTRAINT `DiscussionComments_replyToCommentId_fkey` FOREIGN KEY (`replyToCommentId`) REFERENCES `DiscussionComments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DiscussionComments` ADD CONSTRAINT `DiscussionComments_replyToUserId_fkey` FOREIGN KEY (`replyToUserId`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DiscussionLikes` ADD CONSTRAINT `DiscussionLikes_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DiscussionLikes` ADD CONSTRAINT `DiscussionLikes_topicId_fkey` FOREIGN KEY (`topicId`) REFERENCES `DiscussionTopics`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DiscussionLikes` ADD CONSTRAINT `DiscussionLikes_commentId_fkey` FOREIGN KEY (`commentId`) REFERENCES `DiscussionComments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `Accounts` RENAME INDEX `Accounts_userId_fkey` TO `Accounts_userId_idx`;

-- RenameIndex
ALTER TABLE `Sessions` RENAME INDEX `Sessions_userId_fkey` TO `Sessions_userId_idx`;
