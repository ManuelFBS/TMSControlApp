import {
        Body,
        Controller,
        Delete,
        Get,
        Param,
        ParseIntPipe,
        Post,
        Put,
        UseGuards,
} from '@nestjs/common';
import { TransportCompanyService } from '../../../application/use-cases/transport-company/transport_company.service';
import {
        CreateTransportCompanyDTO,
        TransportCompanyResponseDTO,
        UpdateTransportCompanyDTO,
} from 'src/application/dto/transport-company/create-transport_company.dto';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { Permissions } from '../../../core/permissions/permissions.decorator';
import { PermissionsGuard } from '../../../auth/guards/permissions.guard';
import { plainToInstance } from 'class-transformer';

@Controller('api/company')
export class TransportCompanyController {
        constructor(
                private readonly transportCompanyService: TransportCompanyService,
        ) {}

        @Post('company/new')
        @UseGuards(JWTAuthGuard, PermissionsGuard)
        @Permissions('employee:create')
        async create() {}
}
