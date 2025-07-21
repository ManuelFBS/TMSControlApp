/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { TransportCompany } from '../../../core/entities/transport-company/transport_company.entity';
import { TransportCompanyRepository } from '../../../core/repositories/transport-company/transport_company.repository';

@Injectable()
export class PrismaTransportCompanyRepositorty
        implements TransportCompanyRepository
{
        constructor(private prisma: PrismaService) {}

        private toDomain(prismaCompany: any): TransportCompany {
                return new TransportCompany(
                        prismaCompany.id,
                        prismaCompany.idCompany,
                        prismaCompany.companyName,
                        prismaCompany.contactName,
                        prismaCompany.contactPhone,
                );
        }

        async create(
                transportCompany: TransportCompany,
        ): Promise<TransportCompany> {
                const created = await this.prisma.transportCompany.create({
                        data: {
                                idCompany: transportCompany.idCompany,
                                companyName: transportCompany.companyName,
                                contactName: transportCompany.contactName,
                                contactPhone: transportCompany.contactPhone,
                        },
                });

                return this.toDomain(created);
        }

        async findAll(): Promise<TransportCompany[]> {
                const companies = await this.prisma.transportCompany.findMany();

                return companies.map((company) => this.toDomain(company));
        }

        async findByID(id: number): Promise<TransportCompany | null> {
                const company = await this.prisma.transportCompany.findUnique({
                        where: { id },
                });
                return company ? this.toDomain(company) : null;
        }

        async findByIDCompany(
                idCompany: string,
        ): Promise<TransportCompany | null> {
                const company = await this.prisma.transportCompany.findUnique({
                        where: { idCompany },
                });
                return company ? this.toDomain(company) : null;
        }

        async findByCompanyName(
                companyName: string,
        ): Promise<TransportCompany | null> {
                const company =
                        await this.prisma.transportCompany.findFirstOrThrow({
                                where: { companyName },
                        });

                return company ? this.toDomain(company) : null;
        }

        async update(
                id: number,
                company: Partial<TransportCompany>,
        ): Promise<TransportCompany> {
                const updated = await this.prisma.transportCompany.update({
                        where: { id },
                        data: {
                                companyName: company.companyName,
                                contactName: company.companyName,
                                contactPhone: company.contactPhone,
                        },
                });
                return this.toDomain(updated);
        }

        async delete(id: number): Promise<void> {
                await this.prisma.transportCompany.delete({ where: { id } });
        }
}
