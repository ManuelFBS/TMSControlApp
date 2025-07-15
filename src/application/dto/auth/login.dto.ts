import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDTO {
        @ApiProperty({ example: 'admin', description: 'Nombre de usuario' })
        @IsString()
        @IsNotEmpty()
        username: string;

        @ApiProperty({ example: 'P@ssw0rd', description: 'Contraseña' })
        @IsString()
        @IsNotEmpty()
        @MinLength(7)
        password: string;
}
