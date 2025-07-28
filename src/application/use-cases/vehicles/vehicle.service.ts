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

                return vehicle;
        }

        async findAllVehicles(): Promise<Vehicle[]> {
                return this.vehicleRepository.findAll();
        }

        async findByTypeOfVehicle(typeOfVehicle: string): Promise<Vehicle[]> {
                //* Validar que el tipo de vehículo sea el correcto...
                if (
                        !Object.values(TypeOfVehicle).includes(
                                typeOfVehicle as TypeOfVehicle,
                        )
                ) {
                        throw new BadRequestException(
                                `Tipo de vehículo inválido: ${typeOfVehicle}`,
                        );
                }

                const vehicles =
                        await this.vehicleRepository.findByType(typeOfVehicle);
                return vehicles;
        }

        async findVehiclesByBrand(brandOfVehicle: string): Promise<Vehicle[]> {
                const vehicles =
                        await this.vehicleRepository.findByBrand(
                                brandOfVehicle,
                        );

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

        async findVehicleByCarPlate(carLicensePlate: string): Promise<Vehicle> {
                const vehicle =
                        await this.vehicleRepository.findByPlate(
                                carLicensePlate,
                        );

                if (!vehicle) {
                        throw new NotFoundException(
                                `El vehículo con placas ${carLicensePlate} NO se encuentra registrado.`,
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
                if (await this.findVehicleByID(id)) {
                        throw new NotFoundException(
                                `Vehículo con ID ${id} NO existe.`,
                        );
                }

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
                //* Se verifica existencia del ID...
                if (await this.findVehicleByCarPlate(carLicensePlate)) {
                        throw new NotFoundException(
                                `Vehículo con placas ${carLicensePlate} NO existe.`,
                        );
                }

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

        async deleteVehicleByCarPlate(carLicensePlate: string): Promise<void> {
                //* Se verifica existencia...
                if (!(await this.findVehicleByCarPlate(carLicensePlate))) {
                        throw new NotFoundException(
                                `Vehículo con placas ${carLicensePlate} NO encontrado.`,
                        );
                }

                return this.vehicleRepository.deleteByPlate(carLicensePlate);
        }
}
