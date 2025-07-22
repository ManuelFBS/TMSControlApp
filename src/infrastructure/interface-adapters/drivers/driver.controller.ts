import {
        Controller,
        Get,
        Post,
        Body,
        Param,
        Put,
        Delete,
        UseGuards,
        ParseIntPipe,
} from '@nestjs/common';
import { DriverService } from '../../../application/use-cases/drivers/driver.service';
import {
        CreateDriverDTO,
        DriverResponseDTO,
} from '../../../application/dto/drivers/create-driver.dto';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { Permissions } from '../../../core/permissions/permissions.decorator';
import { PermissionsGuard } from '../../../auth/guards/permissions.guard';
import { plainToInstance } from 'class-transformer';

@Controller('api/drivers')
export class DriverController {
        constructor(private readonly driverService: DriverService) {}

        @Post('/driver/new')
        @UseGuards(JWTAuthGuard, PermissionsGuard)
        @Permissions('employee:create')
        async create(
                @Body() createDriverDTO: CreateDriverDTO,
        ): Promise<DriverResponseDTO> {
                const driver =
                        await this.driverService.createDriver(createDriverDTO);

                return plainToInstance(DriverResponseDTO, driver);
        }

        @Get()
        @UseGuards(JWTAuthGuard, PermissionsGuard)
        @Permissions('driver:read')
        async findAll(): Promise<DriverResponseDTO[]> {
                const drivers = await this.driverService.findAllDrivers();

                //* Se ordena por DNI...
                drivers.sort((a, b) => Number(a) - Number(b));

                return drivers.map((driver) =>
                        plainToInstance(DriverResponseDTO, {
                                dni: driver.dni,
                                driverLicense: driver.driverLicense,
                                idCompany: driver.idCompany,
                        }),
                );
        }
}
