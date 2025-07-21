import { Module } from '@nestjs/common';
import { TransportCompanyService } from '../../application/use-cases/transport-company/transport_company.service';
import { TransportCompanyController } from '../../infrastructure/interface-adapters/transport-company/transport_company.controller';
import { PrismaTransportCompanyRepositorty } from '../../infrastructure/repositories/transport-company/prisma-transport_company.repository';
import { PrismaService } from '../../infrastructure/database/prisma/prisma.service';

Module({
        controllers: [TransportCompanyController],
        providers: [
                TransportCompanyService,
                PrismaService,
                {
                        provide: 'TransportCompanyRepository',
                        useClass: PrismaTransportCompanyRepositorty,
                },
        ],
        exports: [TransportCompanyService, 'TransportCompanyRepository'],
});
export class TransportCompanyModule {}
