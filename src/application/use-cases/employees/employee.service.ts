import {
        Injectable,
        Inject,
        BadRequestException,
        ConflictException,
        InternalServerErrorException,
        NotFoundException,
} from '@nestjs/common';
import { Employee } from '../../../core/entities/employees/employee.entity';
import { EmployeeRepository } from '../../../core/repositories/employees/employee.repository';
import {
        CreateEmployeeDTO,
        UpdateEmployeeDTO,
} from '../../dto/employees/create-employee.dto';
import {
        SearchEmployeeDTO,
        PaginatedEmployeeResponse,
} from '../../../application/dto/employees/search-employee.dto';

export class EmployeeService {
        constructor(
                @Inject('EmployeeRepository')
                private readonly employeeRepository: EmployeeRepository,
        ) {}

        async createEmployee(
                createEmployeeDTO: CreateEmployeeDTO,
        ): Promise<Employee> {
                //* Validar DNI único...
                if (
                        await this.employeeRepository.existsWithDNI(
                                createEmployeeDTO.dni,
                        )
                ) {
                        throw new ConflictException(
                                'El DNI ya está registrado...',
                        );
                }

                const employee = new Employee(
                        0,
                        createEmployeeDTO.dni,
                        createEmployeeDTO.names,
                        createEmployeeDTO.lastNames,
                        createEmployeeDTO.phone,
                        createEmployeeDTO.address,
                        new Date(),
                        new Date(),
                );

                const createdEmployee =
                        await this.employeeRepository.create(employee);

                return createdEmployee;
        }

        async findAllEmployees(): Promise<Employee[]> {
                return this.employeeRepository.findAll();
        }

        async findEmployeeByID(id: number): Promise<Employee> {
                const employee = await this.employeeRepository.findByID(id);
                if (!employee) {
                        throw new NotFoundException(
                                `Empleado con ID ${id} no encontrado`,
                        );
                }
                return employee;
        }

        async findByDNI(dni: string): Promise<Employee> {
                const employee = await this.employeeRepository.findByDNI(dni);

                if (!employee) {
                        if (!employee) {
                                throw new NotFoundException(
                                        `Empleado con DNI ${dni} no encontrado...`,
                                );
                        }
                }

                return employee;
        }

        async findByNamesOrLastNames(
                searchDTO: SearchEmployeeDTO,
        ): Promise<PaginatedEmployeeResponse> {
                try {
                        //* Validación de parámetros...
                        const namesTrimmed = searchDTO.names?.trim() || '';
                        const lastNamesTrimmed =
                                searchDTO.lastNames?.trim() || '';

                        //* Verificar que al menos uno de los parámetros tenga contenido...
                        if (!namesTrimmed && !lastNamesTrimmed) {
                                throw new BadRequestException(
                                        'Debe proporcionar al menos un nombre o apellido para la búsqueda',
                                );
                        }

                        //* Validar longitud mínima de los parámetros...
                        if (
                                namesTrimmed.length < 3 &&
                                lastNamesTrimmed.length < 3
                        ) {
                                throw new BadRequestException(
                                        'Los términos de búsqueda deben tener al menos 3 caracteres',
                                );
                        }

                        //* Obtener parámetros de paginación con valores por defecto...
                        const page = searchDTO.page || 1;
                        const limit = searchDTO.limit || 10;

                        //* Llamar al método del repositorio con paginación...
                        const { employees, total } =
                                await this.employeeRepository.findByNamesOrLastnamesWithPagination(
                                        namesTrimmed,
                                        lastNamesTrimmed,
                                        page,
                                        limit,
                                );

                        //* Calcular información de paginación...
                        const totalPages = Math.ceil(total / limit);
                        const hasNext = page < totalPages;
                        const hasPrev = page > 1;

                        //* Log para debugging...
                        console.log(
                                `Búsqueda paginada: nombres="${namesTrimmed}", apellidos="${lastNamesTrimmed}". Página: ${page}, Límite: ${limit}, Total: ${total}`,
                        );

                        return {
                                employees,
                                total,
                                page,
                                limit,
                                totalPages,
                                hasNext,
                                hasPrev,
                        };
                } catch (error) {
                        //* Si es un error que ya manejamos, lo relanzamos
                        if (error instanceof BadRequestException) {
                                throw error;
                        }

                        //* Para otros errores, lanzamos un error genérico
                        console.error(
                                'Error en búsqueda paginada de empleados:',
                                error,
                        );
                        throw new InternalServerErrorException(
                                'Error interno del servidor al buscar empleados',
                        );
                }
        }

        async updateByID(
                id: number,
                updateEmployeeDTO: UpdateEmployeeDTO,
        ): Promise<Employee> {
                //* Verificar existencia...
                if (await this.findEmployeeByID(id)) {
                        throw new NotFoundException(
                                `Empleado con ID ${id} no encontrado...`,
                        );
                }

                return this.employeeRepository.updateByID(
                        id,
                        updateEmployeeDTO,
                );
        }

        async updateByDNI(
                dni: string,
                updateEmployeeDTO: UpdateEmployeeDTO,
        ): Promise<Employee> {
                //* Verificar existencia...
                if (await this.findByDNI(dni)) {
                        throw new NotFoundException(
                                `Empleado con DNI ${dni} no encontrado`,
                        );
                }

                return this.employeeRepository.updateByDNI(
                        dni,
                        updateEmployeeDTO,
                );
        }

        async delete(id: number): Promise<void> {
                //* Verificar existencia del empleado...
                if (await this.findEmployeeByID(id)) {
                        throw new NotFoundException(
                                `El empleado con el ID ${id} no encontrado.`,
                        );
                }

                await this.employeeRepository.delete(id);
        }
}
