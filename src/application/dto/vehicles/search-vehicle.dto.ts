import {
        IsOptional,
        IsString,
        Validate,
        ValidationArguments,
        ValidatorConstraint,
        ValidatorConstraintInterface,
} from 'class-validator';
import { TypeOfVehicle } from '../../../core/entities/vehicles/vehicle.entity';

@ValidatorConstraint({ name: 'isValidTypeOfVehicle', async: false })
export class IsValidTypeOfVehicleConstrain
        implements ValidatorConstraintInterface
{
        validate(type: any, args: ValidationArguments) {
                return Object.values(TypeOfVehicle).includes(type);
        }

        defaultMessage(args: ValidationArguments) {
                return `El tipo de vehículo debe ser uno de: ${Object.values(TypeOfVehicle).join(', ')}`;
        }
}

export class SearchVehicleDTO {
        @IsOptional()
        @Validate(IsValidTypeOfVehicleConstrain)
        typeOfVehicle?: TypeOfVehicle;

        @IsOptional()
        @IsString()
        brandOfVehicle?: string;

        @IsOptional()
        @IsString()
        carLicensePlate: string;

        @IsOptional()
        @IsString()
        dniDriver: string;
}
