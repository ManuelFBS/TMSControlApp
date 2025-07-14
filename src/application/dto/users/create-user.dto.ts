import {
        IsString,
        MinLength,
        MaxLength,
        Matches,
        IsOptional,
        IsNotEmpty,
        Validate,
        ValidatorConstraint,
        ValidatorConstraintInterface,
        ValidationArguments,
} from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { UserRole } from '../../../core/entities/users/user.entity';

//* Validador personalizado para verificar que el role es válido...
@ValidatorConstraint({ name: 'isValidRole', async: false })
export class IsValidRoleConstraint implements ValidatorConstraintInterface {
        validate(role: any, args: ValidationArguments) {
                return Object.values(UserRole).includes(role);
        }

        defaultMessage(args: ValidationArguments) {
                return `El Rol debe ser uno de: ${Object.values(UserRole).join(', ')}`;
        }
}

export class CreateUserDTO {
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
                example: 'pedropaz',
                description: 'Nombre de usuario único',
                minLength: 5,
                maxLength: 15,
        })
        @IsString()
        @IsNotEmpty()
        @MinLength(5)
        @MaxLength(15)
        username: string;

        @ApiProperty({
                example: 'P@ssw0rd',
                description: 'Contraseña segura',
                minLength: 7,
                maxLength: 20,
        })
        @IsString()
        @IsNotEmpty()
        @MinLength(7)
        @MaxLength(20)
        @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{7,20}$/, {
                message: 'La contraseña debe contener al menos: 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial',
        })
        password: string;

        @ApiProperty({
                enum: UserRole,
                example: UserRole.EMPLOYEE,
                description: 'Rol del usuario en el sistema',
        })
        @IsNotEmpty()
        @Validate(IsValidRoleConstraint)
        role: UserRole;
}

export class UpdateUserDTO extends PartialType(CreateUserDTO) {
        @ApiProperty({
                required: false,
                example: 'newUsername',
                description: 'Nombre de usuario único',
        })
        @IsOptional()
        @IsString()
        @MinLength(5)
        @MaxLength(12)
        username?: string;

        @ApiProperty({
                required: false,
                example: 'N3wP@ss',
                description: 'Contraseña segura',
        })
        @IsOptional()
        @IsString()
        @MinLength(7)
        @MaxLength(20)
        @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{7,20}$/, {
                message: 'La contraseña debe contener al menos: 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial',
        })
        password?: string;

        @ApiProperty({
                required: false,
                enum: UserRole,
                example: UserRole.ADMIN,
        })
        @IsOptional()
        @Validate(IsValidRoleConstraint)
        role?: UserRole;
}

export class UserResponseDTO {
        @ApiProperty({ example: 1, description: 'ID único del usuario' })
        id: number;

        @ApiProperty({ example: '12345678', description: 'DNI del usuario' })
        dni: string;

        @ApiProperty({ example: 'johndoe', description: 'Nombre de usuario' })
        username: string;

        @ApiProperty({ enum: UserRole, example: UserRole.EMPLOYEE })
        role: UserRole;

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

export class UserPublicResponseDTO {
        @ApiProperty({ example: '12345678', description: 'DNI del usuario' })
        dni: string;

        @ApiProperty({ example: 'johndoe', description: 'Nombre de usuario' })
        username: string;

        @ApiProperty({ enum: UserRole, example: UserRole.EMPLOYEE })
        role: UserRole;
}
