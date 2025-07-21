/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { Driver } from '../../../core/entities/drivers/driver.entity';
import { DriverRepository } from '../../../core/repositories/drivers/driver.repository';

@Injectable()
export class PrismaDriverRepository implements DriverRepository {
        constructor(private prisma: PrismaService) {}

        private toDomain(prismaDriver: any): Driver {
                return new Driver(
                        prismaDriver.id,
                        prismaDriver.dni,
                        prismaDriver.driverLicense,
                        prismaDriver.idCompany,
                );
        }

        async create(driver: Driver): Promise<Driver> {
                const created = await this.prisma.driver.create({
                        data: {
                                dni: driver.dni,
                                driverLicense: driver.driverLicense,
                                idCompany: driver.idCompany,
                        },
                });

                return this.toDomain(created);
        }

        async findAll(): Promise<Driver[]> {
                const drivers = await this.prisma.driver.findMany();

                return drivers.map((driver) => this.toDomain(driver));
        }

        async findByID(id: number): Promise<Driver | null> {
                const driver = await this.prisma.driver.findUnique({
                        where: { id },
                });

                return driver ? this.toDomain(driver) : null;
        }

        async findByDNI(dni: string): Promise<Driver | null> {
                const driver = await this.prisma.driver.findUnique({
                        where: { dni },
                });

                return driver ? this.toDomain(driver) : null;
        }

        async delete(id: number): Promise<void> {
                await this.prisma.driver.delete({ where: { id } });
        }
}
