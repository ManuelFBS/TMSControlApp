import {
        Injectable,
        Inject,
        ConflictException,
        NotFoundException,
        BadRequestException,
} from '@nestjs/common';
import { EmployeeRepository } from '../../../core/repositories/employees/employee.repository';
import { Driver } from '../../../core/entities/drivers/driver.entity';
import { DriverRepository } from '../../../core/repositories/drivers/driver.repository';
import { CreateDriverDTO } from '../../dto/drivers/create-driver.dto';
import { promises } from 'dns';

@Injectable()
export class DriverService {
        constructor(
                @Inject('DriverRepository')
                private readonly driverRepository: DriverRepository,
                @Inject('EmployeeRepository')
                private readonly employeeRepository: EmployeeRepository,
        ) {}

        async createDriver(createDriverDTO: CreateDriverDTO): Promise<Driver> {
                //* 1. Verificar que el empleado existe...
                const employee = await this.employeeRepository.findByDNI(
                        createDriverDTO.dni,
                );
                if (!employee) {
                        throw new NotFoundException(
                                `Employee with DNI ${createDriverDTO.dni} not found`,
                        );
                }

                //* 2. Verificar que no exista otro conductor con el mismo DNI...
                const existingDriverByDNI =
                        await this.driverRepository.findByDNI(
                                createDriverDTO.dni,
                        );
                if (existingDriverByDNI) {
                        throw new ConflictException(
                                `Ya existe registrado un conductor con el DNI ${createDriverDTO.dni}`,
                        );
                }

                const driver = new Driver(
                        0,
                        createDriverDTO.dni,
                        createDriverDTO.driverLicense,
                        createDriverDTO.idCompany,
                );

                const createdDriver =
                        await this.driverRepository.create(driver);

                return createdDriver;
        }

        async findAllDrivers(): Promise<Driver[]> {
                const drivers = await this.driverRepository.findAll();
                return drivers;
        }

        async findDriverByID(id: number): Promise<Driver> {
                const driver = await this.driverRepository.findByID(id);

                if (!driver) {
                        throw new NotFoundException(
                                `No existe un conductor con el ID ${id}`,
                        );
                }

                return driver;
        }

        async findDriverByDNI(dni: string): Promise<Driver> {
                const driver = await this.driverRepository.findByDNI(dni);

                if (!driver) {
                        throw new NotFoundException(
                                `No existe un conductor con el DNI ${dni}`,
                        );
                }

                return driver;
        }

        async delete(id: number): Promise<void> {
                //* Verificar la existencia del conductor...
                if (!(await this.findDriverByID(id))) {
                        throw new NotFoundException(
                                `El conductor con el ID ${id} no existe.`,
                        );
                }

                await this.driverRepository.delete(id);
        }
}
