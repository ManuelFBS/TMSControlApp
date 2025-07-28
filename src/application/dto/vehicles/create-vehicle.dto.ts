/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
        IsNotEmpty,
        IsOptional,
        IsString,
        MinLength,
        MaxLength,
        Matches,
        Validate,
        ValidatorConstraint,
        ValidatorConstraintInterface,
        ValidationArguments,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { TypeOfVehicle } from '../../../core/entities/vehicles/vehicle.entity';

//* Validador personalizado para verificar que el "TypeOfVehicle" es válido...
@ValidatorConstraint({ name: 'isValidTypeOfVehicle', async: false })
export class IsValidTypeOfVehicleConstrain
        implements ValidatorConstraintInterface
{
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        validate(type: any, args: ValidationArguments) {
                return Object.values(TypeOfVehicle).includes(type);
        }

        defaultMessage(args: ValidationArguments) {
                return `El tipo de vehículo debe ser uno de: ${Object.values(TypeOfVehicle).join(', ')}`;
        }
}

export class CreateVehicleDTO {
        @ApiProperty({
                example: ['T0001', 'R12345', 'S12345'],
                description: 'Placa del vehículo (único)',
                minLength: 5,
        })
        @IsString()
        @IsNotEmpty()
        @MinLength(5)
        @MaxLength(10)
        @Matches(/^[A-Za-z0-9]+$/, {
                message: 'La placa solo debe contener letras y/o números (sin espacios ni caracteres especiales)',
        })
        carLicensePlate: string;

        @ApiProperty({
                enum: TypeOfVehicle,
                example: TypeOfVehicle.TRACTOCAMION,
                description: 'Tipo de vehículo.',
        })
        @IsNotEmpty()
        @Validate(IsValidTypeOfVehicleConstrain)
        typeOfVehicle: TypeOfVehicle;

        @ApiProperty({
                example: ['Scannia', 'Iveco', 'Kenworth', 'Peterbilt', 'Man'],
                description: 'Marca del vehículo',
                minLength: 3,
        })
        @IsNotEmpty()
        @MinLength(3)
        @MaxLength(30)
        brandOfVehicle: string;

        @ApiProperty({
                example: ['xxx123', 'yyy123', 'zzz001'],
                description:
                        'ID de la compañía de transporte. xxx representa prefijo de la empresa.',
                minLength: 3,
        })
        @IsString()
        @IsNotEmpty()
        @MinLength(3)
        @MaxLength(30)
        @Matches(/^[A-Za-z]{3}[A-Za-z0-9]*$/, {
                message: 'Los primeros 3 caracteres deben ser letras (A-Z), seguidos de letras o números',
        })
        idCompany: string;

        @ApiProperty({
                example: ['12345678', 'AB123456', 'ABC123', '123abC45F'],
                description: 'El DNI del conductor (único)',
                minLength: 6,
        })
        @IsString()
        @IsNotEmpty()
        @MinLength(6)
        @MaxLength(20)
        @Matches(/^[A-Za-z0-9]+$/, {
                message: 'El DNI solo debe contener letras y/o números (sin espacios ni caracteres especiales)',
        })
        dniDriver: string;

        @ApiProperty({
                type: Date,
                example: '2023-01-01T00:00:00.000Z',
                description: 'Fecha de creación',
        })
        createdAt: Date;

        @ApiProperty({
                type: Date,
                example: '2023-01-02T00:00:00.000Z',
                description: 'Fecha de última actualización',
        })
        updatedAt: Date;
}

export class UpdateVehicleDTO extends PartialType(CreateVehicleDTO) {
        @ApiProperty({
                required: false,
                enum: TypeOfVehicle,
                example: TypeOfVehicle.TRACTOCAMION,
        })
        @IsOptional()
        @Validate(IsValidTypeOfVehicleConstrain)
        typeOfVehicle?: TypeOfVehicle;

        @ApiProperty({
                example: ['Scannia', 'Iveco', 'Kenworth', 'Peterbilt', 'Man'],
                description: 'Marca del vehículo',
                minLength: 3,
        })
        @IsOptional()
        @MinLength(3)
        @MaxLength(30)
        brandOfVehicle: string;

        @ApiProperty({
                example: ['xxx123', 'yyy123', 'zzz001'],
                description:
                        'ID de la compañía de transporte. xxx representa prefijo de la empresa.',
                minLength: 3,
        })
        @IsString()
        @IsOptional()
        @MinLength(3)
        @MaxLength(30)
        @Matches(/^[A-Za-z]{3}[A-Za-z0-9]*$/, {
                message: 'Los primeros 3 caracteres deben ser letras (A-Z), seguidos de letras o números',
        })
        idCompany: string;

        @ApiProperty({
                example: ['12345678', 'AB123456', 'ABC123', '123abC45F'],
                description: 'El DNI del conductor (único)',
                minLength: 6,
        })
        @IsString()
        @IsOptional()
        @MinLength(6)
        @MaxLength(20)
        @Matches(/^[A-Za-z0-9]+$/, {
                message: 'El DNI solo debe contener letras y/o números (sin espacios ni caracteres especiales)',
        })
        dniDriver: string;
}

export class VehicleResponseDTO {
        @ApiProperty()
        id: number;

        @ApiProperty()
        carLicensePlate: string;

        @ApiProperty({
                enum: TypeOfVehicle,
                example: TypeOfVehicle.TRACTOCAMION,
        })
        typeOfVehicle: string;

        @ApiProperty()
        brandOfVehicle: string;

        @ApiProperty()
        idCompany: string;

        @ApiProperty()
        dniDriver: string;
}
