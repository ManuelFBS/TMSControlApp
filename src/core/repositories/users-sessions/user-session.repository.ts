import { UserSession } from '../../entities/users-sessions/user-session.entity';

export abstract class UserSessionRepository {
        abstract create(user: UserSession): Promise<UserSession>;
        abstract findAll(): Promise<UserSession[]>;
        abstract findByDNI(dni: string): Promise<UserSession | null>;
        abstract findByUsername(username: string): Promise<UserSession | null>;
        abstract updateSessionEnd(
                dni: string,
                finalDate: Date,
                finalHour: string,
        ): Promise<UserSession>;
}
