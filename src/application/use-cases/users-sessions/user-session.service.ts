import { Injectable } from '@nestjs/common';
import { UserSessionRepository } from '../../../core/repositories/users-sessions/user-session.repository';
import { UserSession } from '../../../core/entities/users-sessions/user-session.entity';
import { CreateUserSessionDTO } from '../../dto/users-sessions/create-user-session.dto';
import { UpdateUserSessionDTO } from '../../dto/users-sessions/update-user-session.dto';

@Injectable()
export class UserSessionService {
        constructor(
                private readonly userSessionRepository: UserSessionRepository,
        ) {}

        async createSession(
                createUserSessionDTO: CreateUserSessionDTO,
        ): Promise<UserSession> {
                //* Se crea una nueva sesión de usuario...
                const userSession = new UserSession(
                        0, //> La ID será asignada por la BD...
                        createUserSessionDTO.dni,
                        createUserSessionDTO.username,
                        createUserSessionDTO.role,
                        new Date(createUserSessionDTO.initDate),
                        createUserSessionDTO.initHour,
                        null, //> finalDate inicia como null...
                        null, //> finalHour inicia como null...
                );

                //* Se guarda en la BD...
                return await this.userSessionRepository.create(userSession);
        }

        async endSession(
                updateUserSessionDTO: UpdateUserSessionDTO,
        ): Promise<UserSession> {
                const finalDate = new Date(updateUserSessionDTO.finalDate);

                return await this.userSessionRepository.updateSessionEnd(
                        updateUserSessionDTO.dni,
                        finalDate,
                        updateUserSessionDTO.finalHour,
                );
        }

        async getAllSessions(): Promise<UserSession[]> {
                return await this.userSessionRepository.findAll();
        }

        async getSessionByDNI(dni: string): Promise<UserSession | null> {
                return await this.userSessionRepository.findByDNI(dni);
        }

        async getSessionByUsername(
                username: string,
        ): Promise<UserSession | null> {
                return await this.userSessionRepository.findByUsername(
                        username,
                );
        }

        /**
         * Obtiene la sesión activa actual de un usuario (sesión sin fecha final)...
         * @param dni - DNI del Usuario...
         * @returns Promise<UserSession | null> - La sesión activa o nula si no se encuentra...
         */
        async getActiveSession(dni: string): Promise<UserSession | null> {
                const session = await this.userSessionRepository.findByDNI(dni);

                // Check if the session is active (no finalDate)
                if (session && !session.finalDate) {
                        return session;
                }

                return null;
        }
}
