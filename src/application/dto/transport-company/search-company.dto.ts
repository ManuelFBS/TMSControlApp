import { IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { TransportCompany } from '../../../core/entities/transport-company/transport_company.entity';

export class SearchCompanyDTO {
        @IsOptional()
        @IsString()
        companyName?: string;
}
