import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { Employee } from '../../../core/entities/employees/employee.entity';
import { EmployeeRepository } from '../../../core/repositories/employees/employee.repository';

@Injectable()
export class PrismaEmployeeRepository implements EmployeeRepository {
        constructor(private readonly prisma: PrismaService) {}

        //* Método auxiliar para normalizar texto (eliminar acentos y caracteres especiales)...
        private normalizeText(text: string): string {
                return text
                        .normalize('NFD') // Normaliza caracteres Unicode
                        .replace(/[\u0300-\u036f]/g, '') // Elimina diacríticos (acentos)
                        .toLowerCase() // Convierte a minúsculas
                        .trim(); // Elimina espacios en blanco
        }

        //* Método auxiliar para dividir texto en palabras...
        private splitIntoWords(text: string): string[] {
                return text
                        .split(/\s+/) // Divide por espacios (uno o más)
                        .filter((word) => word.length > 0) // Filtra palabras vacías
                        .map((word) => this.normalizeText(word)); // Normaliza cada palabra
        }

        private toDomain(prismaEmployee: any): Employee {
                return new Employee(
                        prismaEmployee.id,
                        prismaEmployee.dni,
                        prismaEmployee.names,
                        prismaEmployee.lastNames,
                        prismaEmployee.phone,
                        prismaEmployee.address,
                        prismaEmployee.createdAt,
                        prismaEmployee.updatedAt,
                );
        }

        async create(employee: Employee): Promise<Employee> {
                const created = await this.prisma.employee.create({
                        data: {
                                dni: employee.dni,
                                names: employee.names,
                                lastNames: employee.lastNames,
                                phone: employee.phone,
                                address: employee.address,
                        },
                });

                return this.toDomain(created);
        }

        async findAll(): Promise<Employee[]> {
                const employees = await this.prisma.employee.findMany({
                        orderBy: {
                                dni: 'asc',
                        },
                });

                return employees.map((emp) => this.toDomain(emp));
        }

        async findByID(id: number): Promise<Employee | null> {
                const employee = await this.prisma.employee.findUnique({
                        where: { id },
                });

                return employee ? this.toDomain(employee) : null;
        }

        async findByDNI(dni: string): Promise<Employee | null> {
                const employee = await this.prisma.employee.findUnique({
                        where: { dni },
                });

                return employee ? this.toDomain(employee) : null;
        }

        /**
         *
         * @param nombres - Nombres a buscar (uno o ambos, puede ser parcial)...
         * @param apellidos - Apellidos a buscar (uno o ambos, puede ser parcial)...
         * @returns - Retorna el(los) empleado(s) encontrado(s)...
         */
        async findByNombreOApellido(
                nombres: string,
                apellidos: string,
        ): Promise<Employee[]> {
                //* Se construyen condiciones de búsqueda dinámicamente...
                const whereConditions: any = [];

                //* Si se proporcionan nombres, buscar en el campo nombres...
                if (nombres && nombres.trim()) {
                        const normalizedNombres = this.normalizeText(nombres);
                        const nombreWords = this.splitIntoWords(nombres);

                        //* Búsqueda exacta normalizada...
                        whereConditions.push({
                                nombres: {
                                        contains: normalizedNombres,
                                        mode: 'insensitive',
                                },
                        });

                        //* Búsqueda por palabras individuales...
                        if (nombreWords.length > 1) {
                                const wordConditions = nombreWords.map(
                                        (word) => ({
                                                nombres: {
                                                        contains: word,
                                                        mode: 'insensitive',
                                                },
                                        }),
                                );

                                whereConditions.push({
                                        AND: wordConditions, //> Todas las palabras deben estar presentes...
                                });
                        }
                }

                //* Si se proporcionan apellidos, buscar en el campo apellidos...
                if (apellidos && apellidos.trim()) {
                        const normalizedApellidos =
                                this.normalizeText(apellidos);
                        const apellidoWords = this.splitIntoWords(apellidos);

                        //* Búsqueda exacta normalizada...
                        whereConditions.push({
                                apellidos: {
                                        contains: normalizedApellidos,
                                        mode: 'insensitive',
                                },
                        });

                        //* Búsqueda por palabras individuales...
                        if (apellidoWords.length > 1) {
                                const wordConditions = apellidoWords.map(
                                        (word) => ({
                                                apellidos: {
                                                        contains: word,
                                                        mode: 'insensitive',
                                                },
                                        }),
                                );

                                whereConditions.push({
                                        AND: wordConditions, //> Todas las palabras deben estar presentes...
                                });
                        }
                }

                //* Si no se proporciona ningún parámetro, retornar array vacío...
                if (whereConditions.length === 0) {
                        return [];
                }

                //* Se realiza la consulta con las condiciones construidas...
                const employees = await this.prisma.employee.findMany({
                        where: {
                                OR: whereConditions, //> Usar OR para buscar en cualquiera de los campos...
                        },
                        orderBy: {
                                names: 'asc',
                                lastNames: 'asc',
                        },
                });

                return employees.map((emp) => this.toDomain(emp));
        }

