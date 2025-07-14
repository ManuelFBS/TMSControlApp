-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dni` VARCHAR(20) NOT NULL,
    `username` VARCHAR(15) NOT NULL,
    `password` VARCHAR(20) NOT NULL,
    `role` ENUM('Owner', 'Admin', 'Employee') NOT NULL DEFAULT 'Employee',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_dni_key`(`dni`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_dni_fkey` FOREIGN KEY (`dni`) REFERENCES `Employee`(`dni`) ON DELETE CASCADE ON UPDATE CASCADE;
