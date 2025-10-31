-- CreateTable
CREATE TABLE `StatsTemplates` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(256) NOT NULL,
    `entityType` VARCHAR(50) NOT NULL,
    `sportId` INTEGER NOT NULL,
    `leagueId` INTEGER NULL,
    `schema` JSON NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `StatsTemplates_sportId_idx`(`sportId`),
    INDEX `StatsTemplates_leagueId_idx`(`leagueId`),
    INDEX `StatsTemplates_entityType_idx`(`entityType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EntityStats` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entityId` INTEGER NOT NULL,
    `parentId` INTEGER NULL,
    `season` VARCHAR(50) NOT NULL,
    `statsType` VARCHAR(50) NOT NULL,
    `templateId` INTEGER NULL,
    `stats` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `EntityStats_entityId_idx`(`entityId`),
    INDEX `EntityStats_season_idx`(`season`),
    INDEX `EntityStats_templateId_idx`(`templateId`),
    INDEX `EntityStats_parentId_idx`(`parentId`),
    UNIQUE INDEX `EntityStats_entityId_season_parentId_statsType_templateId_key`(`entityId`, `season`, `parentId`, `statsType`, `templateId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `StatsTemplates` ADD CONSTRAINT `StatsTemplates_sportId_fkey` FOREIGN KEY (`sportId`) REFERENCES `Entities`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StatsTemplates` ADD CONSTRAINT `StatsTemplates_leagueId_fkey` FOREIGN KEY (`leagueId`) REFERENCES `Entities`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EntityStats` ADD CONSTRAINT `EntityStats_entityId_fkey` FOREIGN KEY (`entityId`) REFERENCES `Entities`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EntityStats` ADD CONSTRAINT `EntityStats_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Entities`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EntityStats` ADD CONSTRAINT `EntityStats_templateId_fkey` FOREIGN KEY (`templateId`) REFERENCES `StatsTemplates`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
