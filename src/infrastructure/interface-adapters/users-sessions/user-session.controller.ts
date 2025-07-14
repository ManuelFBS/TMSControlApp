import {
        Controller,
        Post,
        Get,
        Body,
        Param,
        UseGuards,
        HttpStatus,
        HttpCode,
} from '@nestjs/common';
import { UserSessionService } from '../../../application/use-cases/users-sessions/user-session.service';
import { CreateUserSessionDTO } from '../../../application/dto/users-sessions/create-user-session.dto';
import { UpdateUserSessionDTO } from '../../../application/dto/users-sessions/update-user-session.dto';
import { JWTAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../../auth/guards/permissions.guard';
import { Permissions } from '../../../core/permissions/permissions.decorator';

@Controller('user-sessions')
@UseGuards(JWTAuthGuard, PermissionsGuard)
export class UserSessionController {
        constructor(private readonly userSessionService: UserSessionService) {}

        /**
         * Se crea una nueva sesión (llamada automáticamente durante el login)...
         * @param createUserSessionDto - Creación de datos de sesión...
         * @returns Promise<UserSession> - La sesión creada...
         */
        @Post('/new-session')
        @HttpCode(HttpStatus.CREATED)
        async createSession(
                @Body() createUserSessionDTO: CreateUserSessionDTO,
        ) {
                return await this.userSessionService.createSession(
                        createUserSessionDTO,
                );
        }

        /**
         * Finaliza la sesión de un usuario (lamada automáticamente durante el logout)...
         * @param updateUserSessionDto - Datos de actualización de sesión...
         * @returns Promise<UserSession> - La sesión actualizada...
         */
        @Post('end-session')
        @HttpCode(HttpStatus.OK)
        async endSession(@Body() updateUserSessionDto: UpdateUserSessionDTO) {
                return await this.userSessionService.endSession(
                        updateUserSessionDto,
                );
        }

        /**
         * Obtiene la sesión más reciente para un usuario específico (por DNI)...
         * @param dni - DNI del Usuario...
         * @returns Promise<UserSession | null> - Devuelve una sesión (o null si no la encuentra)...
         */
        @Get('user_dni/:dni')
        @Permissions('sessions:read')
        async getSessionByDNI(@Param('dni') dni: string) {
                return await this.userSessionService.getSessionByDNI(dni);
        }

        /**
         * Obtiene la sesión más reciente para un usuario específico (por username)...
         * @param username - Usuario
         * @returns Promise<UserSession | null> - Devuelve una sesión (o null si no la encuentra)...
         */
        @Get('username/:username')
        @Permissions('sessions:read')
        async getSessionByUsername(@Param('username') username: string) {
                return await this.userSessionService.getSessionByUsername(
                        username,
                );
        }

        /**
         * Obtiene la sessión activa de un usuario (por DNI)...
         * @param dni - DNI de Usuario
         * @returns Promise<UserSession | null> - Devuelve una sesión (o null si no la encuentra)...
         */
        @Get('active/:dni')
        @Permissions('sessions:read')
        async getActiveSession(@Param('dni') dni: string) {
                return await this.userSessionService.getActiveSession(dni);
        }
}
