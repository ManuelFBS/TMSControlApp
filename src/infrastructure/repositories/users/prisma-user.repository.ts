import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { User, UserRole } from '../../../core/entities/users/user.entity';
import { UserRepository } from '../../../core/repositories/users/user.repository';
import { UserRole as PrismaUserRole } from '../../../../generated/prisma';

@Injectable()
export class PrismaUserRepository implements UserRepository {
        constructor(private prisma: PrismaService) {}

        private toDomain(prismaUser: any): User {
                return new User(
                        prismaUser.id,
                        prismaUser.dni,
                        prismaUser.username,
                        prismaUser.password,
                        prismaUser.role as UserRole,
                        prismaUser.createdAt,
                        prismaUser.updatedAt,
                );
        }

        private mapToPrismaRole(role: UserRole): PrismaUserRole {
                switch (role) {
                        case UserRole.ADMIN:
                                return PrismaUserRole.Administrador;
                        case UserRole.CLIENT:
                                return PrismaUserRole.Cliente;
                        case UserRole.DRIVER:
                                return PrismaUserRole.Conductor;
                        case UserRole.COMPANY:
                                return PrismaUserRole.Empresa;
                        default:
                                throw new Error('Rol no válido');
                }
        }

        async create(user: User): Promise<User> {
                if (user.role === undefined) {
                        throw new ConflictException(
                                'El rol del usuario NO puede ser null',
                        );
                }

                const created = await this.prisma.user.create({
                        data: {
                                dni: user.dni,
                                username: user.username,
                                password: user.password,
                                role: this.mapToPrismaRole(user.role),
                        },
                });

                return this.toDomain(created);
        }

        async findAll(): Promise<User[]> {
                const users = await this.prisma.user.findMany();
                return users.map((user) => this.toDomain(user));
        }

        async findByID(id: number): Promise<User | null> {
                const user = await this.prisma.user.findUnique({
                        where: { id },
                });
                return user ? this.toDomain(user) : null;
        }

        async findByDNI(dni: string): Promise<User | null> {
                const user = await this.prisma.user.findUnique({
                        where: { dni },
                });
                return user ? this.toDomain(user) : null;
        }

        async findByUsername(username: string): Promise<User | null> {
                const user = await this.prisma.user.findUnique({
                        where: { username },
                });
                return user ? this.toDomain(user) : null;
        }

        async update(id: number, user: Partial<User>): Promise<User> {
                const data: any = {};

                if (user.username !== undefined) data.username = user.username;
                if (user.password !== undefined) data.password = user.password;
                if (user.role !== undefined)
                        data.role = this.mapToPrismaRole(user.role);

                const updated = await this.prisma.user.update({
                        where: { id },
                        data,
                });

                return this.toDomain(data);
        }

        async delete(id: number): Promise<void> {
                await this.prisma.user.delete({ where: { id } });
        }
}
