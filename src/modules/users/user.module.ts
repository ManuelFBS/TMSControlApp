import { Module } from '@nestjs/common';
import { UserService } from '../../application/use-cases/users/user.service';
import { UserController } from '../../infrastructure/interface-adapters/users/user.controller';
import { PrismaService } from '../../infrastructure/database/prisma/prisma.service';
import { PrismaUserRepository } from '../../infrastructure/repositories/users/prisma-user.repository';
import { EmployeeModule } from '../employees/employee.module';

@Module({
        imports: [EmployeeModule],
        controllers: [UserController],
        providers: [
                UserService,
                PrismaService,
                {
                        provide: 'UserRepository',
                        useClass: PrismaUserRepository,
                },
        ],
        exports: [UserService],
})
export class UserModule {}
