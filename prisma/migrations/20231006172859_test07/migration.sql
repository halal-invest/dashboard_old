-- CreateTable
CREATE TABLE `SiteInfo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `logo` VARCHAR(191) NULL,
    `title` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,

    UNIQUE INDEX `SiteInfo_title_key`(`title`),
    UNIQUE INDEX `SiteInfo_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
