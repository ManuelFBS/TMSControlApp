import { Module } from '@nestjs/common';
import { VehicleService } from '../../application/use-cases/vehicles/vehicle.service';
import { VehicleController } from '../../infrastructure/interface-adapters/vehicles/vehicle.controller';
import { PrismaService } from '../../infrastructure/database/prisma/prisma.service';
import { PrismaVehicleRepository } from '../../infrastructure/repositories/vehicles/prisma-vehicle.repository';

Module({
        controllers: [VehicleController],
        providers: [
                VehicleService,
                PrismaService,
                {
                        provide: 'VehicleRepository',
                        useClass: PrismaVehicleRepository,
                },
        ],
        exports: [VehicleService, 'VehicleRepository'],
});
export class VehicleModule {}
