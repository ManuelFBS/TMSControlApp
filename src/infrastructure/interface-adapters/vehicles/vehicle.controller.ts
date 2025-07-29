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
import { VehicleService } from '../../../application/use-cases/vehicles/vehicle.service';
import {
        CreateVehicleDTO,
        UpdateVehicleDTO,
        VehicleResponseDTO,
} from '../../../application/dto/vehicles/create-vehicle.dto';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { Permissions } from '../../../core/permissions/permissions.decorator';
import { PermissionsGuard } from '../../../auth/guards/permissions.guard';
import { plainToInstance } from 'class-transformer';

@Controller('api/vehicles')
export class VehicleController {
        constructor(private readonly vehicleService: VehicleService) {}

        @Post('vehicle/new')
        @UseGuards(JWTAuthGuard, PermissionsGuard)
        @Permissions('vehicle:create')
        async create(
                @Body() createVehicleDTO: CreateVehicleDTO,
        ): Promise<VehicleResponseDTO> {
                const vehicle =
                        await this.vehicleService.createVehicle(
                                createVehicleDTO,
                        );

                return plainToInstance(VehicleResponseDTO, vehicle);
        }

        @Get()
        @UseGuards(JWTAuthGuard, PermissionsGuard)
        @Permissions('vehicle:read')
        async findAll(): Promise<VehicleResponseDTO[]> {
                const vehicles = await this.vehicleService.findAllVehicles();

                //* Se ordena por tipo de vehículo en forma ascendente...
                vehicles.sort((a, b) =>
                        a.typeOfVehicle.localeCompare(b.typeOfVehicle),
                );

                //* Se mapea y (opcionalmente) se transforma a instancia de DTO...
                return vehicles.map((vehicle) =>
                        plainToInstance(VehicleResponseDTO, {
                                placa: vehicle.carLicensePlate,
                                tipoVehiculo: vehicle.typeOfVehicle,
                                marca: vehicle.brandOfVehicle,
                                compañía: vehicle.idCompany,
                                conductor: vehicle.dniDriver,
                        }),
                );
        }
}
