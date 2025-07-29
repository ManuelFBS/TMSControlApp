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
} from '../../../application/dto/transport-company/create-transport_company.dto';
import { SearchCompanyDTO } from '../../../application/dto/transport-company/search-company.dto';
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
        @Permissions('company:create')
        async create(
                @Body() createTransportCompanyDTO: CreateTransportCompanyDTO,
        ): Promise<TransportCompanyResponseDTO> {
                const company =
                        await this.transportCompanyService.createConpany(
                                createTransportCompanyDTO,
                        );

                return plainToInstance(TransportCompanyResponseDTO, company);
        }

        @Get()
        @UseGuards(JWTAuthGuard, PermissionsGuard)
        @Permissions('company:read')
        async findAll(): Promise<TransportCompanyResponseDTO[]> {
                const companies =
                        await this.transportCompanyService.findAllCompanies();

                //* Se ordena por 'companyName' en forma ascendente...
                companies.sort((a, b) =>
                        a.companyName.localeCompare(b.companyName),
                );

                //* Se mapea y (opcionalmente) se transforma a instancia de DTO...
                return companies.map((company) =>
                        plainToInstance(TransportCompanyResponseDTO, {
                                company: company.companyName,
                                contact: company.contactName,
                                phone: company.contactPhone,
                        }),
                );
        }

        @Get('company_byid/:id')
        @UseGuards(JWTAuthGuard, PermissionsGuard)
        @Permissions('company:read')
        async findOneByID(
                @Param('id', ParseIntPipe) id: number,
        ): Promise<TransportCompanyResponseDTO> {
                const company =
                        await this.transportCompanyService.findCompanyByID(id);

                return plainToInstance(TransportCompanyResponseDTO, company);
        }

        @Get('company_byIdComp/:idCompany')
        @UseGuards(JWTAuthGuard, PermissionsGuard)
        @Permissions('company:read')
        async findOneByIDCompany(
                @Param('idCompany') idCompany: string,
        ): Promise<TransportCompanyResponseDTO> {
                const company =
                        await this.transportCompanyService.findComapnyByIDComp(
                                idCompany,
                        );

                return plainToInstance(TransportCompanyResponseDTO, company);
        }

        @Get('company_byname/:idCompany')
        @UseGuards(JWTAuthGuard, PermissionsGuard)
        @Permissions('company:read')
        async findOneByCompanyName(
                @Body() searchCompanyDTO: SearchCompanyDTO,
        ): Promise<TransportCompanyResponseDTO> {
                return await this.transportCompanyService.findCompanyByName(
                        searchCompanyDTO,
                );
        }

        @Put('update_comp/:id')
        @UseGuards(JWTAuthGuard, PermissionsGuard)
        @Permissions('company:create', 'company:update')
        async updateCompanyByID(
                @Param('id', ParseIntPipe) id: number,
                @Body() updateTransportCompanyDTO: UpdateTransportCompanyDTO,
        ): Promise<TransportCompanyResponseDTO> {
                const updatedCompany =
                        await this.transportCompanyService.updateCompany(
                                id,
                                updateTransportCompanyDTO,
                        );

                return plainToInstance(
                        TransportCompanyResponseDTO,
                        updatedCompany,
                );
        }

        @Delete('delete_byid/:id')
        @UseGuards(JWTAuthGuard, PermissionsGuard)
        @Permissions('employee:create', 'employee:read', 'employee:delete')
        async removeCompany(
                @Param('id', ParseIntPipe) id: number,
        ): Promise<void> {
                await this.transportCompanyService.deleteCompany(id);
        }
}
