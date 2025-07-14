import { Employee } from '../../entities/employees/employee.entity';

//~ Repositorio abstracto para la entidad Employee...

//* Define el contrato que debe implementar cualquier repositorio concreto...
// * (ej: Prisma, TypeORM, etc.) independiente de la tecnología de persistencia...
export abstract class EmployeeRepository {
        abstract create(employee: Employee): Promise<Employee>;
        abstract findAll(): Promise<Employee[]>;
        abstract findByID(id: number): Promise<Employee | null>;
        abstract findByDNI(dni: string): Promise<Employee | null>;
        abstract findByNameOrLastname(
                names: string,
                lastNames: string,
        ): Promise<Employee[]>;
        abstract updateByID(
                id: number,
                employee: Partial<Employee>,
        ): Promise<Employee>;
        abstract updateByDNI(
                dni: string,
                employee: Partial<Employee>,
        ): Promise<Employee>;
        abstract delete(id: number): Promise<void>;
        abstract existsWithDNI(dni: string): Promise<boolean>;
        abstract findByNamesOrLastnamesWithPagination(
                names: string,
                lastNames: string,
                page: number,
                limit: number,
        ): Promise<{ employees: Employee[]; total: number }>;
}
