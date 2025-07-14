import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { User } from '../../../core/entities/users/user.entity';
import { JWTPayload } from '../../../auth/interfaces/jwt-payload.interface';
import * as bcrypt from 'bcrypt';
import { TokenBlacklistService } from '../../use-cases/token/token-blacklist.service';
import { UserSessionService } from '../../use-cases/users-sessions/user-session.service';
import { CreateUserSessionDTO } from '../../dto/users-sessions/create-user-session.dto';
@Injectable()
export class AuthService {
        constructor(
                private readonly userService: UserService,
                private readonly jwtService: JwtService,
                private readonly tokenBlacklist: TokenBlacklistService,
                private readonly userServiceSession: UserSessionService,
        ) {}

        async validateUser(
                username: string,
                pass: string,
        ): Promise<User | null> {
                const user = await this.userService.findByUsername(username);
                if (!user) return null;

                const isMatch = await bcrypt.compare(pass, user.password);
                return isMatch ? user : null;
        }

        async validateUserByPayload(payload: JWTPayload): Promise<User> {
                const user = await this.userService.findUserByID(payload.sub);
                if (!user) {
                        throw new UnauthorizedException('Invalid token');
                }
                return user;
        }

        // eslint-disable-next-line @typescript-eslint/require-await
        async login(user: User) {
                const payload: JWTPayload = {
                        sub: user.id,
                        username: user.username,
                        role: user.role,
                };

                //* Crear la sesión del usuario...
                const sessionData: CreateUserSessionDTO = {
                        dni: user.dni,
                        username: user.username,
                        role: user.role,
                        initDate: new Date().toISOString(),
                        initHour: new Date().toLocaleTimeString(),
                };

                //* Se guarda la sesión del usuario en la BD...
                await this.userServiceSession.createSession(sessionData);

                return {
                        access_token: this.jwtService.sign(payload),
                        user: {
                                id: user.id,
                                username: user.username,
                                role: user.role,
                        },
                };
        }

        async logout(token: string): Promise<void> {
                //* Se obtiene el usuario del token antes de invalidarlo...
                const payload = this.jwtService.decode(token);
                const user = await this.userService.findUserByID(payload.sub);

                if (user) {
                        //* Finalizar la sesión del usuario...
                        const sessionData = {
                                dni: user.dni,
                                finalDate: new Date().toISOString(),
                                finalHour: new Date().toLocaleTimeString(),
                        };

                        try {
                                await this.userServiceSession.endSession(
                                        sessionData,
                                );
                        } catch (error) {
                                console.error(
                                        'Error ending user session:',
                                        error,
                                );
                                //! throw new UnauthorizedException(
                                //!         'Error ending session...',
                                //! );
                        }
                }

                //* Se invalida el token del usuario...
                await this.tokenBlacklist.blacklistToken(token);
        }
}
