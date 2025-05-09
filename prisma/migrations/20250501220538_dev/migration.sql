-- CreateTable
CREATE TABLE `Feast` (
    `id` VARCHAR(191) NOT NULL,
    `saintName` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `commemorationDate` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ChurchFeast` (
    `id` VARCHAR(191) NOT NULL,
    `churchId` VARCHAR(191) NOT NULL,
    `feastId` VARCHAR(191) NOT NULL,
    `specialNotes` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `ChurchFeast_churchId_feastId_key`(`churchId`, `feastId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ChurchFeast` ADD CONSTRAINT `ChurchFeast_churchId_fkey` FOREIGN KEY (`churchId`) REFERENCES `Church`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ChurchFeast` ADD CONSTRAINT `ChurchFeast_feastId_fkey` FOREIGN KEY (`feastId`) REFERENCES `Feast`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
