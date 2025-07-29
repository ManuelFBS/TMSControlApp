import {
        Injectable,
        Inject,
        BadRequestException,
        ConflictException,
        NotFoundException,
} from '@nestjs/common';
import {
        TypeOfVehicle,
        Vehicle,
} from '../../../core/entities/vehicles/vehicle.entity';
import { VehicleRepository } from '../../../core/repositories/vehicles/vehicle.repository';
import {
        CreateVehicleDTO,
        UpdateVehicleDTO,
} from '../../dto/vehicles/create-vehicle.dto';
import { SearchVehicleDTO } from '../../dto/vehicles/search-vehicle.dto';

@Injectable()
export class VehicleService {
        constructor(
                @Inject('VehicleRepository')
                private readonly vehicleRepository: VehicleRepository,
        ) {}

        async createVehicle(
                createVehicleDTO: CreateVehicleDTO,
        ): Promise<Vehicle> {
                //* Validar placa del vehículo...
                if (
                        await this.vehicleRepository.findByPlate(
                                createVehicleDTO.carLicensePlate,
                        )
                ) {
                        throw new ConflictException(
                                `La placa ${createVehicleDTO.carLicensePlate} ya se encuentra registrada.`,
                        );
                }

                const vehicle = new Vehicle(
                        0,
                        createVehicleDTO.carLicensePlate,
                        createVehicleDTO.typeOfVehicle,
                        createVehicleDTO.brandOfVehicle,
                        createVehicleDTO.idCompany,
                        createVehicleDTO.dniDriver,
                        new Date(),
                        new Date(),
                );

                const createNewVehicle =
                        await this.vehicleRepository.create(vehicle);

                return createNewVehicle;
        }

        async findAllVehicles(): Promise<Vehicle[]> {
                return this.vehicleRepository.findAll();
        }

        async findByTypeOfVehicle(
                searchTypeVehicleDTO: SearchVehicleDTO,
        ): Promise<Vehicle[]> {
                //* Validación de parámetros...
                const typeVeh =
                        searchTypeVehicleDTO.typeOfVehicle?.trim() || '';
                //
                if (!typeVeh) {
                        throw new BadRequestException(
                                'Debe proporcionar al menos un tipo de vehículo.',
                        );
                }

                const vehicles =
                        await this.vehicleRepository.findByType(typeVeh);

                return vehicles;
        }

        async findVehicleByBrand(
                searchBrandDTO: SearchVehicleDTO,
        ): Promise<Vehicle[]> {
                //* Validación de parámetros...
                const brandOfVeh = searchBrandDTO.brandOfVehicle?.trim() || '';
                //
                if (!brandOfVeh) {
                        throw new BadRequestException(
                                'Debe proporcionar al menos una marca de vehículo.',
                        );
                }

                //* Se comprueba la longitud del valor de 'brandOfVeh' introducido...
                if (brandOfVeh.length < 3) {
                        throw new BadRequestException(
                                'La marca introducida debe tener un mínimo de 3 caracteres.',
                        );
                }

                const vehicles =
                        await this.vehicleRepository.findByBrand(brandOfVeh);

                return vehicles;
        }

        async findVehicleByID(id: number): Promise<Vehicle> {
                const vehicle = await this.vehicleRepository.findByID(id);

                if (!vehicle) {
                        throw new NotFoundException(
                                `Vehículo con ID ${id} no encontrado.`,
                        );
                }
                return vehicle;
        }

        async findVehicleByCarPlate(
                searchPlateDTO: SearchVehicleDTO,
        ): Promise<Vehicle> {
                //* Validación de parámetros...
                const carPlate = searchPlateDTO.carLicensePlate?.trim() || '';

                if (!carPlate) {
                        throw new BadRequestException(
                                'Debe introducir un valor válido.',
                        );
                }

                //* Se verifica que la longitud del valor introducido sea correcta...
                if (carPlate.length < 5) {
                        throw new BadRequestException(
                                'Debe introducir un valor de placa válido de al menos 5 caracteres.',
                        );
                }

                const vehicle =
                        await this.vehicleRepository.findByPlate(carPlate);

                //* Se verifica existencia del vehículo con placa requerida...
                if (!vehicle) {
                        throw new NotFoundException(
                                `No existe el vehículo con placas ${carPlate} registrado.`,
                        );
                }

                return vehicle;
        }

        async findByAssignmentToDNI(dniDriver: string): Promise<Vehicle> {
                const vehicle =
                        await this.vehicleRepository.FindByAssignment(
                                dniDriver,
                        );

                if (!vehicle) {
                        throw new NotFoundException(
                                `Este conductor con DNI ${dniDriver} NO tiene vehículo asignado.`,
                        );
                }

                return vehicle;
        }

        async updateVehicleByID(
                id: number,
                updateVehicleDTO: UpdateVehicleDTO,
        ): Promise<Vehicle> {
                //* Se verifica existencia del ID...
                await this.findVehicleByID(id);

                const updatedVehicle = await this.vehicleRepository.updateByID(
                        id,
                        updateVehicleDTO,
                );

                return updatedVehicle;
        }

        async updateVehicleByCarPlate(
                carLicensePlate: string,
                updateVehicleDTO: UpdateVehicleDTO,
        ): Promise<Vehicle> {
                const plate: any = carLicensePlate;

                //* Se verifica existencia de la placa...
                if (await this.findVehicleByCarPlate(plate)) {
                        throw new NotFoundException(
                                `Vehículo con placas ${plate} NO existe.`,
                        );
                }

                await this.findVehicleByCarPlate(plate);

                const updatedVehicle =
                        await this.vehicleRepository.updateByPlate(
                                carLicensePlate,
                                updateVehicleDTO,
                        );

                return updatedVehicle;
        }

        async deleteVehicleByID(id: number): Promise<void> {
                //* Se verifica existencia...
                if (!(await this.findVehicleByID(id))) {
                        throw new NotFoundException(
                                `Vehículo con ID ${id} NO encontrado.`,
                        );
                }

                return this.vehicleRepository.deleteByID(id);
        }

        async deleteVehicleByCarPlate(
                searchForDeleteDTO: SearchVehicleDTO,
        ): Promise<void> {
                const plate: any = searchForDeleteDTO.carLicensePlate;

                //* Se verifica existencia...
                if (!(await this.findVehicleByCarPlate(plate))) {
                        throw new NotFoundException(
                                `Vehículo con placas ${plate} NO encontrado.`,
                        );
                }

                return this.vehicleRepository.deleteByPlate(plate);
        }
}