        async updateByID(
                id: number,
                employee: Partial<Employee>,
        ): Promise<Employee> {
                //* Crear un objeto con solo los campos definidos...
                const updateData: any = {};

                //* Mapear solo los campos que están presentes...
                Object.entries(employee).forEach(([key, value]) => {
                        if (value !== undefined) {
                                updateData[key] = value;
                        }
                });

                //* Realizar la actualización...
                const updated = await this.prisma.employee.update({
                        where: { id },
                        data: updateData,
                });

                return this.toDomain(updated);
        }

        async updateByDNI(
                dni: string,
                employee: Partial<Employee>,
        ): Promise<Employee> {
                //* Crear un objeto con solo los campos definidos...
                const updateData: any = {};

                //* Mapear solo los campos que están presentes...
                Object.entries(employee).forEach(([key, value]) => {
                        if (value !== undefined) {
                                updateData[key] = value;
                        }
                });

                //* Realizar la actualización...
                const updated = await this.prisma.employee.update({
                        where: { dni },
                        data: updateData,
                });

                return this.toDomain(updated);
        }

        async delete(id: number): Promise<void> {
                await this.prisma.employee.delete({ where: { id } });
        }

        async existsWithDNI(dni: string): Promise<boolean> {
                const count = await this.prisma.employee.count({
                        where: { dni },
                });
                return count > 0;
        }

        /**
         * Realiza una búsqueda paginada de empleados por nombre o apellido.
         *
         * @param {string} names - Nombres a buscar (puede ser parcial).
         * @param {string} lastNames - Apellidos a buscar (puede ser parcial).
         * @param {number} page - Número de página para la paginación.
         * @param {number} limit - Cantidad de resultados por página.
         * @returns {Promise<{ employees: Employee[]; total: number }>} Empleados encontrados y el total.
         */
        async findByNombreOApellidoWithPagination(
                names: string,
                lastNames: string,
                page: number = 1,
                limit: number = 10,
        ): Promise<{ employees: Employee[]; total: number }> {
                //* Calcular el offset para la paginación...
                const offset = (page - 1) * limit;

                //* Construir las condiciones de búsqueda...
                const whereConditions: any = [];

                if (names && lastNames.trim()) {
                        const normalizedNombres = this.normalizeText(names);
                        const nombreWords = this.splitIntoWords(lastNames);

                        whereConditions.push({
                                nombres: {
                                        contains: normalizedNombres,
                                        mode: 'insensitive',
                                },
                        });

                        if (nombreWords.length > 1) {
                                const wordConditions = nombreWords.map(
                                        (word) => ({
                                                nombres: {
                                                        contains: word,
                                                        mode: 'insensitive',
                                                },
                                        }),
                                );

                                whereConditions.push({
                                        AND: wordConditions,
                                });
                        }
                }

                if (names && lastNames.trim()) {
                        const normalizedApellidos = this.normalizeText(names);
                        const apellidoWords = this.splitIntoWords(lastNames);

                        whereConditions.push({
                                apellidos: {
                                        contains: normalizedApellidos,
                                        mode: 'insensitive',
                                },
                        });

                        if (apellidoWords.length > 1) {
                                const wordConditions = apellidoWords.map(
                                        (word) => ({
                                                apellidos: {
                                                        contains: word,
                                                        mode: 'insensitive',
                                                },
                                        }),
                                );

                                whereConditions.push({
                                        AND: wordConditions,
                                });
                        }
                }

                const whereClause =
                        whereConditions.length > 0
                                ? { OR: whereConditions }
                                : {};

                //* Realizar consulta con paginación...
                const [employees, total] = await Promise.all([
                        this.prisma.employee.findMany({
                                where: whereClause,
                                orderBy: {
                                        names: 'asc',
                                        lastNames: 'asc',
                                },
                                skip: offset,
                                take: limit,
                        }),
                        this.prisma.employee.count({
                                where: whereClause,
                        }),
                ]);

                return {
                        employees: employees.map((emp) => this.toDomain(emp)),
                        total,
                };
        }
}
