import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class CreateUserSessionDTO {
        @IsString()
        @IsNotEmpty()
        dni: string;

        @IsString()
        @IsNotEmpty()
        username: string;

        @IsString()
        @IsNotEmpty()
        role: string;

        @IsDateString()
        @IsNotEmpty()
        initDate: string;

        @IsString()
        @IsNotEmpty()
        initHour: string;
}
