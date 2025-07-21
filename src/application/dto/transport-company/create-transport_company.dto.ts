import {
        IsNotEmpty,
        IsOptional,
        IsString,
        MinLength,
        MaxLength,
        Matches,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateTransportCompanyDTO {
        @ApiProperty({
                example: ['ABC123', '123567', 'ABCFGH'],
                description: 'El ID de Empresa es único',
                minLength: 5,
                maxLength: 30,
        })
        @IsString()
        @IsNotEmpty()
        @MinLength(6)
        @MaxLength(30)
        @Matches(/^[A-Za-z0-9]+$/, {
                message: 'El DNI solo debe contener letras y/o números (sin espacios ni caracteres especiales)',
        })
        idCompany: string;

        @ApiProperty({
                example: ['Empresas X', 'Transportes 2030'],
                description: 'Nombre de la Compañía de Transporte',
                minLength: 3,
                maxLength: 100,
        })
        @IsString()
        @IsNotEmpty()
        @MinLength(3)
        @MaxLength(100)
        companyName: string;

        @ApiProperty({
                example: ['Juan Rodríguez'],
                description: 'Nombre del contacto con la Empresa',
                minLength: 3,
                maxLength: 100,
        })
        @IsString()
        @IsNotEmpty()
        @MinLength(3)
        @MaxLength(100)
        contactName: string;

        @ApiProperty({
                example: '+5491145678901',
                description: 'Teléfono del contacto',
                minLength: 8,
                maxLength: 30,
        })
        @IsString()
        @IsNotEmpty()
        @MinLength(8)
        @MaxLength(25)
        contactPhone: string;
}

export class UpdateTransportCompanyDTO extends PartialType(
        CreateTransportCompanyDTO,
) {
        @ApiProperty({ required: false })
        @IsOptional()
        companyName?: string;

        @ApiProperty({ required: false })
        @IsOptional()
        contactName?: string;

        @ApiProperty({ required: false })
        @IsOptional()
        contactPhone?: string;
}

export class TransportCompanyResponseDTO {
        @ApiProperty()
        idCompany: string;

        @ApiProperty()
        companyName: string;

        @ApiProperty()
        contactName: string;

        @ApiProperty()
        contactPhone: string;
}
