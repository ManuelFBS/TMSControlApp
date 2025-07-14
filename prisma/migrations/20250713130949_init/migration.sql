-- CreateTable
CREATE TABLE `Employee` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dni` VARCHAR(20) NOT NULL,
    `names` VARCHAR(100) NOT NULL,
    `lastNames` VARCHAR(100) NOT NULL,
    `phone` VARCHAR(25) NOT NULL,
    `address` VARCHAR(240) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Employee_dni_key`(`dni`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
