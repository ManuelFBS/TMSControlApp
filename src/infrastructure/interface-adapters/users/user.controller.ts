import {
        Controller,
        Get,
        Post,
        Body,
        Param,
        Put,
        Delete,
        ParseIntPipe,
        UseGuards,
} from '@nestjs/common';
import { UserService } from '../../../application/use-cases/users/user.service';
import {
        CreateUserDTO,
        UpdateUserDTO,
        UserResponseDTO,
        UserPublicResponseDTO,
} from '../../../application/dto/users/create-user.dto';
// import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Permissions } from '../../../core/permissions/permissions.decorator';
// import { PermissionsGuard } from '../../../../auth/guards/permissions.guard';
import { plainToInstance } from 'class-transformer';

@Controller('api/users')
export class UserController {
        constructor(private readonly userService: UserService) {}

        @Post('user/new')
        // @UseGuards(JWTAuthGuard, PermissionsGuard)
        // @Permissions('user:create')
        async create(
                @Body() createUserDTO: CreateUserDTO,
        ): Promise<UserResponseDTO> {
                const user = await this.userService.createUser(createUserDTO);

                return plainToInstance(UserResponseDTO, user);
        }

        @Get()
        // @UseGuards(JWTAuthGuard, PermissionsGuard)
        // @Permissions('user:read')
        async findAll(): Promise<UserPublicResponseDTO[]> {
                const users = await this.userService.findAllUsers();

                //* Se ordena por 'username' en forma ascendente...
                users.sort((a, b) => a.username.localeCompare(b.username));

                //* Se mapea y (opcionalmente) se transforma a instancia de DTO...
                return users.map((user) =>
                        plainToInstance(UserPublicResponseDTO, {
                                dni: user.dni,
                                username: user.username,
                                role: user.role,
                        }),
                );
        }

        @Get('user_byid/:id')
        // @UseGuards(JWTAuthGuard, PermissionsGuard)
        // @Permissions('user:read')
        async findOne(
                @Param('id', ParseIntPipe) id: number,
        ): Promise<UserResponseDTO> {
                const user = await this.userService.findUserByID(id);

                return plainToInstance(UserResponseDTO, user);
        }

        @Get('user_bydni/:dni')
        // @UseGuards(JWTAuthGuard, PermissionsGuard)
        // @Permissions('user:read')
        async findByDni(@Param('dni') dni: string): Promise<UserResponseDTO> {
                const user = await this.userService.findUserByDNI(dni);

                return plainToInstance(UserResponseDTO, user);
        }

        @Put('user_update/:id')
        // @UseGuards(JWTAuthGuard, PermissionsGuard)
        // @Permissions('user:update')
        async update(
                @Param('id', ParseIntPipe) id: number,
                @Body() updateUserDto: UpdateUserDTO,
        ): Promise<UserResponseDTO> {
                const user = await this.userService.updateUser(
                        id,
                        updateUserDto,
                );

                return plainToInstance(UserResponseDTO, user);
        }

        @Delete('user_del/:id')
        // @UseGuards(JWTAuthGuard, PermissionsGuard)
        // @Permissions('user:update')
        async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
                await this.userService.deleteUser(id);
        }
}
