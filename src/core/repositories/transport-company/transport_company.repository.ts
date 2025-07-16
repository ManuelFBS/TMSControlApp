import { TransportCompany } from '../../entities/transport-company/transport_company.entity';

export abstract class TransportCompanyRepository {
        abstract create(company: TransportCompany): Promise<TransportCompany>;
        abstract findAll(): Promise<TransportCompany>;
        abstract findByID(id: number): Promise<TransportCompany | null>;
        abstract findByIDCompany(
                idCompany: string,
        ): Promise<TransportCompany | null>;
        abstract update(
                id: number,
                company: Partial<TransportCompany>,
        ): Promise<TransportCompany>;
        abstract delete(id: number): Promise<void>;
}
