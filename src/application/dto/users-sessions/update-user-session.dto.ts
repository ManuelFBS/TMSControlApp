import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class UpdateUserSessionDTO {
        @IsString()
        @IsNotEmpty()
        dni: string;

        @IsDateString()
        @IsNotEmpty()
        finalDate: string;

        @IsString()
        @IsNotEmpty()
        finalHour: string;
}
