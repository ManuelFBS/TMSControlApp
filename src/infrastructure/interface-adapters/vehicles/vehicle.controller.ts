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
        BadRequestException,
} from '@nestjs/common';
import { VehicleService } from '../../../application/use-cases/vehicles/vehicle.service';
import {
        CreateVehicleDTO,
        UpdateVehicleDTO,
        VehicleResponseDTO,
} from '../../../application/dto/vehicles/create-vehicle.dto';
import { SearchVehicleDTO } from '../../../application/dto/vehicles/search-vehicle.dto';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { Permissions } from '../../../core/permissions/permissions.decorator';
import { PermissionsGuard } from '../../../auth/guards/permissions.guard';
import { plainToInstance } from 'class-transformer';
import { retry } from 'rxjs';

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

        @Get('all')
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

        @Get('vehicle_id/:id')
        @UseGuards(JWTAuthGuard, PermissionsGuard)
        @Permissions('vehicle:create', 'vehicle:read')
        async findOne(
                @Param('id', ParseIntPipe) id: number,
        ): Promise<VehicleResponseDTO> {
                const vehicle = await this.vehicleService.findVehicleByID(id);

                return plainToInstance(VehicleResponseDTO, vehicle);
        }

        @Get('vehicle/brand')
        @UseGuards(JWTAuthGuard, PermissionsGuard)
        @Permissions('vehicle:create', 'vehicle:read')
        async findManyByBrand(
                @Body() searchBrandDTO: SearchVehicleDTO,
        ): Promise<VehicleResponseDTO[]> {
                const vehicles =
                        await this.vehicleService.findVehicleByBrand(
                                searchBrandDTO,
                        );

                return plainToInstance(VehicleResponseDTO, vehicles);
        }

        @Get('vehicle/type')
        @UseGuards(JWTAuthGuard, PermissionsGuard)
        @Permissions('vehicle:create', 'vehicle:read')
        async findManyByType(
                @Body() searchTypeOfVehicle: SearchVehicleDTO,
        ): Promise<VehicleResponseDTO[]> {
                const vehicles =
                        await this.vehicleService.findByTypeOfVehicle(
                                searchTypeOfVehicle,
                        );

                return plainToInstance(VehicleResponseDTO, vehicles);
        }

        @Get('vehicle/carplate')
        @UseGuards(JWTAuthGuard, PermissionsGuard)
        @Permissions('vehicle:create', 'vehicle:read')
        async findVehicleByPlate(
                @Body() searchByPlateDTO: SearchVehicleDTO,
        ): Promise<VehicleResponseDTO> {
                const vehicle =
                        await this.vehicleService.findVehicleByCarPlate(
                                searchByPlateDTO,
                        );

                return plainToInstance(VehicleResponseDTO, vehicle);
        }

        @Get('vehicle/assigned')
        @UseGuards(JWTAuthGuard, PermissionsGuard)
        @Permissions('vehicle:create', 'vehicle:read')
        async findByAssignment(
                @Body() searchByAssignDTO: SearchVehicleDTO,
        ): Promise<VehicleResponseDTO> {
                const assigned =
                        await this.vehicleService.findByAssignmentToDNI(
                                searchByAssignDTO,
                        );

                return plainToInstance(VehicleResponseDTO, assigned);
        }

        @Get('vehicle_id/update')
        @UseGuards(JWTAuthGuard, PermissionsGuard)
        @Permissions('vehicle:update')
        async updateVehicleByID(
                @Param('id', ParseIntPipe) id: number,
                @Body() updateVehicleByIdDTO: UpdateVehicleDTO,
        ): Promise<VehicleResponseDTO> {
                const updatedVehicle =
                        await this.vehicleService.updateVehicleByID(
                                id,
                                updateVehicleByIdDTO,
                        );

                return plainToInstance(VehicleResponseDTO, updatedVehicle);
        }

        @Get('vehicle_plate/update')
        @UseGuards(JWTAuthGuard, PermissionsGuard)
        @Permissions('vehicle:update')
        async updateVehicleByCarPlate(
                @Body() searchVehicleByPlateDTO: SearchVehicleDTO,
                updateVehicleByPlate: UpdateVehicleDTO,
        ): Promise<VehicleResponseDTO> {
                if (!searchVehicleByPlateDTO.carLicensePlate) {
                        throw new BadRequestException('');
                }
                const updatedVehicle =
                        await this.vehicleService.updateVehicleByCarPlate(
                                searchVehicleByPlateDTO.carLicensePlate,
                                updateVehicleByPlate,
                        );
        }
}
