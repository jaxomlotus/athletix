-- CreateTable
CREATE TABLE `TeamMemberships` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `playerId` INTEGER NOT NULL,
    `teamId` INTEGER NOT NULL,
    `jerseyNumber` INTEGER NULL,
    `positions` JSON NULL,
    `season` VARCHAR(50) NULL,
    `startDate` DATETIME(3) NULL,
    `endDate` DATETIME(3) NULL,
    `isCurrent` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `TeamMemberships_playerId_idx`(`playerId`),
    INDEX `TeamMemberships_teamId_idx`(`teamId`),
    INDEX `TeamMemberships_isCurrent_idx`(`isCurrent`),
    UNIQUE INDEX `TeamMemberships_playerId_teamId_season_key`(`playerId`, `teamId`, `season`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TeamMemberships` ADD CONSTRAINT `TeamMemberships_playerId_fkey` FOREIGN KEY (`playerId`) REFERENCES `Entities`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TeamMemberships` ADD CONSTRAINT `TeamMemberships_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `Entities`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
