import {
        IsNotEmpty,
        IsOptional,
        IsString,
        MinLength,
        MaxLength,
        Matches,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateEmployeeDTO {
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
                example: ['Juan', 'Juan José'],
                description: 'Nombre(s) del empleado',
                minLength: 3,
                maxLength: 100,
        })
        @IsString()
        @IsNotEmpty()
        @MinLength(3)
        @MaxLength(100)
        names: string;

        @ApiProperty({
                example: ['Pérez', 'Pérez Rodríguez'],
                description: 'Apellido(s) del empleado',
                minLength: 3,
                maxLength: 100,
        })
        @IsString()
        @IsNotEmpty()
        @MinLength(3)
        @MaxLength(100)
        lastNames: string;

        @ApiProperty({
                example: '+5491145678901',
                description: 'Teléfono del empleado',
                minLength: 8,
                maxLength: 30,
        })
        @IsString()
        @IsNotEmpty()
        @MinLength(8)
        @MaxLength(25)
        phone: string;

        @ApiProperty({
                example: 'Calle Alguna #123, Ciudad, Provincia, País',
                minLength: 8,
                maxLength: 30,
                description: 'Dirección de habitación del empleado',
        })
        @IsString()
        @IsNotEmpty()
        @MinLength(5)
        @MaxLength(240)
        address: string;
}

export class UpdateEmployeeDTO extends PartialType(CreateEmployeeDTO) {
        @ApiProperty({ required: false })
        @IsOptional()
        names?: string;

        @ApiProperty({ required: false })
        @IsOptional()
        lastNames?: string;

        @ApiProperty({ required: false })
        @IsOptional()
        phone?: string;

        @ApiProperty({ required: false })
        @IsOptional()
        address?: string;
}

export class EmployeeResponseDTO {
        @ApiProperty()
        id: number;

        @ApiProperty()
        dni: string;

        @ApiProperty()
        names: string;

        @ApiProperty()
        lastNames: string;

        @ApiProperty()
        phone: string;

        @ApiProperty()
        address: string;

        @ApiProperty()
        createdAt: Date;

        @ApiProperty()
        updatedAt: Date;
}

export class EmployeePublicResponseDTO {
        @ApiProperty()
        dni: string;

        @ApiProperty()
        names: string;

        @ApiProperty()
        lastNames: string;

        @ApiProperty()
        phone: string;
}
