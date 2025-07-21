import {
        IsNotEmpty,
        IsString,
        MinLength,
        MaxLength,
        Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDriverDTO {
        @ApiProperty({
                example: ['12345678', 'AB123456', 'ABC123', '123abC45F'],
                description: 'El DNI del empleado (único)',
                minLength: 6,
        })
        @IsString()
        @IsNotEmpty()
        @MinLength(6)
        @MaxLength(20)
        @Matches(/^[A-Za-z0-9]+$/, {
                message: 'El DNI solo debe contener letras y/o números (sin espacios ni caracteres especiales)',
        })
        dni: string;

        @ApiProperty({
                example: ['100200300400'],
                description: 'La licencia del conductor (único)',
                minLength: 6,
        })
        @IsString()
        @IsNotEmpty()
        @MinLength(6)
        @MaxLength(20)
        @Matches(/^[0-9]+$/, {
                message: 'La licencia de conducir solo debe contener números (sin espacios ni caracteres especiales).',
        })
        driverLicense: string;

        @ApiProperty({
                example: ['ABC123', '123567', 'ABCFGH'],
                description: 'ID de la Empresa.',
                minLength: 5,
                maxLength: 30,
        })
        @IsString()
        @IsNotEmpty()
        @MinLength(6)
        @MaxLength(30)
        @Matches(/^[A-Za-z0-9]+$/, {
                message: 'El ID Compañía solo debe contener letras y/o números (sin espacios ni caracteres especiales)',
        })
        idCompany: string;
}

export class DriverResponseDTO {
        @ApiProperty()
        id: number;

        @ApiProperty()
        dni: string;

        @ApiProperty()
        driverLicense: string;

        @ApiProperty()
        idCompany: string;
}
