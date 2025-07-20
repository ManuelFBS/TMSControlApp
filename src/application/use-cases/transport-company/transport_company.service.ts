import {
        Injectable,
        Inject,
        BadRequestException,
        ConflictException,
        InternalServerErrorException,
        NotFoundException,
} from '@nestjs/common';
import { TransportCompany } from '../../../core/entities/transport-company/transport_company.entity';
import { TransportCompanyRepository } from '../../../core/repositories/transport-company/transport_company.repository';
import {
        CreateTransportCompanyDTO,
        UpdateTransportCompanyDTO,
} from 'src/application/dto/transport-company/create-transport_company.dto';

@Injectable()
export class TransportCompanyService {
        constructor(
                @Inject('TransportCompanyRepository')
                private readonly transportCompanyRepository: TransportCompanyRepository,
        ) {}

        async createConpany(
                createTransportCompanyDTO: CreateTransportCompanyDTO,
        ): Promise<TransportCompany> {
                const existsIdCompany =
                        await this.transportCompanyRepository.findByIDCompany(
                                createTransportCompanyDTO.idCompany,
                        );
                if (existsIdCompany) {
                        throw new ConflictException(
                                `Ya existe una Empresa Transportista con la ID de empresa ${existsIdCompany.idCompany}`,
                        );
                }

                const existsCompanyName =
                        await this.transportCompanyRepository.findByCompanyName(
                                createTransportCompanyDTO.companyName,
                        );
                if (existsCompanyName) {
                        throw new ConflictException(
                                `Ya existe una Empresa Transportista con el nombre ${existsCompanyName.companyName}`,
                        );
                }

                const company = new TransportCompany(
                        0,
                        createTransportCompanyDTO.idCompany,
                        createTransportCompanyDTO.companyName,
                        createTransportCompanyDTO.contactName,
                        createTransportCompanyDTO.contactPhone,
                );

                const createdCompany =
                        await this.transportCompanyRepository.create(company);

                return createdCompany;
        }

        async findAllCompanies(): Promise<TransportCompany[]> {
                return this.transportCompanyRepository.findAll();
        }

        async findCompanyByID(id: number): Promise<TransportCompany> {
                const company =
                        await this.transportCompanyRepository.findByID(id);
                if (!company) {
                        throw new NotFoundException(
                                `La Compañía con ID ${id} no se encuentra.`,
                        );
                }

                return company;
        }

        async findComapnyByIDComp(
                idCompany: string,
        ): Promise<TransportCompany> {
                const company =
                        await this.transportCompanyRepository.findByIDCompany(
                                idCompany,
                        );
                if (!company) {
                        throw new NotFoundException(
                                `La Compañía con ID de Compañía ${idCompany} no se encuentra.`,
                        );
                }

                return company;
        }

        async findCompanyByName(
                companyName: string,
        ): Promise<TransportCompany> {
                const company =
                        await this.transportCompanyRepository.findByCompanyName(
                                companyName,
                        );
                if (!company) {
                        throw new NotFoundException(
                                `La Compañía con el nombre ${companyName} no se encuentra.`,
                        );
                }

                return company;
        }

        async updateCompany(
                id: number,
                updateTransportCompanyDTO: UpdateTransportCompanyDTO,
        ): Promise<TransportCompany> {
                //* Verificar existencia de la Compañía...
                if (await this.findCompanyByID(id)) {
                        throw new NotFoundException(
                                `La Compañía con la ID ${id} no encontrada.`,
                        );
                }

                const updatedCompany =
                        await this.transportCompanyRepository.update(
                                id,
                                updateTransportCompanyDTO,
                        );

                return updatedCompany;
        }

        async deleteCompany(id: number): Promise<void> {
                //* Verificar existencia de la Compañía...
                if (await this.findCompanyByID(id)) {
                        throw new NotFoundException(
                                `La Compañía con la ID ${id} no encontrada.`,
                        );
                }

                await this.transportCompanyRepository.delete(id);
        }
}
