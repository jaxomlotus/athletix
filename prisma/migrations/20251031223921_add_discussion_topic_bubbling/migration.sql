-- AlterTable
ALTER TABLE `DiscussionTopics` ADD COLUMN `bubbleUp` BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE `DiscussionTopicEntities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `topicId` INTEGER NOT NULL,
    `entityId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `DiscussionTopicEntities_entityId_idx`(`entityId`),
    INDEX `DiscussionTopicEntities_topicId_idx`(`topicId`),
    UNIQUE INDEX `DiscussionTopicEntities_topicId_entityId_key`(`topicId`, `entityId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DiscussionTopicEntities` ADD CONSTRAINT `DiscussionTopicEntities_topicId_fkey` FOREIGN KEY (`topicId`) REFERENCES `DiscussionTopics`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DiscussionTopicEntities` ADD CONSTRAINT `DiscussionTopicEntities_entityId_fkey` FOREIGN KEY (`entityId`) REFERENCES `Entities`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
