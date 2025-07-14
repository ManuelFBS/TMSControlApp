-- CreateTable
CREATE TABLE `UserSession` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dni` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `initDate` DATETIME(3) NOT NULL,
    `initHour` VARCHAR(191) NOT NULL,
    `finalDate` DATETIME(3) NULL,
    `finalHour` VARCHAR(191) NULL,

    INDEX `UserSession_dni_idx`(`dni`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserSession` ADD CONSTRAINT `UserSession_dni_fkey` FOREIGN KEY (`dni`) REFERENCES `User`(`dni`) ON DELETE RESTRICT ON UPDATE CASCADE;
