import { Module } from '@nestjs/common';
import { DriverService } from '../../application/use-cases/drivers/driver.service';
import { DriverController } from '../../infrastructure/interface-adapters/drivers/driver.controller';
import { PrismaDriverRepository } from '../../infrastructure/repositories/drivers/prisma-driver.repository';
import { PrismaService } from '../../infrastructure/database/prisma/prisma.service';

Module({
        controllers: [DriverController],
        providers: [
                DriverService,
                PrismaService,
                {
                        provide: 'DriverRepository',
                        useClass: PrismaDriverRepository,
                },
        ],
        exports: [DriverService, 'DriverRepository'],
});
export class DriverModule {}
