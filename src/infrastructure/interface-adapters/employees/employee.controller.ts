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
import { EmployeeService } from '../../../application/use-cases/employees/employee.service';
import {
        CreateEmployeeDTO,
        UpdateEmployeeDTO,
        EmployeeResponseDTO,
        EmployeePublicResponseDTO,
} from '../../../application/dto/employees/create-employee.dto';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { Permissions } from '../../../core/permissions/permissions.decorator';
import { PermissionsGuard } from '../../../auth/guards/permissions.guard';
import { plainToInstance } from 'class-transformer';
import { SearchEmployeeDTO } from '../../../application/dto/employees/search-employee.dto';

@Controller('api/employees')
export class EmployeeController {
        constructor(private readonly employeeService: EmployeeService) {}

        @Post('employee/new')
        @UseGuards(JWTAuthGuard, PermissionsGuard)
        @Permissions('employee:create')
        async create(
                @Body() createEmployeeDTO: CreateEmployeeDTO,
        ): Promise<EmployeeResponseDTO> {
                const employee =
                        await this.employeeService.createEmployee(
                                createEmployeeDTO,
                        );

                return plainToInstance(EmployeeResponseDTO, employee);
        }

        @Get()
        @UseGuards(JWTAuthGuard, PermissionsGuard)
        @Permissions('employee:read')
        async findAll(): Promise<EmployeePublicResponseDTO[]> {
                const employees = await this.employeeService.findAllEmployees();

                //* Se ordena por 'cédula' en forma ascendente...
                employees.sort((a, b) => Number(a.dni) - Number(b.dni));

                //* Se mapea y (opcionalmente) se transforma a instancia de DTO...
                return employees.map((emp) =>
                        plainToInstance(EmployeePublicResponseDTO, {
                                dni: emp.dni,
                                nombres: emp.names,
                                apellidos: emp.lastNames,
                                telefono: emp.phone,
                                direccion: emp.address,
                        }),
                );
        }

        @Get('byid/:id')
        @UseGuards(JWTAuthGuard, PermissionsGuard)
        @Permissions('employee:create', 'employee:read')
        async findOne(
                @Param('id', ParseIntPipe) id: number,
        ): Promise<EmployeeResponseDTO> {
                const employee =
                        await this.employeeService.findEmployeeByID(id);

                return plainToInstance(EmployeeResponseDTO, employee);
        }

        @Get('bydni/:dni')
        @UseGuards(JWTAuthGuard, PermissionsGuard)
        @Permissions('employee:create', 'employee:read')
        async findByCedula(
                @Param('dni') dni: string,
        ): Promise<EmployeeResponseDTO> {
                const employee = await this.employeeService.findByDNI(dni);

                return plainToInstance(EmployeeResponseDTO, employee);
        }

        @Get('byname_or_lastname')
        @UseGuards(JWTAuthGuard, PermissionsGuard)
        @Permissions('employee:create', 'employee:read')
        async findByNamesOrLastnames(
                @Body() searchEmployeeDTO: SearchEmployeeDTO,
        ) {
                return await this.employeeService.findByNamesOrLastNames(
                        searchEmployeeDTO,
                );
        }

        @Put('update_byid/:id')
        @UseGuards(JWTAuthGuard, PermissionsGuard)
        @Permissions('employee:create', 'employee:read', 'employee:update')
        async updateEmployeeByID(
                @Param('id', ParseIntPipe) id: number,
                @Body() updateEmployeeDTO: UpdateEmployeeDTO,
        ): Promise<EmployeeResponseDTO> {
                const updatedEmployee = await this.employeeService.updateByID(
                        id,
                        updateEmployeeDTO,
                );

                return plainToInstance(EmployeeResponseDTO, updatedEmployee);
        }

        @Put('update_bydni/:cedula')
        @UseGuards(JWTAuthGuard, PermissionsGuard)
        @Permissions('employee:create', 'employee:read', 'employee:update')
        async updateEmployeeByCedula(
                @Param('dni') dni: string,
                @Body() updateEmployeeDTO: UpdateEmployeeDTO,
        ): Promise<EmployeeResponseDTO> {
                const updatedEmployee = await this.employeeService.updateByDNI(
                        dni,
                        updateEmployeeDTO,
                );

                return plainToInstance(EmployeeResponseDTO, updatedEmployee);
        }

        @Delete('delete_byid/:id')
        @UseGuards(JWTAuthGuard, PermissionsGuard)
        @Permissions('employee:create', 'employee:read', 'employee:delete')
        async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
                await this.employeeService.delete(id);
        }
}
