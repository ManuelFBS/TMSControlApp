import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma/prisma.service';
import { UserSession } from '../../../core/entities/users-sessions/user-session.entity';
import { UserSessionRepository } from '../../../core/repositories/users-sessions/user-session.repository';

@Injectable()
export class PrismaUserSessionRepository implements UserSessionRepository {
        constructor(private readonly prisma: PrismaService) {}

        async create(userSession: UserSession): Promise<UserSession> {
                const createdSession = await this.prisma.userSession.create({
                        data: {
                                dni: userSession.dni,
                                username: userSession.username,
                                role: userSession.role,
                                initDate: userSession.initDate,
                                initHour: userSession.initHour,
                                finalDate: userSession.finalDate,
                                finalHour: userSession.finalHour,
                        },
                });

                return new UserSession(
                        createdSession.id,
                        createdSession.dni,
                        createdSession.username,
                        createdSession.role,
                        createdSession.initDate,
                        createdSession.initHour,
                        createdSession.finalDate,
                        createdSession.finalHour,
                );
        }

        async findAll(): Promise<UserSession[]> {
                const sessions = await this.prisma.userSession.findMany();

                return sessions.map(
                        (session) =>
                                new UserSession(
                                        session.id,
                                        session.dni,
                                        session.username,
                                        session.role,
                                        session.initDate,
                                        session.initHour,
                                        session.finalDate,
                                        session.finalHour,
                                ),
                );
        }

        async findByDNI(dni: string): Promise<UserSession | null> {
                const session = await this.prisma.userSession.findFirst({
                        where: { dni },
                        orderBy: { id: 'desc' }, //> Get the most recent session...
                });

                if (!session) return null;

                return new UserSession(
                        session.id,
                        session.dni,
                        session.username,
                        session.role,
                        session.initDate,
                        session.initHour,
                        session.finalDate,
                        session.finalHour,
                );
        }

        async findByUsername(username: string): Promise<UserSession | null> {
                const session = await this.prisma.userSession.findFirst({
                        where: { username },
                        orderBy: { id: 'desc' }, //> Get the most recent session...
                });

                if (!session) return null;

                return new UserSession(
                        session.id,
                        session.dni,
                        session.username,
                        session.role,
                        session.initDate,
                        session.initHour,
                        session.finalDate,
                        session.finalHour,
                );
        }

        async updateSessionEnd(
                dni: string,
                finalDate: Date,
                finalHour: string,
        ): Promise<UserSession> {
                //* Find the most recent active session (without finalDate)...
                const session = await this.prisma.userSession.findFirst({
                        where: {
                                dni,
                                finalDate: null, //> Only active sessions...
                        },
                        orderBy: { id: 'desc' },
                });

                if (!session) {
                        throw new Error(
                                `No active session found for user with DNI: ${dni}`,
                        );
                }

                const updatedSession = await this.prisma.userSession.update({
                        where: { id: session.id },
                        data: {
                                finalDate,
                                finalHour,
                        },
                });

                return new UserSession(
                        updatedSession.id,
                        updatedSession.dni,
                        updatedSession.username,
                        updatedSession.role,
                        updatedSession.initDate,
                        updatedSession.initHour,
                        updatedSession.finalDate,
                        updatedSession.finalHour,
                );
        }
}
