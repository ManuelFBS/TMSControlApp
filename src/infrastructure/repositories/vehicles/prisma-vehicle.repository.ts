/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import {
        TypeOfVehicle,
        Vehicle,
} from '../../../core/entities/vehicles/vehicle.entity';
import { VehicleRepository } from '../../../core/repositories/vehicles/vehicle.repository';

@Injectable()
export class PrismaVehicleRepository implements VehicleRepository {
        constructor(private prisma: PrismaService) {}

        private toDomain(prismaVehicle: any): Vehicle {
                return new Vehicle(
                        prismaVehicle.id,
                        prismaVehicle.carLicensePlate,
                        prismaVehicle.typeOfVehicle,
                        prismaVehicle.brandOfVehicle,
                        prismaVehicle.idCompany,
                        prismaVehicle.dniDriver,
                        prismaVehicle.createdAt,
                        prismaVehicle.updatedAt,
                );
        }

        async create(vehicle: Vehicle): Promise<Vehicle> {
                const created = await this.prisma.vehicle.create({
                        data: {
                                carLicensePlate: vehicle.carLicensePlate,
                                typeOfVehicle: vehicle.typeOfVehicle,
                                brandOfVehicle: vehicle.brandOfVehicle,
                                idCompany: vehicle.idCompany,
                                dniDriver: vehicle.dniDriver,
                        },
                });

                return this.toDomain(created);
        }

        async findAll(): Promise<Vehicle[]> {
                const vehicles = await this.prisma.vehicle.findMany();

                return vehicles.map((vehicle) => this.toDomain(vehicle));
        }

        async findByType(typeOfVehicle: TypeOfVehicle): Promise<Vehicle[]> {
                const vehicles = await this.prisma.vehicle.findMany({
                        where: { typeOfVehicle },
                });

                return vehicles.map((vehicle) => this.toDomain(vehicle));
        }

        async findByBrand(brandOfVehicle: string): Promise<Vehicle[]> {
                const brands = await this.prisma.vehicle.findMany({
                        where: { brandOfVehicle },
                });

                return brands.map((brand) => this.toDomain(brand));
        }

        async findByID(id: number): Promise<Vehicle | null> {
                const vehicle = await this.prisma.vehicle.findUnique({
                        where: { id },
                });

                return vehicle ? this.toDomain(vehicle) : null;
        }

        async findByPlate(carLicensePlate: string): Promise<Vehicle | null> {
                const vehicle = await this.prisma.vehicle.findUnique({
                        where: { carLicensePlate },
                });

                return vehicle ? this.toDomain(vehicle) : null;
        }

        async FindByAssignment(dniDriver: string): Promise<Vehicle | null> {
                const vehicle = await this.prisma.vehicle.findUnique({
                        where: { dniDriver },
                });

                return vehicle ? this.toDomain(vehicle) : null;
        }

        async updateByID(
                id: number,
                vehicle: Partial<Vehicle>,
        ): Promise<Vehicle> {
                //* Crear un objeto con solo los campos definidos...
                const updateData: any = {};

                //* Mapear solo los campos que están presentes...
                Object.entries(vehicle).forEach(([key, value]) => {
                        if (value !== undefined) {
                                updateData[key] = value;
                        }
                });

                //* Realizar la actualización...
                const updated = await this.prisma.vehicle.update({
                        where: { id },
                        data: updateData,
                });

                return this.toDomain(updated);
        }

        async updateByPlate(
                carLicensePlate: string,
                vehicle: Partial<Vehicle>,
        ): Promise<Vehicle> {
                //* Crear un objeto con solo los campos definidos...
                const updateData: any = {};

                //* Mapear solo los campos que están presentes...
                Object.entries(vehicle).forEach(([key, value]) => {
                        if (value !== undefined) {
                                updateData[key] = value;
                        }
                });

                //* Realizar la actualización...
                const updated = await this.prisma.vehicle.update({
                        where: { carLicensePlate },
                        data: updateData,
                });

                return this.toDomain(updated);
        }

        async deleteByID(id: number): Promise<void> {
                await this.prisma.vehicle.delete({ where: { id } });
        }

        async deleteByPlate(carLicensePlate: string): Promise<void> {
                await this.prisma.vehicle.delete({
                        where: { carLicensePlate },
                });
        }
}
